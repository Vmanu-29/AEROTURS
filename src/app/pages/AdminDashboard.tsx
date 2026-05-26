import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarClock, CheckCircle2, ClipboardList, Plane, Plus, Save, Search, XCircle, Armchair } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockFlights } from '../data/mockFlights';
import { getAuthUser, getCustomerAccounts } from '../utils/auth';
import { BookingRecord, BookingStatus, getStoredBookings, saveStoredBookings } from '../utils/bookings';
import { formatPrice } from '../utils/formatPrice';

const statusLabels: Record<string, string> = {
  paid: 'Comprado',
  pending: 'Pendiente',
  pending_payment: 'Pendiente',
  completed: 'Realizado',
  cancelled: 'Cancelado'
};

const statusClasses: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  pending_payment: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100'
};

function normalizeStatus(status: string): BookingStatus {
  if (status === 'pending_payment') {
    return 'pending';
  }

  if (['paid', 'pending', 'completed', 'cancelled'].includes(status)) {
    return status as BookingStatus;
  }

  return 'paid';
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [search, setSearch] = useState('');
  const [newBooking, setNewBooking] = useState({
    customerId: '',
    flightId: '',
    passengers: '1',
    status: 'pending' as BookingStatus
  });

  const customers = useMemo(() => getCustomerAccounts(), []);
  const user = getAuthUser();

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate('/login', { replace: true, state: { from: '/admin' } });
      return;
    }

    setBookings(getStoredBookings());
  }, [navigate, user]);

  const filteredBookings = bookings.filter((booking) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [
      booking.reference,
      booking.user?.nombre,
      booking.user?.correo,
      booking.flight?.flightNumber,
      booking.flight?.origin,
      booking.flight?.destination,
      booking.passengers?.map(p => p.seat).join(' '), // Permite buscar reservas filtrando por número de asiento
    ].some((value) => String(value || '').toLowerCase().includes(term));
  });

  const stats = {
    paid: bookings.filter((booking) => normalizeStatus(booking.status) === 'paid').length,
    pending: bookings.filter((booking) => normalizeStatus(booking.status) === 'pending').length,
    completed: bookings.filter((booking) => normalizeStatus(booking.status) === 'completed').length,
    cancelled: bookings.filter((booking) => normalizeStatus(booking.status) === 'cancelled').length,
  };

  const persistBookings = (nextBookings: BookingRecord[]) => {
    setBookings(nextBookings);
    saveStoredBookings(nextBookings);
  };

  const updateBooking = (reference: string, changes: Partial<BookingRecord>) => {
    persistBookings(
      bookings.map((booking) =>
        booking.reference === reference
          ? { ...booking, ...changes }
          : booking
      )
    );
  };

  const updateBookingFlight = (reference: string, flightId: string) => {
    const flight = mockFlights.find((item) => item.id === flightId);

    if (!flight) {
      return;
    }

    persistBookings(
      bookings.map((booking) => {
        if (booking.reference !== reference) {
          return booking;
        }

        const passengerCount = booking.passengers.length || 1;

        return {
          ...booking,
          flight,
          totalPrice: flight.price * passengerCount
        };
      })
    );
  };

  const handleCreateBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const customer = customers.find((item) => String(item.id_usuario) === newBooking.customerId);
    const flight = mockFlights.find((item) => item.id === newBooking.flightId);
    const passengerCount = Math.max(Number(newBooking.passengers), 1);

    if (!customer || !flight) {
      return;
    }

    const reference = `AD${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Lista de letras de asientos para autogenerar en la creación express del admin
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    const passengers = Array.from({ length: passengerCount }, (_, index) => {
      // Generación automática de asientos secuenciales en clase económica (fila 10 en adelante) para la gestión express del admin
      const row = 10 + Math.floor(index / 6);
      const letter = seatLetters[index % 6];
      const generatedSeat = `${row}${letter}`;

      return {
        firstName: index === 0 ? customer.nombre.split(' ')[0] || 'Cliente' : `Pasajero ${index + 1}`,
        lastName: index === 0 ? customer.nombre.split(' ').slice(1).join(' ') || 'AEROTURS' : 'AEROTURS',
        email: customer.correo,
        phone: '',
        dateOfBirth: '',
        documentNumber: '',
        seat: generatedSeat // Se añade el asiento auto-generado
      };
    });

    const createdBooking: BookingRecord = {
      reference,
      flight,
      passengers,
      totalPrice: flight.price * passengerCount,
      bookingDate: new Date().toISOString(),
      status: newBooking.status,
      paymentStatus: newBooking.status === 'paid' || newBooking.status === 'completed' ? 'paid' : 'pending',
      user: customer
    };

    persistBookings([createdBooking, ...bookings]);
    setNewBooking({ customerId: '', flightId: '', passengers: '1', status: 'pending' });
  };

  if (!user || user.id_rol !== 1) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-600">Administrador</p>
            <h1 className="text-4xl font-bold text-slate-950">Gestión de vuelos y reservas</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Consulta vuelos comprados, pendientes y realizados de todos los usuarios. También puedes crear, modificar o cancelar reservas para cualquier cliente.
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por ref, cliente, ruta o asiento"
              className="h-11 rounded-lg pl-10"
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="rounded-lg border border-emerald-100 bg-white p-5">
            <CheckCircle2 className="mb-3 h-6 w-6 text-emerald-600" />
            <p className="text-sm text-slate-500">Vuelos comprados</p>
            <p className="text-3xl font-bold text-slate-950">{stats.paid}</p>
          </Card>
          <Card className="rounded-lg border border-amber-100 bg-white p-5">
            <CalendarClock className="mb-3 h-6 w-6 text-amber-600" />
            <p className="text-sm text-slate-500">Vuelos pendientes</p>
            <p className="text-3xl font-bold text-slate-950">{stats.pending}</p>
          </Card>
          <Card className="rounded-lg border border-blue-100 bg-white p-5">
            <Plane className="mb-3 h-6 w-6 text-blue-600" />
            <p className="text-sm text-slate-500">Vuelos realizados</p>
            <p className="text-3xl font-bold text-slate-950">{stats.completed}</p>
          </Card>
          <Card className="rounded-lg border border-red-100 bg-white p-5">
            <XCircle className="mb-3 h-6 w-6 text-red-600" />
            <p className="text-sm text-slate-500">Cancelados</p>
            <p className="text-3xl font-bold text-slate-950">{stats.cancelled}</p>
          </Card>
        </div>

        <Card className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-950">Crear vuelo para cliente</h2>
          </div>

          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div>
              <Label className="mb-2 block">Cliente</Label>
              <Select value={newBooking.customerId} onValueChange={(value) => setNewBooking({ ...newBooking, customerId: value })}>
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id_usuario} value={String(customer.id_usuario)}>
                      {customer.nombre} - {customer.correo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Vuelo</Label>
              <Select value={newBooking.flightId} onValueChange={(value) => setNewBooking({ ...newBooking, flightId: value })}>
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Seleccionar vuelo" />
                </SelectTrigger>
                <SelectContent>
                  {mockFlights.map((flight) => (
                    <SelectItem key={flight.id} value={flight.id}>
                      {flight.flightNumber} {flight.origin}-{flight.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="admin-passengers" className="mb-2 block">Pasajeros</Label>
              <Input
                id="admin-passengers"
                type="number"
                min="1"
                max="8"
                value={newBooking.passengers}
                onChange={(event) => setNewBooking({ ...newBooking, passengers: event.target.value })}
                className="h-11 rounded-lg"
              />
            </div>

            <div>
              <Label className="mb-2 block">Estado</Label>
              <Select value={newBooking.status} onValueChange={(value) => setNewBooking({ ...newBooking, status: value as BookingStatus })}>
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Comprado</SelectItem>
                  <SelectItem value="completed">Realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="h-11 w-full rounded-lg bg-blue-600 hover:bg-blue-700">
                Crear reserva
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="rounded-lg p-10 text-center">
              <ClipboardList className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h2 className="text-xl font-bold text-slate-950">No hay reservas para mostrar</h2>
              <p className="mt-2 text-slate-600">Crea una reserva o cambia el término de búsqueda.</p>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const status = normalizeStatus(booking.status);

              return (
                <Card key={booking.reference} className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="text-lg font-bold text-slate-950">{booking.reference}</p>
                        <Badge className={statusClasses[status]}>
                          {statusLabels[status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{booking.user?.nombre || 'Cliente sin asignar'}</p>
                      <p className="text-sm text-slate-500">{booking.user?.correo || 'Sin correo'}</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">
                        {booking.flight?.airline || 'AEROTURS'} {booking.flight?.flightNumber}
                      </p>
                      <p className="text-sm text-slate-600">
                        {booking.flight?.origin} - {booking.flight?.destination}
                      </p>
                      <p className="text-sm text-slate-500">
                        {booking.flight?.departureTime} a {booking.flight?.arrivalTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700">Pasajeros: {booking.passengers.length}</p>
                      
                      {/* NUEVA SECCIÓN: Muestra los asientos asignados a cada pasajero dentro de la reserva */}
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {booking.passengers.map((passenger, pIdx) => (
                          <span 
                            key={pIdx} 
                            className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold"
                            title={`${passenger.firstName} ${passenger.lastName}`}
                          >
                            <Armchair className="h-3 w-3 text-blue-500" />
                            {passenger.seat || 'N/A'}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-400 mt-1.5">
                        Fecha: {new Date(booking.bookingDate).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-0.5">{formatPrice(booking.totalPrice)}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 lg:w-96">
                      <Select value={status} onValueChange={(value) => updateBooking(booking.reference, {
                        status: value,
                        paymentStatus: value === 'pending' ? 'pending' : booking.paymentStatus
                      })}>
                        <SelectTrigger className="h-10 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="paid">Comprado</SelectItem>
                          <SelectItem value="completed">Realizado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={booking.flight?.id || ''} onValueChange={(value) => updateBookingFlight(booking.reference, value)}>
                        <SelectTrigger className="h-10 rounded-lg">
                          <SelectValue placeholder="Cambiar vuelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockFlights.map((flight) => (
                            <SelectItem key={flight.id} value={flight.id}>
                              {flight.flightNumber} {flight.origin}-{flight.destination}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => updateBooking(booking.reference, { status: 'cancelled' })}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}