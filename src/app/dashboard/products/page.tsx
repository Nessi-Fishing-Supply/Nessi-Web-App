"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from '@context/auth';
import { getProductsByUserId } from '@services/product';
import ProductForm from '@components/forms/Product';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  userId: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (token) {
        console.log('Token:', token); // Log token value
        try {
          const data = await getProductsByUserId(token);
          console.log('Fetched products:', data); // Log fetched products
          setProducts(data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error('Unauthorized access - please check your token.');
          } else {
            console.error('Error fetching products:', error as Error);
          }
        }
      }
    };

    fetchProducts();
  }, [token]);

  const handleProductCreated = (products: Product[]) => {
    console.log('Products after creation:', products); // Log products after creation
    setProducts(products);
  };

  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to your products!</p>
      <ProductForm onProductCreated={handleProductCreated} />
      {products.length === 0 ? (
        <p>You don't have any products currently.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
