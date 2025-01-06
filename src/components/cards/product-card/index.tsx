import React, { useEffect } from 'react';
import styles from './ProductCard.module.scss';
import { deleteProduct } from '@services/product';
import { useAuth } from '@context/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Pill from '@components/indicators/pill';
import { FaTruck, FaTag } from 'react-icons/fa';
import Favorite from '@components/indicators/favorite';
import ProductReviews from '@components/indicators/product-reviews';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number | string;
    images: { image_url: string }[];
    userId: string;
    status: string;
  };
  onProductDeleted: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductDeleted }) => {
  const { token, userProfile } = useAuth();
  const router = useRouter();
  const price = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : `$${parseFloat(product.price).toFixed(2)}`;

  const handleDelete = async () => {
    if (token) {
      try {
        await deleteProduct(product.id, token);
        onProductDeleted(product.id);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error deleting product:', error.response ? error.response.data : error.message);
        } else if (error instanceof Error) {
          console.error('Unexpected error deleting product:', error.message);
        } else {
          console.error('Unexpected error deleting product');
        }
      }
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/item/${product.id}`);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const swiperElement = e.currentTarget.querySelector('.swiper__product-card');
    if (swiperElement) {
      swiperElement.classList.add('swiper-hovered');
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const swiperElement = e.currentTarget.querySelector('.swiper__product-card');
    if (swiperElement) {
      swiperElement.classList.remove('swiper-hovered');
    }
  };

  useEffect(() => {
    const stopPropagation = (e: Event) => e.stopPropagation();

    const navigationButtons = document.querySelectorAll('.swiper-button-prev, .swiper-button-next');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');

    navigationButtons.forEach(button => button.addEventListener('click', stopPropagation));
    paginationBullets.forEach(bullet => bullet.addEventListener('click', stopPropagation));

    return () => {
      navigationButtons.forEach(button => button.removeEventListener('click', stopPropagation));
      paginationBullets.forEach(bullet => bullet.removeEventListener('click', stopPropagation));
    };
  }, []);

  return (
    <a
      className={styles.card}
      onClick={handleViewDetails}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.carousel}>
        <Pill className={styles.pill} color="secondary">{product.status}</Pill>
        <Favorite className={styles.favorite} />
        <Swiper
          className="swiper__product-card"
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image.image_url} alt={`${product.title} image ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.contentWrapper}>
        <p className={styles.title}>{product.title}</p>
        <div className={styles.priceSection}>
          <p className={styles.price}>{price}</p>
          <ProductReviews count={0} average={4.2} />
        </div>
        {/* Move badges to its own component */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badge}>
            <FaTag className={styles.tagIcon} />
            <p>20% Off Sale</p>
          </div>
          <div className={styles.badge}>
            <FaTruck className={styles.truckIcon} />
            <p>Free Shipping</p>
          </div>
        </div>
          {/* {userProfile?.userId === product.userId && (
            <button onClick={handleDelete}>Delete Product</button>
          )} */}
      </div>
    </a>
  );
};

export default ProductCard;
