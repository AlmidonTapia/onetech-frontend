export interface Category {
  id: string;
  categoryName: string;
  parentIdCategory?: string | null;
  parentCategoryName?: string | null;
}

export interface CreateCategoryRequest {
  categoryName: string;
  parentIdCategory?: string | null;
}
