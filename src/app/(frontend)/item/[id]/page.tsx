import { getAllProducts } from '@/services/product';
import ProductClientComponent from './ItemIdPage';
import type { ProductWithImages } from '@/types/product';

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((product) => ({ id: product.id }));
  } catch (error) {
    console.error('Failed to fetch products during build:', error);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/products/${id}`);
  if (!res.ok) {
    console.error(`Failed to fetch product ${id}:`, res.statusText);
    return <p>Product not found</p>;
  }

  const product: ProductWithImages = await res.json();
  return <ProductClientComponent product={product} />;
}
