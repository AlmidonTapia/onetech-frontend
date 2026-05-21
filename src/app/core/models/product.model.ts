export interface Product {
  idProduct: string;
  productName: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: 'NEW' | 'BESTSELLER' | 'OFFER' | string;
  stockQuantity: number;
  specifications?: Record<string, any>;
  idCategory: string;
  categoryName?: string;
  idBrand: string;
  brandName?: string;
  images?: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface ProductImage {
  idProductImage: string;
  imageUrl: string;
  isPrincipal: boolean;
}

export interface CreateProductRequest {
  idCategory: string;
  idBrand: string;
  productName: string;
  sku: string;
  description: string;
  price: number;
  stockQuantity: number;
  specifications?: Record<string, any>;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  idCategory?: string;
  idBrand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  badge?: string;
  sort?: string;
}
