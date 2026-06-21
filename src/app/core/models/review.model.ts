export interface Review {
  idReview: string;
  idProduct: string;
  idUser: string;
  userFullName?: string;
  rating: number;
  title?: string;
  comment?: string;
  status?: string;
  createdAt?: string;
}

export interface CreateReviewRequest {
  idProduct: string;
  rating: number;
  title: string;
  comment: string;
}
