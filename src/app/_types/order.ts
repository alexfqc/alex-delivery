export type TOrder = {
  id: number;
  userId: string;
  restaurantId: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}