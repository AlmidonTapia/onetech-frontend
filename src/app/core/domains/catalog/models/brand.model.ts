export interface Brand {
  idBrand: string;
  brandName: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandRequest {
  brandName: string;
}

export interface UpdateBrandRequest {
  brandName: string;
  status: string;
}
