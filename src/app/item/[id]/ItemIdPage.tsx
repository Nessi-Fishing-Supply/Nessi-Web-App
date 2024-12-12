
"use client";

import { useState, useEffect } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      setLoading(true);
      // Fetch product logic if needed
      setLoading(false);
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <div>
        {product.images.map((image, index) => (
          <img key={index} src={image.image_url} alt={image.image_name} />
        ))}
      </div>
    </div>
  );
};

export default ProductClientComponent;