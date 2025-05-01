export function getFormattedTitle(
  selectedDay: Date | null,
  year: number,
  month: number,
  tipo: "Ingresos" | "Egresos"
) {
  const locale = "es-ES";

  if (selectedDay) {
    return `${tipo} - ${selectedDay.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }

  const date = new Date(year, month - 1);
  const mes = date.toLocaleDateString(locale, { month: "long" });

  return `${tipo} - Mes de ${capitalize(mes)} de ${year}`;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
