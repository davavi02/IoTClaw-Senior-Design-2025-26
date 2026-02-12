// types/prize.ts
export type Prize = {
  id: string;
  name: string;
  description: string;
  dateWon: string;
  imageUrl: string;

  isDelivered?: boolean;
  isShipped?: boolean;
  // whatever else
};
