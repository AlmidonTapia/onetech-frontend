export interface ContactMessage {
  idContactMessage: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateContactStatusRequest {
  status: 'UNREAD' | 'READ' | 'REPLIED';
}
