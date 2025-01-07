"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  userId: string;
  created_at: string;
  updated_at: string;
  images: { image_url: string; image_name: string }[];
}

const ProductClientComponent = ({ product }: { product: Product }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      setLoading(true);
      // Fetch product logic if needed
      setLoading(false);
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <div>
        {product.images.map((image, index) => (
          <Image key={index} src={image.image_url} alt={image.image_name} width={500} height={500} />
        ))}
      </div>
    </div>
  );
};

export default ProductClientComponent;