export type ShipmentStatus = 'PREPARANDO' | 'EN_CAMINO' | 'ENTREGADO';

export interface Shipment {
  id: string;
  orderId: string;
  shipmentMethodId: string;
  shipmentMethodName: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedArrival: string;
  status: ShipmentStatus;
}

export interface ShipmentMethod {
  id: string;
  methodName: string;
  basePrice: number;
}

export interface CreateShipmentRequest {
  idOrder: string;
  idShipmentMethod: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedArrival: string;
}
