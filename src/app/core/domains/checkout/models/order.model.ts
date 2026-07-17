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
  snapDepartmentName?: string;
  snapProvinceName?: string;
  snapDistrictName?: string;
  snapAgencyAddress?: string;
  snapShipmentMethodName?: string;
  snapShippingCost?: number;
  snapConsigneeIsSelf?: boolean;
  snapConsigneeName?: string;
  snapConsigneeDoc?: string;
  snapConsigneePhone?: string;
  idCoupon?: string;
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
  shippingDestination: {
    mode: 'SAVED_ADDRESS' | 'NEW_ADDRESS';
    ubigeoCode: string;
    idAddress?: string;
    consignee?: {
      isSelf: boolean;
      fullName?: string;
      docNumber?: string;
      phone?: string;
    }
  };
  idShipmentMethod: string;
  idCoupon?: string;
  items: { idProduct: string; quantity: number; unitPrice: number }[];
}

export interface CreateOrderResponse {
  id: string;
}

