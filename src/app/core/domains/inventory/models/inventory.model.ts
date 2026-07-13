export interface InventoryMovement {
  idInventoryMovement: string;
  idProduct: string;
  productName?: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  movementDate: string;
  status?: string;
}

export interface CreateInventoryMovementRequest {
  idProduct: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}
