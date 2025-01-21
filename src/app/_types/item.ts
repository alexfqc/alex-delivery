export type TFoodType = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  menuItems?: TItem[];
  isDeleted: boolean;
}

export type TItem = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  photo?: string | null;
  restaurantId: number;
  createdAt: Date;
  updatedAt: Date;
  foodTypes?: TFoodType[];
  isDeleted: boolean;
}