const PaymentMethod = ["efectivo", "tarjeta", "bizum", "transferencia", "otro"];

export const paymentMethods = PaymentMethod.map((method) => ({
  value: method,
  label: method.charAt(0).toUpperCase() + method.slice(1),
}));