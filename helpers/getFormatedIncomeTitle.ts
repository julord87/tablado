export function getFormattedTitle(selectedDay: Date | null, year: number, month: number) {
    const locale = "es-ES";
  
    if (selectedDay) {
      // Si hay un día seleccionado, mostrar el día
      return `Ingresos - ${selectedDay.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    }
  
    // Si no hay día seleccionado, mostrar el mes
    const date = new Date(year, month - 1); // los meses en JS son 0-indexados
    const mes = date.toLocaleDateString(locale, { month: "long" });
    return `Ingresos - Mes de ${capitalize(mes)} de ${year}`;
  }
  
  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  