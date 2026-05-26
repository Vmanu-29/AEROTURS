import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Lock, ArrowLeft, Check, Plane, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { addStoredBooking } from '../utils/bookings';

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    // CORRECCIÓN: Priorizar los datos dinámicos que vienen en el historial de navegación (state)
    const stateData = location.state;

    if (stateData && stateData.passengers) {
      setBookingData(stateData);
      setPassengers(stateData.passengers);
    } else {
      // Respaldo por si refrescan la pantalla (Fallback)
      const tourData = sessionStorage.getItem('selectedTour');
      const flightData = sessionStorage.getItem('selectedFlight');
      const passengerData = sessionStorage.getItem('passengers');
      
      if ((!tourData && !flightData) || !passengerData) {
        navigate('/');
        return;
      }

      const activeBooking = tourData ? JSON.parse(tourData) : JSON.parse(flightData!);
      setBookingData(activeBooking);
      setPassengers(JSON.parse(passengerData));
    }
  }, [location.state, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generar referencia de reserva
    const bookingRef = 'SA' + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    // Armar payload unificado para la base de datos local
    const booking = {
      reference: bookingRef,
      bookingType: bookingData.bookingType || 'flight',
      tour: bookingData.tour || null,
      flight: bookingData.flight,
      passengers,
      totalPrice: grandTotal,
      bookingDate: new Date().toISOString(),
      status: 'paid',
      paymentStatus: 'paid'
    };

    addStoredBooking(booking);

    // Limpiar datos temporales de la sesión de manera segura
    sessionStorage.removeItem('selectedFlight');
    sessionStorage.removeItem('selectedTour');
    sessionStorage.removeItem('passengers');

    navigate(`/confirmation/${bookingRef}`);
  };

  if (!bookingData) {
    return null;
  }

  const isTour = bookingData.bookingType === 'tour';
  const { flight, passengersCount = 1 } = bookingData;

  // CONTROL DE COSTOS DE ACUERDO AL TIPO DE RESERVA
  // Si es un Tour, tomamos el valor neto ya calculado. Si es Vuelo, se calcula individualmente.
  const basePriceCalculated = isTour ? (bookingData.totalPrice) : (flight?.price * passengersCount);
  const taxes = isTour ? 0 : (basePriceCalculated * 0.21); // 21% IVA solo a boletos sueltos
  const serviceFee = 15;
  const grandTotal = basePriceCalculated + taxes + serviceFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-blue-50 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900">Pago seguro</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Pago */}
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-2xl bg-white shadow-sm border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Conexión protegida con cifrado SSL
                </span>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label className="text-base font-bold text-slate-800 mb-4 block">Método de pago</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors bg-white">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 font-semibold">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <span>Tarjeta de crédito/débito</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors bg-white">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer font-semibold">
                          PayPal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-xl p-4 hover:border-blue-600 transition-colors bg-white">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer font-semibold">
                          Transferencia bancaria
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        maxLength={19}
                        required
                        className="rounded-xl h-11"
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
                        className="rounded-xl h-11"
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
                          className="rounded-xl h-11"
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
                          className="rounded-xl h-11"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-1 rounded text-blue-600 focus:ring-blue-400" />
                    <label className="text-xs text-gray-700 leading-normal">
                      He leído y acepto los{' '}
                      <a href="#" className="text-blue-600 hover:underline font-semibold">
                        términos y condiciones de compra
                      </a>{' '}
                      y las{' '}
                      <a href="#" className="text-blue-600 hover:underline font-semibold">
                        políticas de devolución y cancelación
                      </a> de AEROTURS.
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-600/10"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Procesando pago de forma segura...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Confirmar y Pagar {formatPrice(grandTotal)}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Resumen Lateral Adaptativo */}
          <div>
            <Card className="p-6 sticky top-4 rounded-2xl bg-white shadow-sm border-slate-100">
              <h3 className="text-lg font-bold mb-4 text-slate-900 border-b pb-2">Resumen de reserva</h3>

              <div className="space-y-4 mb-6">
                {isTour ? (
                  /* Vista resumida para un Plan Completo */
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
                      <MapPin className="h-4 w-4" /> Plan Vacacional
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{bookingData.tour?.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Origen: {bookingData.origin}</p>
                    <p className="text-xs text-slate-500">Fecha de salida: {bookingData.date}</p>
                    <p className="text-xs text-slate-500">Cabina aérea: {bookingData.selectedClass}</p>
                  </div>
                ) : (
                  /* Vista resumida para un Vuelo Directo Tradicional */
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1">
                      <Plane className="h-4 w-4" /> Trayecto Aéreo
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      {flight?.airline} • <span className="text-xs text-slate-500">{flight?.flightNumber}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {flight?.origin} → {flight?.destination}
                    </p>
                    <p className="text-xs text-slate-500">
                      Horario: {flight?.departureTime} - {flight?.arrivalTime}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pasajeros</p>
                  <div className="space-y-1">
                    {passengers.map((p, i) => (
                      <div key={i} className="text-sm font-semibold text-slate-800 flex justify-between">
                        <span>{p.firstName} {p.lastName}</span>
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                          Asiento: {p.seat || 'Aceptado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desglose de Dinero Exacto */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{isTour ? 'Costo del paquete turístico' : 'Tarifa neta de vuelo'}</span>
                  <span>{formatPrice(basePriceCalculated)}</span>
                </div>
                
                {!isTour && (
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tasas e impuestos (21%)</span>
                    <span>{formatPrice(taxes)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Cargo administrativo</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between font-black text-xl text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50/80 border border-green-100 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-green-800">
                    <p className="font-bold mb-0.5">Garantía de mejor precio</p>
                    <p className="text-slate-600">Tu tarifa se encuentra totalmente protegida y congelada.</p>
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