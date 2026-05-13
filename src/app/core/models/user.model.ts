export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  documentType?: string;
  documentNumber?: string;
  phone?: string;
  createdAt?: string;
}
export interface UpdateProfileRequest {
  documentType: string;
  documentNumber: string;
  phone: string;
}