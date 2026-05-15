export interface Cart {
  idCart: string;
  idUser: string;
  items: CartItem[];
  totalAmount: number;
}

export interface CartItem {
  idCartDetail: string;
  idProduct: string;
  productName?: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface AddToCartRequest {
  idProduct: string;
  quantity: number;
}
