export interface Payment {
  id: string;
  orderId: string;
  paymentMethodId: string;
  paymentMethodName: string;
  transactionId: string;
  amountPaid: number;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  methodName: string;
}

export interface CreatePaymentRequest {
  idOrder: string;
  idPaymentMethod: string;
  transactionId: string;
  amountPaid: number;
}
