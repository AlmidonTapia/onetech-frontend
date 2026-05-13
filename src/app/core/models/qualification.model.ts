export interface Qualification {
  id: string;
  idProduct: string;
  userId: string;
  userFullName: string;
  rating: number;
  commentText: string;
  createdAt: string;
}

export interface CreateQualificationRequest {
  idProduct: string;
  rating: number;
  commentText: string;
}
