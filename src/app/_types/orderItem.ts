export type TOrderItem = {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export type TOrderTypeProp = {
  menuItemId: number;
  quantity: number;
  price: number;
}