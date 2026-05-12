import { useSearchParams, useNavigate } from 'react-router';
import { useState, useMemo } from 'react';
import { Plane, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockFlights, destinations } from '../data/mockFlights';
import { Flight } from '../types/flight';
import { formatPrice } from '../utils/formatPrice';
import { applyFlightClassPricing, flightClassDetails, FlightClass } from '../utils/flightClassPricing';
import { getAuthUser } from '../utils/auth';

export function FlightResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookingError, setBookingError] = useState('');

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const passengers = searchParams.get('passengers') || '1';
  const tripType = searchParams.get('tripType') || 'one-way';
  const flightClass = (searchParams.get('flightClass') || 'economy') as FlightClass;
  const selectedClassDetails = flightClassDetails[flightClass] || flightClassDetails.economy;

  const fromCity = destinations.find(d => d.code === from)?.city || from;
  const toCity = destinations.find(d => d.code === to)?.city || to;

  const availableFlights = useMemo(() => {
    const routeFlights = from && to
      ? mockFlights.filter(flight => flight.origin === from && flight.destination === to)
      : mockFlights;

    return routeFlights.map((flight) => applyFlightClassPricing(flight, flightClass));
  }, [flightClass, from, to]);

  const handleSelectFlight = (flight: Flight) => {
    setBookingError('');

    if (flight.class === 'business') {
      const user = getAuthUser();

      if (!user || user.tipo_cuenta !== 'empresa') {
        setBookingError('La clase Business solo está disponible para cuentas empresariales. Inicia sesión con una cuenta de empresa o crea una cuenta empresarial para continuar.');
        return;
      }
    }

    setSelectedFlight(flight);
    // Guardar datos del vuelo en sessionStorage para los siguientes pasos
    sessionStorage.setItem('selectedFlight', JSON.stringify({
      flight,
      passengers: parseInt(passengers),
      tripType,
      departureDate
    }));
    navigate('/passenger-info');
  };

  if (availableFlights.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center rounded-xl">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No hay vuelos disponibles</h2>
            <p className="text-gray-600 mb-4">
              No encontramos vuelos de {fromCity} a {toCity} en la fecha seleccionada.
            </p>
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full">
              Volver a buscar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Vuelos disponibles</h1>
          <div className="flex items-center gap-2 text-gray-600">
            {from && to ? (
              <>
                <span>{fromCity}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{toCity}</span>
              </>
            ) : (
              <span>Todas las rutas disponibles</span>
            )}
            {departureDate && (
              <>
                <span className="ml-4">•</span>
                <Calendar className="h-4 w-4 ml-4" />
                <span>{new Date(departureDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </>
            )}
            <span className="ml-4">•</span>
            <span className="ml-4">{passengers} {parseInt(passengers) === 1 ? 'pasajero' : 'pasajeros'}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-gray-600">
              {availableFlights.length} vuelos encontrados
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Clase: {selectedClassDetails.label}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {selectedClassDetails.priceNote}
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Ordenar por: Precio más bajo
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
          <strong>Diferencia de clase:</strong> Económica mantiene el precio base, Business aplica un 10% de descuento empresarial y solo está disponible para cuentas de empresa. Primera clase aumenta el precio un 25% por sus servicios premium.
        </div>

        {bookingError && (
          <div role="alert" aria-live="polite" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
            {bookingError}
          </div>
        )}

        {/* Flight List */}
        <div className="space-y-4">
          {availableFlights.map((flight) => (
            <Card key={flight.id} className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{flight.airline}</p>
                      <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-2xl font-bold">{flight.departureTime}</p>
                      <p className="text-gray-600">{flight.origin}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <Plane className="h-4 w-4 text-gray-400 rotate-90" />
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{flight.duration}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Directo</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                      <p className="text-gray-600">{flight.destination}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <Badge variant="outline" className="border-blue-600 text-blue-700">
                      {flight.availableSeats} asientos disponibles
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {flightClassDetails[flight.class].label}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {flightClassDetails[flight.class].priceNote}
                    </Badge>
                  </div>
                </div>

                <div className="ml-8 text-right border-l pl-8">
                  <p className="text-sm text-gray-600 mb-1">Desde</p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {formatPrice(flight.price)}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">por persona</p>
                  <Button
                    onClick={() => handleSelectFlight(flight)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full"
                  >
                    Seleccionar
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Total: {formatPrice(flight.price * parseInt(passengers))}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <p className="text-sm">
            <strong>Nota:</strong> Los precios mostrados incluyen tasas e impuestos. 
            El equipaje de mano está incluido, el equipaje facturado puede tener coste adicional.
          </p>
        </div>
      </div>
    </div>
  );
}
