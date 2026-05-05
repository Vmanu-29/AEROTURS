import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Passenger } from '../types/flight';

export function PassengerInfo() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem('selectedFlight');
    if (!data) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(data);
    setBookingData(parsed);
    
    // Inicializar formularios de pasajeros
    const initialPassengers = Array.from({ length: parsed.passengers }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      documentNumber: ''
    }));
    setPassengers(initialPassengers);
  }, [navigate]);

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    const allValid = passengers.every(p => 
      p.firstName && p.lastName && p.email && p.phone && p.dateOfBirth && p.documentNumber
    );

    if (!allValid) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Guardar datos de pasajeros
    sessionStorage.setItem('passengers', JSON.stringify(passengers));
    navigate('/payment');
  };

  if (!bookingData) {
    return null;
  }

  const { flight, passengers: passengerCount } = bookingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900">Información de pasajeros</h1>

        {/* Flight Summary */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg mb-2 text-white">Vuelo {flight.flightNumber}</p>
              <p className="text-white/90">
                {flight.origin} → {flight.destination}
              </p>
              <p className="text-sm text-white/80">
                Salida: {flight.departureTime} • Duración: {flight.duration}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {formatPrice(flight.price * passengerCount)}
              </p>
              <p className="text-sm text-white/80">
                {passengerCount} {passengerCount === 1 ? 'pasajero' : 'pasajeros'}
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((passenger, index) => (
            <Card key={index} className="p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">
                Pasajero {index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`firstName-${index}`}
                      placeholder="Nombre"
                      className="pl-10 rounded-xl"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Apellidos</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`lastName-${index}`}
                      placeholder="Apellidos"
                      className="pl-10 rounded-xl"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`email-${index}`}
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="pl-10 rounded-xl"
                      value={passenger.email}
                      onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`phone-${index}`}
                      type="tel"
                      placeholder="+34 600 000 000"
                      className="pl-10 rounded-xl"
                      value={passenger.phone}
                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dob-${index}`}>Fecha de nacimiento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`dob-${index}`}
                      type="date"
                      className="pl-10 rounded-xl"
                      value={passenger.dateOfBirth}
                      onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`doc-${index}`}>Documento de identidad</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`doc-${index}`}
                      placeholder="DNI/Pasaporte"
                      className="pl-10 rounded-xl"
                      value={passenger.documentNumber}
                      onChange={(e) => updatePassenger(index, 'documentNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <p className="text-sm">
              <strong>Importante:</strong> Asegúrate de que los nombres coincidan exactamente 
              con los documentos de identidad que presentarás en el aeropuerto.
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-2xl font-bold">
              Total: {formatPrice(flight.price * passengerCount)}
            </p>
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full px-8"
            >
              Continuar al pago
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}