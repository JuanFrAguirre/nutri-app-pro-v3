export type Product = {
  _id: string;
  title: string;
  image?: string | null;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  presentationSize: number;
  tags?: string | null;
  createdAt: Date;
  updatedAt: Date;
  LogProduct?: unknown;
  MealProduct?: unknown;
};

export type Macros = 'calories' | 'fats' | 'carbs' | 'protein';
export type MacrosSpanish =
  | 'Calorías'
  | 'Grasas'
  | 'Carbohidratos'
  | 'Proteínas';

export type MacrosTable = {
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
};

export type ProductWithQuantity = Product & {
  quantity: number;
  quantityType: 'absolute' | 'relative';
};

export type MealProduct = {
  _id: string;
  quantity: number;
  product: Omit<
    Product,
    'tags' | 'createdAt' | 'updatedAt' | 'LogProduct' | 'MealProduct'
  >;
};

export type LogProduct = {
  _id: string;
  quantity: number;
  product: Product;
};

export type Meal = {
  _id: string;
  title: string;
  userId: string;
  mealProducts: MealProduct[];
};

export type MealWithQuantity = Meal & {
  quantity: number;
};

export type LogProductForPOST = {
  product: string;
  quantity: number;
};

export type LogMeal = {
  _id: string;
  quantity: number;
  meal: Meal;
};

export type LogMealForPOST = {
  meal: string;
  quantity: number;
};

export type Log = {
  _id: string;
  user: string;
  date: string;
  logProducts: LogProduct[];
  logMeals: LogMeal[];
};

export type LogForPOST = {
  date: string;
  user: string;
  logProducts?: LogProductForPOST[];
  logMeals?: LogMealForPOST[];
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
