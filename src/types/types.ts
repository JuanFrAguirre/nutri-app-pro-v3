export type Product = {
  id: string;
  title: string;
  image: string;
  calories: number;
  fats: number;
  carbs: number;
  proteins: number;
  presentationSize: number;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
  mealId: string | null;
};
