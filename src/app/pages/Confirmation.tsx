import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useParams, useNavigate } from 'react-router';
import { CheckCircle2, Plane, Calendar, Users, Download, Mail, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function Confirmation() {
  const { bookingRef } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const bookings = JSON.parse(sessionStorage.getItem('myBookings') || '[]');
    const found = bookings.find((b: any) => b.reference === bookingRef);
    
    if (!found) {
      navigate('/');
      return;
    }
    
    setBooking(found);
  }, [bookingRef, navigate]);

  if (!booking) {
    return null;
  }

  const { flight, passengers, totalPrice, reference } = booking;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">¡Reserva confirmada!</h1>
          <p className="text-xl text-gray-600">
            Tu vuelo ha sido reservado exitosamente
          </p>
        </div>

        {/* Booking Reference */}
        <Card className="p-8 mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl rounded-2xl">
          <p className="text-sm opacity-90 mb-2">Número de reserva</p>
          <p className="text-4xl font-bold tracking-wider mb-4">{reference}</p>
          <p className="text-sm opacity-90">
            Guarda este número para futuras consultas
          </p>
        </Card>

        {/* Flight Details */}
        <Card className="p-6 mb-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            Detalles del vuelo
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vuelo</span>
              <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ruta</span>
              <span className="font-medium">{flight.origin} → {flight.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Salida</span>
              <span className="font-medium">{flight.departureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Llegada</span>
              <span className="font-medium">{flight.arrivalTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duración</span>
              <span className="font-medium">{flight.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Clase</span>
              <span className="font-medium">
                {flight.class === 'economy' ? 'Económica' : 
                 flight.class === 'business' ? 'Business' : 'Primera clase'}
              </span>
            </div>
          </div>
        </Card>

        {/* Passengers */}
        <Card className="p-6 mb-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Pasajeros
          </h2>
          <div className="space-y-3">
            {passengers.map((passenger: any, index: number) => (
              <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                <p className="font-medium">
                  {passenger.firstName} {passenger.lastName}
                </p>
                <p className="text-sm text-gray-600">{passenger.email}</p>
                <p className="text-sm text-gray-600">{passenger.documentNumber}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="p-6 mb-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Resumen de pago</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(totalPrice.toFixed(2))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasas e impuestos</span>
              <span>{formatPrice((totalPrice * 0.21).toFixed(2))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cargo por servicio</span>
              <span>€15.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total pagado</span>
              <span className="text-green-600">
                {formatPrice((totalPrice + totalPrice * 0.21 + 15).toFixed(2))}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="w-full rounded-full hover:bg-blue-50 border-blue-600 text-blue-600">
            <Download className="h-4 w-4 mr-2" />
            Descargar billete
          </Button>
          <Button variant="outline" className="w-full rounded-full hover:bg-blue-50 border-blue-600 text-blue-600">
            <Mail className="h-4 w-4 mr-2" />
            Enviar por email
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 border-blue-700 rounded-xl">
          <h3 className="font-bold mb-3 text-white">Próximos pasos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <span className="text-white/95">Hemos enviado un email de confirmación a {passengers[0]?.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <span className="text-white/95">Realiza el check-in online 24 horas antes del vuelo</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <span className="text-white/95">Llega al aeropuerto al menos 2 horas antes de la salida</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <span className="text-white/95">Lleva tu documento de identidad y el número de reserva</span>
            </li>
          </ul>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/')}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
          <Button 
            onClick={() => navigate('/my-bookings')}
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            Ver mis reservas
          </Button>
        </div>
      </div>
    </div>
  );
}