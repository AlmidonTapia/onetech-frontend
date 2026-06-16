export interface Payment {
  idPayment: string;
  idOrder: string;
  idPaymentMethod: string;
  paymentMethodName?: string;
  transactionId: string;
  amountPaid: number;
  paymentDate: string;
}

export interface PaymentMethod {
  idPaymentMethod: string;
  methodName: string;
  status?: string;
}

export interface CreatePaymentRequest {
  idOrder: string;
  idPaymentMethod: string;
  transactionId: string;
  amountPaid: number;
}

export interface CreatePaymentMethodRequest {
  methodName: string;
  status?: string;
}

export interface ProcessMpPaymentRequest {
  idOrder: string;
  internalPaymentMethodId: string;
  token: string;
  transactionAmount: number;
  installments: number;
  paymentMethodId: string;
  payerEmail: string;
}
