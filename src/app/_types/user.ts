export type TCreateUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDeleted?: boolean;
}