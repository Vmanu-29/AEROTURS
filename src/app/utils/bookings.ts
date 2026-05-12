import { getAuthUser } from './auth';

const BOOKINGS_STORE_KEY = 'aerotursAllBookings';
const LEGACY_BOOKINGS_KEY = 'myBookings';

export type BookingStatus = 'paid' | 'pending' | 'completed' | 'cancelled';

export type BookingRecord = {
  reference: string;
  flight: any;
  passengers: any[];
  totalPrice: number;
  bookingDate: string;
  status: BookingStatus | string;
  paymentStatus?: 'paid' | 'pending' | string;
  user?: {
    id_usuario: number;
    correo: string;
    nombre: string;
    tipo_cuenta: 'persona' | 'empresa';
  };
};

function readJsonArray(key: string): BookingRecord[] {
  try {
    const raw = key === LEGACY_BOOKINGS_KEY
      ? sessionStorage.getItem(key)
      : localStorage.getItem(key);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function withCurrentUser(booking: BookingRecord): BookingRecord {
  if (booking.user) {
    return booking;
  }

  const user = getAuthUser();

  if (!user) {
    return booking;
  }

  return {
    ...booking,
    user: {
      id_usuario: user.id_usuario,
      correo: user.correo,
      nombre: user.nombre,
      tipo_cuenta: user.tipo_cuenta
    }
  };
}

export function getStoredBookings(): BookingRecord[] {
  const stored = readJsonArray(BOOKINGS_STORE_KEY);
  const legacy = readJsonArray(LEGACY_BOOKINGS_KEY).map(withCurrentUser);
  const merged = [...stored];

  legacy.forEach((booking) => {
    if (!merged.some((item) => item.reference === booking.reference)) {
      merged.push(booking);
    }
  });

  return merged;
}

export function saveStoredBookings(bookings: BookingRecord[]) {
  localStorage.setItem(BOOKINGS_STORE_KEY, JSON.stringify(bookings));

  const user = getAuthUser();
  const ownBookings = user
    ? bookings.filter((booking) => booking.user?.id_usuario === user.id_usuario || booking.user?.correo === user.correo)
    : [];

  sessionStorage.setItem(LEGACY_BOOKINGS_KEY, JSON.stringify(ownBookings));
}

export function addStoredBooking(booking: BookingRecord) {
  const bookings = getStoredBookings();
  saveStoredBookings([...bookings, withCurrentUser(booking)]);
}

export function getCurrentUserBookings(): BookingRecord[] {
  const user = getAuthUser();

  if (!user) {
    return [];
  }

  return getStoredBookings().filter(
    (booking) => booking.user?.id_usuario === user.id_usuario || booking.user?.correo === user.correo
  );
}
