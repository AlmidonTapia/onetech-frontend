export interface Coupon {
  idCoupon: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  startDate?: string;
  expirationDate: string;
  usageLimit?: number;
  timesUsed?: number;
  active: boolean;
  status?: string;
}

export interface CreateCouponRequest {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  startDate?: string;
  expirationDate: string;
  usageLimit?: number;
}
