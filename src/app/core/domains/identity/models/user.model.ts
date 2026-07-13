import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { DocumentType } from '../enums/document-type.enum';

export interface User {
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | string;
  documentType?: DocumentType | string;
  documentNumber?: string;
  phone?: string;
  createdAt?: string;
  status?: UserStatus | string;
}

export interface UpdateProfileRequest {
  documentType: string;
  documentNumber: string;
  phone: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}