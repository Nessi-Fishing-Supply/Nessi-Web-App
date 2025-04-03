export interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    userId: string;
    createdAt: string;
  }
  
  export interface ProductImage {
    id: string;
    imageUrl: string;
    productId: string;
    createdAt: string;
  }
  
  export interface ProductWithImages extends Product {
    images: ProductImage[];
  }
  