import { Flight } from '../types/flight';

export type FlightClass = Flight['class'];

export const flightClassDetails: Record<FlightClass, {
  label: string;
  priceNote: string;
  description: string;
}> = {
  economy: {
    label: 'Económica',
    priceNote: 'Precio base',
    description: 'Tarifa estándar con los servicios esenciales incluidos.'
  },
  business: {
    label: 'Business',
    priceNote: '10% de descuento empresarial',
    description: 'Más comodidad y beneficios ejecutivos con descuento de empresa.'
  },
  first: {
    label: 'Primera clase',
    priceNote: '+25% sobre el precio base',
    description: 'La experiencia más exclusiva, con privacidad y servicio premium.'
  }
};

export function getAdjustedFlightPrice(basePrice: number, flightClass: FlightClass): number {
  if (flightClass === 'business') {
    return Math.round(basePrice * 0.9);
  }

  if (flightClass === 'first') {
    return Math.round(basePrice * 1.25);
  }

  return basePrice;
}

export function applyFlightClassPricing(flight: Flight, flightClass: FlightClass): Flight {
  return {
    ...flight,
    class: flightClass,
    price: getAdjustedFlightPrice(flight.price, flightClass)
  };
}
