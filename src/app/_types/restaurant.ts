export type TRestaurant = {
  id: number;
  name: string;
  description?: string | null;
  photo?: string | null;
  address?: string | null;
  city ?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  isDeleted?: boolean;
};