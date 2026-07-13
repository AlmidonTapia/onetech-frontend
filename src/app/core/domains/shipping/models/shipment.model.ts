export type ShipmentStatus = 'EN_PREPARACION' | 'EN_CAMINO' | 'ENTREGADO' | 'DEVOLUCION_PENDIENTE' | 'DEVUELTO';

export interface Shipment {
  idShipment: string;
  idOrder: string;
  idShipmentMethod: string;
  shipmentMethodName?: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedArrival: string;
  actualArrival?: string;
  status: ShipmentStatus;
  shipmentStatus?: ShipmentStatus;
  pickupCode?: string;
  receiptImageUrl?: string;
  shippedAt?: string;
}

export interface ShipmentMethod {
  idShipmentMethod: string;
  methodName: string;
  basePrice: number;
  status?: string;
}

export interface CreateShipmentRequest {
  idOrder: string;
  idShipmentMethod: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedArrival: string;
}

export interface DispatchShipmentData {
  trackingNumber: string;
  pickupCode: string;
  shippedAt: string;
  estimatedArrival: string;
}

export interface CreateShipmentMethodRequest {
  methodName: string;
  basePrice: number;
  status?: string;
}

export interface ShippingRate {
  idRate: number;
  idShipmentMethod: string;
  methodName?: string;
  idDepartment?: string;
  departmentName?: string;
  idProvince?: string;
  provinceName?: string;
  idDistrict?: string;
  districtName?: string;
  cost: number;
  isAvailable: boolean;
  agencyAddress?: string;
}

export interface CreateShippingRateRequest {
  idShipmentMethod: string;
  idDepartment?: string;
  idProvince?: string;
  idDistrict?: string;
  cost: number;
  isAvailable: boolean;
  agencyAddress?: string;
}

export interface LocationResponse {
  id: string;
  name: string;
}
