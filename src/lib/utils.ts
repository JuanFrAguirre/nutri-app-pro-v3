import {
  Log,
  LogMeal,
  LogProduct,
  Macros,
  MacrosSpanish,
  MealWithQuantity,
  ProductWithQuantity,
} from '@/types/types';

export const formatDate = (date: string, text: boolean = false) => {
  const dateObj = new Date(date);
  return text
    ? dateObj.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      })
    : dateObj.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
};

export const macrosKeys: Macros[] = ['calories', 'fats', 'carbs', 'protein'];
export const macrosKeysSpanish: MacrosSpanish[] = [
  'Calorías',
  'Grasas',
  'Carbohidratos',
  'Proteínas',
];
export const macrosIndexed: Record<
  Macros,
  { label: MacrosSpanish; unit: 'kcal' | 'g' }
> = {
  calories: {
    label: 'Calorías',
    unit: 'kcal',
  },
  fats: {
    label: 'Grasas',
    unit: 'g',
  },
  carbs: {
    label: 'Carbohidratos',
    unit: 'g',
  },
  protein: {
    label: 'Proteínas',
    unit: 'g',
  },
};

export const customFixedRound = (value: number, rounded: boolean = false) => {
  if (value % 1 === 0) {
    return String(value);
  }
  return rounded
    ? String(Math.round(value))
    : Number(value.toFixed(1)) % 1 === 0
    ? value.toFixed(1)
    : String(Math.round(value));
};

// Sum up a bunch of items by projecting each one to a number.
const sumBy = <T>(items: T[], fn: (item: T) => number): number =>
  items.reduce((sum, item) => sum + fn(item), 0);

export const getTotalMacros = (
  inputType: 'meal' | 'product' | 'logMeal' | 'logProduct' | 'log',
  input:
    | MealWithQuantity[]
    | ProductWithQuantity[]
    | LogMeal[]
    | LogProduct[]
    | Log[],
) => {
  const totalMacros = {
    calories: 0,
    fats: 0,
    carbs: 0,
    protein: 0,
  };

  if (inputType === 'product') {
    const products = input as ProductWithQuantity[];
    macrosKeys.forEach((k) => {
      totalMacros[k] = sumBy(
        products,
        (p) => (p[k] as number) * p.quantity * 0.01,
      );
    });
  } else if (inputType === 'logProduct') {
    const logs = input as LogProduct[];
    macrosKeys.forEach((k) => {
      totalMacros[k] = sumBy(
        logs,
        (l) => (l.product[k] as number) * l.quantity * 0.01,
      );
    });
  } else if (inputType === 'meal') {
    const meals = input as MealWithQuantity[];
    macrosKeys.forEach((k) => {
      totalMacros[k] = sumBy(
        meals,
        (m) =>
          m.quantity *
          m.mealProducts.reduce(
            (acc, curr) =>
              acc + (curr.product[k] as number) * curr.quantity * 0.01,
            0,
          ),
      );
    });
  } else if (inputType === 'logMeal') {
    const logs = input as LogMeal[];
    macrosKeys.forEach((k) => {
      totalMacros[k] = sumBy(
        logs,
        (l) =>
          l.quantity *
          l.meal.mealProducts.reduce(
            (acc, curr) =>
              acc + (curr.product[k] as number) * curr.quantity * 0.01,
            0,
          ),
      );
    });
  }

  return totalMacros;
};
