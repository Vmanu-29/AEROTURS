import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { addStoredBooking } from '../utils/bookings';

export function Payment() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const flightData = sessionStorage.getItem('selectedFlight');
    const passengerData = sessionStorage.getItem('passengers');
    
    if (!flightData || !passengerData) {
      navigate('/');
      return;
    }
    
    setBookingData(JSON.parse(flightData));
    setPassengers(JSON.parse(passengerData));
  }, [navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generar referencia de reserva
    const bookingRef = 'SA' + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    // Guardar reserva en sessionStorage (en una app real, esto iría a una base de datos)
    const booking = {
      reference: bookingRef,
      flight: bookingData.flight,
      passengers,
      totalPrice: bookingData.flight.price * bookingData.passengers,
      bookingDate: new Date().toISOString(),
      status: 'paid',
      paymentStatus: 'paid'
    };

    addStoredBooking(booking);

    // Limpiar datos temporales
    sessionStorage.removeItem('selectedFlight');
    sessionStorage.removeItem('passengers');

    navigate(`/confirmation/${bookingRef}`);
  };

  if (!bookingData) {
    return null;
  }

  const { flight, passengers: passengerCount } = bookingData;
  const totalPrice = flight.price * passengerCount;
  const taxes = totalPrice * 0.21; // 21% IVA
  const serviceFee = 15;
  const grandTotal = totalPrice + taxes + serviceFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900">Pago seguro</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Conexión segura SSL
                </span>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label className="text-lg mb-4 block">Método de pago</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Tarjeta de crédito/débito</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          PayPal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          Transferencia bancaria
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        maxLength={19}
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre del titular</Label>
                      <Input
                        id="cardName"
                        placeholder="Como aparece en la tarjeta"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Fecha de expiración</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          maxLength={5}
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          maxLength={3}
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-1" />
                    <label className="text-sm text-gray-700">
                      He leído y acepto los{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        política de privacidad
                      </a>
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pagar {formatPrice(grandTotal.toFixed(2))}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25'%3E%3Crect fill='%23FF5F00' x='13' width='14' height='25'/%3E%3Crect fill='%23EB001B' width='20' height='25'/%3E%3Crect fill='%23F79E1B' x='20' width='20' height='25'/%3E%3C/svg%3E" alt="Mastercard" className="h-6" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25'%3E%3Crect fill='%231A1F71' width='40' height='25' rx='2'/%3E%3Ctext x='5' y='18' fill='white' font-size='14' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" className="h-6" />
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Resumen de reserva</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium">{flight.airline} - {flight.flightNumber}</p>
                  <p className="text-sm text-gray-600">
                    {flight.origin} → {flight.destination}
                  </p>
                  <p className="text-sm text-gray-600">
                    {flight.departureTime} - {flight.arrivalTime}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Pasajeros</p>
                  {passengers.map((p, i) => (
                    <p key={i} className="text-sm font-medium">
                      {p.firstName} {p.lastName}
                    </p>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vuelo ({passengerCount} {passengerCount === 1 ? 'pasajero' : 'pasajeros'})</span>
                  <span>{formatPrice(totalPrice.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasas e impuestos</span>
                  <span>{formatPrice(taxes.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cargo por servicio</span>
                  <span>{formatPrice(serviceFee.toFixed(2))}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(grandTotal.toFixed(2))}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Garantía de mejor precio</p>
                    <p className="text-xs">Si encuentras un precio mejor, te devolvemos la diferencia</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
