import React, { useState } from 'react';
import { useAuth } from '@context/auth';
import { createProduct, getProductsByUserId } from '@services/product';
import axios from 'axios';
import styles from './ProductForm.module.scss';

const ProductForm: React.FC<{ onProductCreated: (products: any[]) => void }> = ({ onProductCreated }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    images: [{ url: '', name: '' }],
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prevState => {
          const images = [...prevState.images];
          images[index] = { url: reader.result as string, name: file.name };
          return { ...prevState, images };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setNewProduct(prevState => ({
      ...prevState,
      images: [...prevState.images, { url: '', name: '' }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token && userProfile) {
      const product = { ...newProduct, userId: userProfile.id };
      try {
        await createProduct(product, token);
        const data = await getProductsByUserId(token);
        onProductCreated(data);
        setNewProduct({
          title: '',
          description: '',
          price: 0,
          images: [{ url: '', name: '' }],
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
          type="file"
          className={styles['file-input']}
          onChange={(e) => handleImageChange(e, index)}
          required
        />
      ))}
      <button type="button" onClick={addImageField}>Add Another Image</button>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
