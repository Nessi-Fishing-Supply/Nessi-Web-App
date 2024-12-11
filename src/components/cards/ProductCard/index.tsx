import React from 'react';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number | string;
    images: string[];
    userId: string;
    status: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2);

  return (
    <div className={styles.card}>
      {product.images.length > 0 && <img src={product.images[0]} alt={product.title} />}
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>Price: ${price}</p>
      <p>Status: {product.status}</p>
    </div>
  );
};

export default ProductCard;
