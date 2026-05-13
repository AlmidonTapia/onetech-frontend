export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'EN_PROCESO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export interface Order {
  id: string;
  userId: string;
  userFullName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  addressId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderRequest {
  idAddress: string;
  items: { idProduct: string; quantity: number }[];
}
