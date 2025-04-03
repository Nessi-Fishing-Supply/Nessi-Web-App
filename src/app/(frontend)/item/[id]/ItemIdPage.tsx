'use client';

import { ProductWithImages } from '@/types/product';
import Image from 'next/image';
import React from 'react';

const ProductClientComponent = ({ product }: { product: ProductWithImages }) => {
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</p>

      <div>
        {product.images.map((image, index) => (
          image.imageUrl && (
            <Image
              key={index}
              src={image.imageUrl}
              alt={`${product.title} image ${index + 1}`}
              width={500}
              height={500}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ProductClientComponent;
