export type Place = {
  name: string;
  description?: string;
  image?: string;
};

export type Hotel = {
  name: string;
  address?: string;
  rating?: number; // 0-5
  image?: string;
};

export type TourPackage = {
  id: string;
  title: string;
  description?: string;
  places: Place[];
  hotels: Hotel[];
  includesFood: boolean;
  days: number;
  priceByOrigin?: Record<string, number>;
  price?: number;
};
