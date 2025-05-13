const PaymentMethod = ["efectivo", "tarjeta", "bizum", "transferencia", "otro", "varios"];

export const paymentMethods = PaymentMethod.map((method) => ({
  value: method,
  label: method.charAt(0).toUpperCase() + method.slice(1),
}));