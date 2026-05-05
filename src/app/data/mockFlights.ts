import { Flight } from '../types/flight';

export const mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'AT101',
    origin: 'MAD',
    destination: 'BCN',
    departureTime: '08:00',
    arrivalTime: '09:30',
    duration: '1h 30m',
    price: 356000,
    airline: 'AEROTURS',
    availableSeats: 42,
    class: 'economy'
  },
  {
    id: '2',
    flightNumber: 'AT202',
    origin: 'MAD',
    destination: 'BCN',
    departureTime: '12:00',
    arrivalTime: '13:30',
    duration: '1h 30m',
    price: 476000,
    airline: 'AEROTURS',
    availableSeats: 28,
    class: 'economy'
  },
  {
    id: '3',
    flightNumber: 'AT303',
    origin: 'MAD',
    destination: 'BCN',
    departureTime: '18:00',
    arrivalTime: '19:30',
    duration: '1h 30m',
    price: 396000,
    airline: 'AEROTURS',
    availableSeats: 15,
    class: 'economy'
  },
  {
    id: '4',
    flightNumber: 'AT401',
    origin: 'BCN',
    destination: 'PAR',
    departureTime: '09:00',
    arrivalTime: '11:00',
    duration: '2h 00m',
    price: 596000,
    airline: 'AEROTURS',
    availableSeats: 35,
    class: 'economy'
  },
  {
    id: '5',
    flightNumber: 'AT501',
    origin: 'MAD',
    destination: 'LON',
    departureTime: '07:30',
    arrivalTime: '09:00',
    duration: '2h 30m',
    price: 796000,
    airline: 'AEROTURS',
    availableSeats: 50,
    class: 'economy'
  },
  {
    id: '6',
    flightNumber: 'AT601',
    origin: 'MAD',
    destination: 'NYC',
    departureTime: '14:00',
    arrivalTime: '17:30',
    duration: '8h 30m',
    price: 2396000,
    airline: 'AEROTURS',
    availableSeats: 120,
    class: 'economy'
  },
  {
    id: '7',
    flightNumber: 'AT701',
    origin: 'MAD',
    destination: 'TYO',
    departureTime: '11:00',
    arrivalTime: '08:00',
    duration: '14h 00m',
    price: 3596000,
    airline: 'AEROTURS',
    availableSeats: 80,
    class: 'economy'
  },
  {
    id: '8',
    flightNumber: 'AT801',
    origin: 'BCN',
    destination: 'MAD',
    departureTime: '10:00',
    arrivalTime: '11:30',
    duration: '1h 30m',
    price: 316000,
    airline: 'AEROTURS',
    availableSeats: 22,
    class: 'economy'
  }
];

export const destinations = [
  { code: 'MAD', name: 'Madrid', city: 'Madrid', country: 'España' },
  { code: 'BCN', name: 'Barcelona', city: 'Barcelona', country: 'España' },
  { code: 'PAR', name: 'París', city: 'París', country: 'Francia' },
  { code: 'LON', name: 'Londres', city: 'Londres', country: 'Reino Unido' },
  { code: 'NYC', name: 'Nueva York', city: 'Nueva York', country: 'Estados Unidos' },
  { code: 'TYO', name: 'Tokio', city: 'Tokio', country: 'Japón' },
  { code: 'ROM', name: 'Roma', city: 'Roma', country: 'Italia' },
  { code: 'BER', name: 'Berlín', city: 'Berlín', country: 'Alemania' }
];