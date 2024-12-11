"use client";

import React, { useEffect, useState } from 'react';
import styles from './marketplace.module.scss';
import Navbar from '@components/navigation/Navbar';
import { getAllProducts } from '@services/product';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  userId: string;
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

  return (
    <div>
      <h1 className={styles.title}>This is a marketplace page</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
