const ExpenseCategory = [
  "publicidad",
  "bar",
  "sueldos",
  "artistas",
  "alquiler",
  "servicios",
  "insumos",
  "mantenimiento",
  "comisiones",
  "varios",
];

export const expenseCategories = Object.values(ExpenseCategory).map(
  (category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  })
);
