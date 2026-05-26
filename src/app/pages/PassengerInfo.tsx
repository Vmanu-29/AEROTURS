import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { User, CreditCard, Armchair } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getAuthUser } from '../utils/auth';
import { formatPrice } from '../utils/formatPrice';

interface PassengerSeatSelection {
  passengerIndex: number;
  seatNumber: string;
  className: 'First' | 'Business' | 'Economy';
  extraCharge: number;
}

export function PassengerInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAuthUser();

  const bookingData = location.state || {};
  const { flight, passengersCount = 1, bookingType = 'flight', selectedClass = 'Economy' } = bookingData;
  
  // Identifica si la reserva actual es un plan turístico
  const isTourBooking = bookingType === 'tour';

  const [step, setStep] = useState(1);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<PassengerSeatSelection[]>([]);

  const [formData, setFormData] = useState(() => {
    return Array.from({ length: passengersCount }, (_, index) => ({
      firstName: index === 0 ? user?.nombre?.split(' ')[0] || '' : '',
      lastName: index === 0 ? user?.nombre?.split(' ').slice(1).join(' ') || '' : '',
      email: index === 0 ? user?.correo || '' : '',
      phone: '',
      dateOfBirth: '',
      documentNumber: '',
    }));
  });

  const [occupiedSeats] = useState<string[]>(() => {
    return ['1B', '2A', '4C', '5D', '12A', '15F', '18B'];
  });

  // PROTECCIÓN HÍBRIDA: No expulsa al usuario si viene desde un Tour
  useEffect(() => {
    if (!isTourBooking && !flight) {
      navigate('/');
    }
  }, [flight, isTourBooking, navigate]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(2); 
  };

  const handleSeatClick = (seatNumber: string, row: number) => {
    let seatClass: 'First' | 'Business' | 'Economy' = 'Economy';
    let extraCharge = 0;

    if (row <= 2) {
      seatClass = 'First';
      extraCharge = 50;
    } else if (row <= 6) {
      seatClass = 'Business';
      extraCharge = 25;
    }

    const existingIndex = selectedSeats.findIndex(s => s.seatNumber === seatNumber);
    if (existingIndex !== -1) {
      const updatedSeats = selectedSeats.filter((_, i) => i !== existingIndex);
      setSelectedSeats(updatedSeats);
      return;
    }

    const filteredSeats = selectedSeats.filter(s => s.passengerIndex !== activePassengerIndex);
    setSelectedSeats([...filteredSeats, { passengerIndex: activePassengerIndex, seatNumber, className: seatClass, extraCharge }]);
  };

  // CÁLCULO PROPORCIONAL ADAPTATIVO
  const totalExtraCharges = selectedSeats.reduce((sum, item) => sum + item.extraCharge, 0);
  const basePrice = isTourBooking ? ((bookingData.totalPrice / passengersCount) || 0) : (flight?.price || 0);
  const totalPrice = (basePrice * passengersCount) + totalExtraCharges;

  // DESPACHO BLINDADO HACIA LA PASARELA DE PAGOS
  const handleProceedToPayment = () => {
    if (selectedSeats.length < passengersCount) {
      alert('Por favor, selecciona un asiento para cada uno de los pasajeros.');
      return;
    }

    const finalizedPassengers = formData.map((passenger, index) => {
      const seatInfo = selectedSeats.find(s => s.passengerIndex === index);
      return {
        ...passenger,
        seat: seatInfo ? seatInfo.seatNumber : 'N/A'
      };
    });

    const paymentState = {
      ...bookingData,
      passengers: finalizedPassengers,
      totalPrice: totalPrice 
    };

    // Si es un plan turístico, inyectamos un objeto 'flight' virtual estructurado
    // para evitar que el validador estricto de /payment devuelva al usuario al inicio.
    if (isTourBooking && !bookingData.flight) {
      paymentState.flight = {
        id: `TOUR-${bookingData.tour?.id || '000'}`,
        origin: bookingData.origin || 'Origen del Tour',
        destination: bookingData.tour?.title || 'Destino del Tour',
        price: basePrice,
        date: new Date().toLocaleDateString(), 
        departureTime: '08:00 AM',
        arrivalTime: '12:00 PM',
        airline: 'AEROTURS',
        class: selectedClass
      };
    }

    navigate('/payment', { state: paymentState });
  };

  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Resumen Dinámico Superior */}
        <Card className="mb-8 overflow-hidden border-none bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Resumen de tu Viaje</p>
              <h2 className="text-2xl font-bold mt-1">
                {isTourBooking ? bookingData.tour?.title : `${flight?.origin} hacia ${flight?.destination}`}
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                {passengersCount} {passengersCount === 1 ? 'Pasajero' : 'Pasajeros'} • Clase asignada: <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-xs">{selectedClass}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-100">Total Actual</p>
              <p className="text-3xl font-extrabold">{formatPrice(totalPrice)}</p>
            </div>
          </div>
        </Card>

        {step === 1 ? (
          /* PASO 1: FORMULARIO DE PASAJEROS */
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {formData.map((passenger, index) => (
              <Card key={index} className="p-6 bg-white border-slate-200 shadow-sm rounded-2xl">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Información del Pasajero {index + 1} {index === 0 && '(Titular)'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Nombre</Label>
                    <Input
                      required
                      value={passenger.firstName}
                      onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                      placeholder="Ej. Juan"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Apellido</Label>
                    <Input
                      required
                      value={passenger.lastName}
                      onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                      placeholder="Ej. Pérez"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Correo Electrónico</Label>
                    <Input
                      required
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Teléfono</Label>
                    <Input
                      required
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Fecha de Nacimiento</Label>
                    <Input
                      required
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => handleInputChange(index, 'dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Documento de Identidad (DNI/Pasaporte)</Label>
                    <Input
                      required
                      value={passenger.documentNumber}
                      onChange={(e) => handleInputChange(index, 'documentNumber', e.target.value)}
                      placeholder="Número de documento"
                    />
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg">
                Elegir Asientos
              </Button>
            </div>
          </form>
        ) : (
          /* PASO 2: MAPA DE ASIENTOS CON SELECCIÓN DE CABINA FILTRADA */
          <Card className="p-6 bg-white border-slate-200 shadow-sm rounded-2xl">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Armchair className="text-blue-600 h-6 w-6" />
                  Selección de Asientos del Traslado
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Cabina habilitada únicamente para la categoría: <span className="font-bold text-blue-600">{selectedClass}</span>.
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep(1)} className="self-start rounded-xl">
                Volver a datos
              </Button>
            </div>

            {/* Selector de indicador de pasajero actual */}
            <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-2">Asignando asiento para:</p>
              <div className="flex flex-wrap gap-2">
                {formData.map((passenger, idx) => {
                  const assigned = selectedSeats.find(s => s.passengerIndex === idx);
                  const isActive = activePassengerIndex === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePassengerIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        isActive ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {passenger.firstName || `Pasajero ${idx + 1}`} 
                      <span className="block text-xs font-normal opacity-90">
                        {assigned ? `Asiento: ${assigned.seatNumber}` : '❌ Sin asiento'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leyenda de clases */}
            <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-5 border border-slate-100">
              <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-amber-400" /><span>Primera Clase</span></div>
              <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-purple-500" /><span>Business</span></div>
              <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-blue-500" /><span>Economy</span></div>
              <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-emerald-500" /><span>Tu Asiento</span></div>
              <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-slate-200" /><span>No Disponible</span></div>
            </div>

            {/* Renderizado de Filas del Avión */}
            <div className="mx-auto max-w-md border-2 border-slate-200 rounded-t-[100px] bg-slate-50/50 p-6 pt-16 relative shadow-inner">
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {Array.from({ length: 20 }, (_, i) => {
                  const rowNumber = i + 1;
                  let rowClass: 'First' | 'Business' | 'Economy' = 'Economy';
                  if (rowNumber <= 2) rowClass = 'First';
                  else if (rowNumber <= 6) rowClass = 'Business';

                  const isClassAllowed = rowClass === selectedClass;

                  return (
                    <div key={rowNumber} className="grid grid-cols-[25px_1fr_35px_1fr] items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 text-center">{rowNumber}</span>

                      {/* Asientos de Ventana e Intermedios Izquierda (A, B, C) */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {seatLetters.slice(0, 3).map(letter => {
                          const seatId = `${rowNumber}${letter}`;
                          const isOcupado = occupiedSeats.includes(seatId);
                          const chosenByAny = selectedSeats.find(s => s.seatNumber === seatId);
                          const chosenByMe = chosenByAny?.passengerIndex === activePassengerIndex;

                          const isBtnDisabled = isOcupado || !isClassAllowed;

                          let btnStyle = 'bg-blue-500 border-blue-600 text-white';
                          if (rowClass === 'First') btnStyle = 'bg-amber-400 border-amber-500 text-amber-950';
                          if (rowClass === 'Business') btnStyle = 'bg-purple-500 border-purple-600 text-white';
                          
                          if (!isClassAllowed) btnStyle = 'bg-slate-100 border-slate-200 text-slate-300 opacity-30 cursor-not-allowed';
                          if (isOcupado) btnStyle = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed';
                          if (chosenByAny) btnStyle = 'bg-emerald-500 border-emerald-600 text-white';

                          return (
                            <button
                              key={seatId}
                              disabled={isBtnDisabled}
                              type="button"
                              onClick={() => handleSeatClick(seatId, rowNumber)}
                              className={`h-9 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center transition-all ${btnStyle} ${
                                chosenByMe ? 'ring-2 ring-emerald-400 ring-offset-1 scale-105 shadow-md' : ''
                              }`}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-[9px] font-bold text-slate-300 uppercase text-center">Pasillo</span>

                      {/* Asientos de Pasillo y Ventana Derecha (D, E, F) */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {seatLetters.slice(3, 6).map(letter => {
                          const seatId = `${rowNumber}${letter}`;
                          const isOcupado = occupiedSeats.includes(seatId);
                          const chosenByAny = selectedSeats.find(s => s.seatNumber === seatId);
                          const chosenByMe = chosenByAny?.passengerIndex === activePassengerIndex;

                          const isBtnDisabled = isOcupado || !isClassAllowed;

                          let btnStyle = 'bg-blue-500 border-blue-600 text-white';
                          if (rowClass === 'First') btnStyle = 'bg-amber-400 border-amber-500 text-amber-950';
                          if (rowClass === 'Business') btnStyle = 'bg-purple-500 border-purple-600 text-white';
                          
                          if (!isClassAllowed) btnStyle = 'bg-slate-100 border-slate-200 text-slate-300 opacity-30 cursor-not-allowed';
                          if (isOcupado) btnStyle = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed';
                          if (chosenByAny) btnStyle = 'bg-emerald-500 border-emerald-600 text-white';

                          return (
                            <button
                              key={seatId}
                              disabled={isBtnDisabled}
                              type="button"
                              onClick={() => handleSeatClick(seatId, rowNumber)}
                              className={`h-9 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center transition-all ${btnStyle} ${
                                chosenByMe ? 'ring-2 ring-emerald-400 ring-offset-1 scale-105 shadow-md' : ''
                              }`}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Acciones e Hito de Cierre */}
            <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Asientos elegidos: <span className="font-bold text-slate-800">{selectedSeats.length} / {passengersCount}</span>
              </p>
              <Button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length < passengersCount}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg disabled:opacity-50"
              >
                Continuar al Pago
                <CreditCard className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}