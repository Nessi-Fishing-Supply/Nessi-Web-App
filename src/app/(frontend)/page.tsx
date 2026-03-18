'use client';

import React, { useEffect, useState } from 'react';
import { getAllProducts } from '@/features/products/services/product';
import { ProductWithImages } from '@/features/products/types/product';
import ProductCard from '@/features/products/components/product-card';
import Grid from '@/components/layout/grid';

export default function Home() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(
          data.map((product) => ({
            ...product,
            price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
          })),
        );
      } catch {
        // Failed to load products — empty state shown
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <main>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <Grid columns={4}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </main>
    </div>
  );
}
