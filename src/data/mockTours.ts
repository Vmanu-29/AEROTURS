import { TourPackage } from '../app/types/tour';

export const mockTours: TourPackage[] = [
  {
    id: 'tour-1',
    title: 'Cultura y Playas - 5 días',
    description: 'Visita monumentos históricos y disfruta de playas paradisíacas con todo incluido.',
    places: [
      { name: 'Centro Histórico', description: 'Recorrido guiado por plazas y museos.' },
      { name: 'Playa Dorada', description: 'Tiempo libre en una playa exclusiva con actividades acuáticas.' },
    ],
    hotels: [
      { name: 'Hotel Maravilla', address: 'Av. del Mar 123', rating: 4.5 },
    ],
    includesFood: true,
    days: 5,
    priceByOrigin: {
      'Ciudad de México': 2980000,
      'Bogotá': 2400000,
      'Madrid': 5900000,
      'Miami': 3600000,
    },
    price: 2400000,
  },
  {
    id: 'tour-2',
    title: 'Aventura y Naturaleza - 3 días',
    description: 'Caminatas, canopy y visitas a reservas naturales con guía local.',
    places: [
      { name: 'Reserva El Bosque', description: 'Senderos y miradores con fotografía natural.' },
      { name: 'Cascada Alta', description: 'Picnic y baño en piscina natural de aguas cristalinas.' },
    ],
    hotels: [
      { name: 'Eco Lodge', address: 'Km 12 Ruta Verde', rating: 4.2 },
    ],
    includesFood: false,
    days: 3,
    priceByOrigin: {
      'Ciudad de México': 1650000,
      'Bogotá': 1250000,
      'Madrid': 3350000,
      'Miami': 2050000,
    },
    price: 1250000,
  },
];
