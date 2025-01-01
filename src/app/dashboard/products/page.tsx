"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from '@context/auth';
import { getProductsByUserId } from '@services/product';
import ProductForm from '@components/forms/product';
import ProductCard from '@components/cards/product-card';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | string;
  images: { image_url: string }[];
  userId: string;
  status: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (token) {
        try {
          const data = await getProductsByUserId(token);
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
    setProducts(products);
  };

  const handleProductDeleted = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to your products!</p>
      <ProductForm onProductCreated={handleProductCreated} />
      {products.length === 0 ? (
        <p>You don't have any products currently.</p>
      ) : (
        <div>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onProductDeleted={handleProductDeleted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
