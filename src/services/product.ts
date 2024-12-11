import axios from 'axios';

const API_URL = 'http://localhost:5003/products';

export const createProduct = async (product: {
  title: string;
  description: string;
  price: number;
  images: string[];
  userId: string;
}, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  try {
    const response = await axios.post(API_URL, product, {
      headers
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error in createProduct:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error in createProduct:', error);
    }
    throw error;
  }
};

export const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `${token}`
    }
  });
  return response.data;
};

export const getProductsByUserId = async (token: string) => {
  const headers = {
    Authorization: `${token}`
  };
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error in getProductsByUserId:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error in getProductsByUserId:', error as Error);
    }
    throw error;
  }
};
