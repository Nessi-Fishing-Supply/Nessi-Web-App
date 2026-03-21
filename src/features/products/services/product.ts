import { get, post, put, del } from '@/libs/fetch';
import type { ProductWithImages } from '@/features/products/types/product';

const BASE_URL = '/api/products';

export const createProduct = async (data: {
  title: string;
  description: string;
  price: string;
  images?: { url: string }[];
}): Promise<ProductWithImages> => {
  return post<ProductWithImages>(BASE_URL, data);
};

export const getAllProducts = async (): Promise<ProductWithImages[]> => {
  return get<ProductWithImages[]>(BASE_URL);
};

export const getUserProducts = async (): Promise<ProductWithImages[]> => {
  return get<ProductWithImages[]>(`${BASE_URL}/user`);
};

export const getProductById = async (id: string): Promise<ProductWithImages> => {
  return get<ProductWithImages>(`${BASE_URL}/${id}`);
};

export const updateProduct = async (
  id: string,
  data: {
    title: string;
    description: string;
    price: string;
    images?: { url: string }[];
  },
): Promise<ProductWithImages> => {
  return put<ProductWithImages>(`${BASE_URL}/${id}`, data);
};

export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  return del<{ success: boolean }>(`${BASE_URL}/${id}`);
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const data = await post<{ url: string }>(`${BASE_URL}/upload`, formData);
  return data.url;
};
