import React, { useState } from 'react';
import { useAuth } from '@context/auth';
import { createProduct, getProductsByUserId } from '@services/product';
import axios from 'axios';

const ProductForm: React.FC<{ onProductCreated: (products: any[]) => void }> = ({ onProductCreated }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    images: [''],
    userId: ''
  });
  const { token, userProfile } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setNewProduct(prevState => {
      const images = [...prevState.images];
      images[index] = value;
      return { ...prevState, images };
    });
  };

  const addImageField = () => {
    setNewProduct(prevState => ({
      ...prevState,
      images: [...prevState.images, '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token && userProfile) {
      console.log('Token:', token); // Log token value
      const product = { ...newProduct, userId: userProfile.id };
      try {
        await createProduct(product, token);
        const data = await getProductsByUserId(token);
        onProductCreated(data);
        setNewProduct({
          title: '',
          description: '',
          price: 0,
          images: [''],
          userId: ''
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error creating product:', error.response ? error.response.data : error.message);
        } else {
          console.error('Unexpected error creating product:', error as Error);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={newProduct.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={newProduct.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={newProduct.price}
        onChange={handleInputChange}
        placeholder="Price"
        required
      />
      {newProduct.images.map((image, index) => (
        <input
          key={index}
          type="text"
          name={`image-${index}`}
          value={image}
          onChange={(e) => handleImageChange(e, index)}
          placeholder="Image URL"
          required
        />
      ))}
      <button type="button" onClick={addImageField}>Add Another Image</button>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
