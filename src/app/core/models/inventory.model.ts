export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface CreateInventoryMovementRequest {
  idProduct: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}
