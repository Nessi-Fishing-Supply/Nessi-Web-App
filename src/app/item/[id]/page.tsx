import { getProductById, getAllProducts } from '@services/product';
import ProductClientComponent from './ItemIdPage';

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

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product: Product) => ({
    id: product.id,
  }));
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const product = await getProductById(params.id);

  return <ProductClientComponent product={product} />;
};

export default ProductPage;
