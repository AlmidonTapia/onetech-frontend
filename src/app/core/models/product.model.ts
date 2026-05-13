export interface Product {
  id: string;
  productName: string;
  sku: string;
  description: string;
  price: number;
  stockQuantity: number;
  specifications?: Record<string, string>;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  images?: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
}

export interface ProductImage {
  id: string;
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
  specifications?: Record<string, string>;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
