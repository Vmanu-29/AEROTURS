import { useSearchParams, useNavigate } from 'react-router';
import { useState, useMemo } from 'react';
import { Plane, Clock, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
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

  // ESTADO PARA SABER SI ESTAMOS MOSTRANDO DISEÑOS DE FALLBACK (TODOS LOS VUELOS)
  const [isShowingFallback, setIsShowingFallback] = useState(false);

  // CONTROL AVANZADO DE RESULTADOS: RUTAS DIRECTAS O CATÁLOGO COMPLETO
  const availableFlights = useMemo(() => {
    let routeFlights = mockFlights;

    if (from && to) {
      routeFlights = mockFlights.filter(
        (flight) => flight.origin === from && flight.destination === to
      );

      // Si no hay vuelos específicos para esa ruta, tomamos la lista completa para no dejar la pantalla vacía
      if (routeFlights.length === 0) {
        routeFlights = mockFlights;
        setIsShowingFallback(true);
      } else {
        setIsShowingFallback(false);
      }
    }

    // Mapear los precios calculados según la clase solicitada corporativa o premium
    return routeFlights.map((flight) => applyFlightClassPricing(flight, flightClass));
  }, [flightClass, from, to]);

  const handleSelectFlight = (flight: Flight) => {
    setBookingError('');

    if (flight.class === 'business') {
      const user = getAuthUser();

      if (!user || user.tipo_cuenta !== 'empresa') {
        setBookingError(
          'La clase Business solo está disponible para cuentas empresariales. Inicia sesión con una cuenta de empresa o crea una cuenta empresarial para continuar.'
        );
        return;
      }
    }

    setSelectedFlight(flight);

    // Mapeo unificado para la inyección de la cabina de asientos del paso posterior
    // Capitalizamos la inicial del string ('economy' -> 'Economy') para que haga match con PassengerInfo.tsx
    const classMapping: Record<string, 'First' | 'Business' | 'Economy'> = {
      first: 'First',
      business: 'Business',
      economy: 'Economy',
    };
    const formattedClass = classMapping[flight.class] || 'Economy';

    sessionStorage.setItem(
      'selectedFlight',
      JSON.stringify({
        flight,
        passengersCount: parseInt(passengers),
        bookingType: 'flight',
        selectedClass: formattedClass,
        tripType,
        departureDate,
      })
    );

    navigate('/passenger-info', {
      state: {
        flight,
        passengersCount: parseInt(passengers),
        bookingType: 'flight',
        selectedClass: formattedClass,
        tripType,
        departureDate,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header de Búsqueda */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Vuelos disponibles</h1>
          <div className="flex items-center gap-2 text-gray-600">
            {from && to && !isShowingFallback ? (
              <>
                <span>{fromCity}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{toCity}</span>
              </>
            ) : (
              <span>Todas las rutas operadas por AEROTURS</span>
            )}
            {departureDate && (
              <>
                <span className="ml-4">•</span>
                <Calendar className="h-4 w-4 ml-4" />
                <span>
                  {new Date(departureDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </>
            )}
            <span className="ml-4">•</span>
            <span className="ml-4">
              {passengers} {parseInt(passengers) === 1 ? 'pasajero' : 'pasajeros'}
            </span>
          </div>
        </div>

        {/* Notificación Dinámica de Vuelos Generales */}
        {isShowingFallback && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Aviso de disponibilidad:</strong> No encontramos vuelos directos programados de{' '}
              <span className="font-bold">{fromCity}</span> a <span className="font-bold">{toCity}</span> para la fecha seleccionada. Para ayudarte a planificar tu viaje, te mostramos todas las rutas alternativas disponibles actualmente.
            </div>
          </div>
        )}

        {/* Filtros e Indicadores */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-gray-600">
              {availableFlights.length} vuelos encontrados
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Clase predeterminada: {selectedClassDetails.label}
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

        {/* Lista de Vuelos Renderizados */}
        <div className="space-y-4">
          {availableFlights.map((flight) => (
            <Card key={flight.id} className="p-6 hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{flight.airline}</p>
                      <p className="text-sm text-gray-600">
                        {flight.flightNumber} • <span className="font-semibold text-blue-600">{flight.origin} ➔ {flight.destination}</span>
                      </p>
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

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-blue-600 text-blue-700">
                      {flight.availableSeats} asientos disponibles
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {flightClassDetails[flight.class]?.label || flight.class}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {flightClassDetails[flight.class]?.priceNote || ''}
                    </Badge>
                  </div>
                </div>

                <div className="lg:ml-8 text-right border-t pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8 min-w-[180px]">
                  <p className="text-sm text-gray-600 mb-1">Desde</p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {formatPrice(flight.price)}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">por persona</p>
                  <Button
                    onClick={() => handleSelectFlight(flight)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full font-bold"
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

        {/* Footer Informativo */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <p className="text-sm">
            <strong>Nota:</strong> Los precios mostrados incluyen tasas e impuestos. El equipaje de mano está incluido, el equipaje facturado puede tener coste adicional.
          </p>
        </div>
      </div>
    </div>
  );
}