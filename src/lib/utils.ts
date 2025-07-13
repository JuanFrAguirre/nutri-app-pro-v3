export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const customFixedRound = (value: number, rounded: boolean = false) => {
  if (value % 1 === 0) {
    return String(value);
  }
  return rounded ? String(Math.round(value)) : value.toFixed(2);
};
