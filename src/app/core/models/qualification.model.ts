export interface Qualification {
  idQualification: string;
  idProduct: string;
  idUser: string;
  userFullName?: string;
  rating: number;
  commentText: string;
  qualificationDate: string;
  createdAt?: string;
}

export interface CreateQualificationRequest {
  idProduct: string;
  rating: number;
  commentText: string;
}
