"use client";

import React, { useEffect, useState } from 'react';
import styles from './marketplace.module.scss';
import Navbar from '@components/navigation/Navbar';
import { getAllProducts } from '@services/product';
import ProductCard from '@components/cards/ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number | string;
  images: { image_url: string }[];
  userId: string;
  status: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductDeleted = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div>
      <h1 className={styles.title}>This is a marketplace page</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onProductDeleted={handleProductDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
