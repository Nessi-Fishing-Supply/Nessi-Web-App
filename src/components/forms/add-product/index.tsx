'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@context/auth';
import { createProduct } from '@services/product';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@components/controls/input';
import Textarea from '@components/controls/text-area';
import Button from '@components/controls/button';
import type { ProductWithImages } from '@/types/product';
import { getUserProfile } from '@services/auth';

interface AddProductFormProps {
  onProductCreated: (product: ProductWithImages) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onProductCreated }) => {
  const methods = useForm();
  const { token } = useAuth();

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    images: [{ id: Date.now(), url: '', name: '' }],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => {
        const images = [...prev.images];
        images[index] = { ...images[index], url: reader.result as string, name: file.name };
        return { ...prev, images };
      });
    };
    reader.readAsDataURL(file);
  };

  const addImageField = () => {
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, { id: Date.now(), url: '', name: '' }],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const user = await getUserProfile();

      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        userId: user.id,
      };

      const createdProduct = await createProduct(payload, token);
      const fullProduct: ProductWithImages = {
        ...createdProduct,
        images: newProduct.images.map((img) => ({
          id: `${Date.now()}-${img.name}`,
          imageUrl: img.url,
          productId: createdProduct.id,
          createdAt: new Date().toISOString(),
        })),
      };

      onProductCreated(fullProduct);

      setNewProduct({
        title: '',
        description: '',
        price: '',
        images: [{ id: Date.now(), url: '', name: '' }],
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating product:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error creating product:', error as Error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          value={newProduct.title}
          onChange={handleInputChange as (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void}
          placeholder="Title"
          isRequired
        />
        <Textarea
          name="description"
          value={newProduct.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}
          placeholder="Description"
          isRequired
        />
        <Input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange as (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void}
          placeholder="Price"
          isRequired
        />
        {newProduct.images.map((image, index) => (
          <Input
            key={image.id}
            type="file"
            name={`image-${index}`}
            onChange={handleInputChange as (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void}
            isRequired
          />
        ))}
        <Button type="button" style="secondary" outline onClick={addImageField}>
          Add Another Image
        </Button>
        <Button type="submit">Add Product</Button>
      </form>
    </FormProvider>
  );
};

export default AddProductForm;
