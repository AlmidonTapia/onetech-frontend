export interface Category {
  idCategory: string;
  categoryName: string;
  parentIdCategory?: string | null;
  parentCategoryName?: string | null;
  subcategories?: Category[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  categoryName: string;
  parentIdCategory?: string | null;
}

export interface UpdateCategoryRequest {
  categoryName: string;
  parentIdCategory?: string | null;
  status: string;
}
