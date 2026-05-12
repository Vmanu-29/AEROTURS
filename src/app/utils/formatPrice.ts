/**
 * Formatea un precio en pesos colombianos (COP).
 * Acepta tanto números como cadenas con formato numérico.
 * @param price Precio en pesos colombianos
 * @returns String formateado con separadores de miles y símbolo $
 */
export function formatPrice(price: number | string): string {
  const value = typeof price === 'string' ? Number(price) : price;

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
