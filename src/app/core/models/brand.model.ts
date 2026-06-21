export interface Brand {
  idBrand: string;
  brandName: string;
  imageUrl?: string;
}

export interface CreateBrandRequest {
  brandName: string;
}
