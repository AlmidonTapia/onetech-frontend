export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'COMPLETADO' | 'CANCELADO' | 'EXPIRADO';

export interface Order {
  idOrder: string;
  idUser: string;
  userFullName?: string;
  details: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  orderStatus: OrderStatus;
  idAddress: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  idOrderDetail: string;
  idProduct: string;
  productName?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderRequest {
  idAddress: string;
  idShipmentMethod: string;
  idCoupon?: string;
  items: { idProduct: string; quantity: number; unitPrice: number }[];
}

export interface CreateOrderResponse {
  id: string;
}

