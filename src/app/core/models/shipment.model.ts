export type ShipmentStatus = 'EN_PREPARACION' | 'EN_CAMINO' | 'ENTREGADO' | 'DEVUELTO';

export interface Shipment {
  idShipment: string;
  idOrder: string;
  idShipmentMethod: string;
  shipmentMethodName?: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedArrival: string;
  status: ShipmentStatus;
}

export interface ShipmentMethod {
  idShipmentMethod: string;
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

export interface CreateShipmentMethodRequest {
  methodName: string;
  basePrice: number;
}
