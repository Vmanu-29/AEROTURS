export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  airline: string;
  availableSeats: number;
  class: 'economy' | 'business' | 'first';
}

export interface BookingData {
  flight: Flight;
  returnFlight?: Flight;
  passengers: Passenger[];
  seats: string[];
  totalPrice: number;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  documentNumber: string;
}

export interface SearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  flightClass: 'economy' | 'business' | 'first';
  tripType: 'one-way' | 'round-trip';
}
