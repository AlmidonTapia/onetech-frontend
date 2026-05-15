export interface Category {
  idCategory: string;
  categoryName: string;
  parentIdCategory?: string | null;
  parentCategoryName?: string | null;
  subcategories?: Category[];
}

export interface CreateCategoryRequest {
  categoryName: string;
  parentIdCategory?: string | null;
}
