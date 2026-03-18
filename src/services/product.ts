import axios from 'axios';
import type { ProductWithImages } from '@/types/product';

const BASE_URL = '/api/products';

export const createProduct = async (data: {
  title: string;
  description: string;
  price: string;
  images?: { url: string }[];
}): Promise<ProductWithImages> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const getAllProducts = async (): Promise<ProductWithImages[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getUserProducts = async (): Promise<ProductWithImages[]> => {
  const res = await axios.get(`${BASE_URL}/user`);
  return res.data;
};

export const getProductById = async (id: string): Promise<ProductWithImages> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const updateProduct = async (
  id: string,
  data: {
    title: string;
    description: string;
    price: string;
    images?: { url: string }[];
  }
): Promise<ProductWithImages> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${BASE_URL}/upload`, formData);
  return res.data.url;
};
