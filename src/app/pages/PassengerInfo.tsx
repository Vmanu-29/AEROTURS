import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Calendar, CreditCard, ArrowLeft, Armchair } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Passenger } from '../types/flight';
import { getAuthenticatedUserDetails } from '../utils/auth';

// Definición local de las clases de asientos soportadas
type SeatClass = 'Primera' | 'Empresarial' | 'Economica';

// Estructura para simular el mapa de asientos del avión
interface Seat {
  id: string;
  row: number;
  label: string;
  class: SeatClass;
  priceModifier: number;
  isOccupied: boolean;
}

export function PassengerInfo() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  
  // CONTROL DE PASOS: step 1 = Formulario Pasajeros, step 2 = Mapa de Asientos
  const [step, setStep] = useState<1 | 2>(1);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<{ [passengerIndex: number]: string }>({});
  const [airplaneSeats, setAirplaneSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const flightData = sessionStorage.getItem('selectedFlight');
    const tourData = sessionStorage.getItem('selectedTour');
    const authDetails = getAuthenticatedUserDetails();

    if (!flightData && !tourData) {
      navigate('/');
      return;
    }

    let parsed: any = null;
    if (flightData) {
      parsed = JSON.parse(flightData);
    } else {
      parsed = JSON.parse(tourData as string);
    }

    setBookingData(parsed);

    const initialPassengers = Array.from({ length: parsed.passengers }, (_, index) => {
      if (index === 0 && authDetails) {
        const [firstName, ...rest] = authDetails.nombre?.split(' ') ?? ['', ''];
        return {
          firstName: firstName || '',
          lastName: rest.join(' ') || '',
          email: authDetails.correo || '',
          phone: authDetails.telefono_principal || '',
          dateOfBirth: authDetails.fecha_nacimiento || '',
          documentNumber: authDetails.numero_documento || '',
        };
      }

      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        documentNumber: '',
      };
    });

    setPassengers(initialPassengers);

    // GENERAR MAPA DE ASIENTOS SIMULADO
    const seatsList: Seat[] = [];
    // Primera Clase: Filas 1 a 2 (Asientos A, B, C, D) - Costo extra +$50
    for (let r = 1; r <= 2; r++) {
      ['A', 'B', 'C', 'D'].forEach(l => {
        seatsList.push({ id: `${r}${l}`, row: r, label: l, class: 'Primera', priceModifier: 50, isOccupied: Math.random() < 0.2 });
      });
    }
    // Clase Empresarial: Filas 3 a 6 (Asientos A, B, C, D, E, F) - Costo extra +$25
    for (let r = 3; r <= 6; r++) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(l => {
        seatsList.push({ id: `${r}${l}`, row: r, label: l, class: 'Empresarial', priceModifier: 25, isOccupied: Math.random() < 0.3 });
      });
    }
    // Clase Económica: Filas 7 a 20 (Asientos A, B, C, D, E, F) - Costo extra +$0
    for (let r = 7; r <= 20; r++) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(l => {
        seatsList.push({ id: `${r}${l}`, row: r, label: l, class: 'Economica', priceModifier: 0, isOccupied: Math.random() < 0.4 });
      });
    }
    setAirplaneSeats(seatsList);

  }, [navigate]);

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // MANEJO DEL SUBMIT DEL PASO 1 (VALORAR FORMULARIO)
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allValid = passengers.every(p => 
      p.firstName && p.lastName && p.email && p.phone && p.dateOfBirth && p.documentNumber
    );

    if (!allValid) {
      alert('Por favor, completa todos los campos de los pasajeros');
      return;
    }

    // Si es un Tour, no requiere asignación de asientos de avión. Salta directo a pagar.
    if (Boolean(bookingData.tour)) {
      sessionStorage.setItem('passengers', JSON.stringify(passengers));
      navigate('/payment');
    } else {
      setStep(2); // Avanzar a selección de asientos
    }
  };

  // SELECCIONAR UN ASIENTO PARA EL PASAJERO ACTUAL EN EL PASO 2
  const handleSelectSeat = (seatId: string) => {
    // Verificar que no esté ocupado por otra persona externa
    const seat = airplaneSeats.find(s => s.id === seatId);
    if (seat?.isOccupied) return;

    // Verificar que otro pasajero del mismo grupo no lo tenga ya seleccionado
    const seatAlreadyTakenIdx = Object.keys(selectedSeats).find(
      key => selectedSeats[Number(key)] === seatId && Number(key) !== currentPassengerIndex
    );
    if (seatAlreadyTakenIdx !== undefined) {
      alert('Este asiento ya fue seleccionado por otro pasajero de tu reserva');
      return;
    }

    setSelectedSeats(prev => ({
      ...prev,
      [currentPassengerIndex]: seatId
    }));
  };

  // FINALIZAR TODO EL PROCESO (PASO 2) ENVIAR AL PAGO
  const handleFinalSubmit = () => {
    // Validar que todos los pasajeros tengan asiento asignado
    if (Object.keys(selectedSeats).length < passengers.length) {
      alert('Por favor, selecciona un asiento para cada uno de los pasajeros antes de continuar.');
      return;
    }

    // Formatear pasajeros inyectándoles su respectivo asiento
    const finalPassengersData = passengers.map((p, idx) => ({
      ...p,
      seat: selectedSeats[idx]
    }));

    // Guardar en sessionStorage y viajar a pasarela de pago
    sessionStorage.setItem('passengers', JSON.stringify(finalPassengersData));
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    navigate('/payment');
  };

  if (!bookingData) {
    return null;
  }

  const passengerCount = bookingData.passengers ?? 1;
  const isTourBooking = Boolean(bookingData.tour);
  const baseBookingPrice = isTourBooking ? bookingData.tour.price : bookingData.flight?.price ?? 0;

  // CÁLCULO DINÁMICO DEL TOTAL SUMANDO CARGOS EXTRA POR CLASES DE ASIENTOS SELECCIONADOS
  const calculateExtraCost = () => {
    let extra = 0;
    Object.values(selectedSeats).forEach(seatId => {
      const seat = airplaneSeats.find(s => s.id === seatId);
      if (seat) extra += seat.priceModifier;
    });
    return extra;
  };

  const finalTotalPrice = (baseBookingPrice * passengerCount) + calculateExtraCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => {
            if (step === 2) {
              setStep(1); // Permitir regresar a editar los campos de pasajeros
            } else {
              navigate(-1);
            }
          }}
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 2 ? 'Regresar a datos de pasajeros' : 'Volver'}
        </Button>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {step === 1 ? 'Información de pasajeros' : 'Selección de asientos'}
        </h1>
        <p className="text-gray-500 mb-6">
          {step === 1 ? 'Completa los datos de identificación.' : 'Elige los asientos para cada integrante de tu viaje.'}
        </p>

        {/* Resumen del Vuelo / Tour */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 rounded-xl text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-start">
            <div>
              {isTourBooking ? (
                <>
                  <p className="font-bold text-lg mb-2">Tour seleccionado</p>
                  <p className="text-white/90">{bookingData.tour.title}</p>
                  <p className="text-sm text-white/80">{bookingData.tour.description}</p>
                  <p className="text-sm text-white/80">Origen: {bookingData.origin}</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-lg mb-2">Vuelo {bookingData.flight.flightNumber}</p>
                  <p className="text-white/90">
                    {bookingData.flight.origin} → {bookingData.flight.destination}
                  </p>
                  <p className="text-sm text-white/80">
                    Salida: {bookingData.flight.departureTime} • Duración: {bookingData.flight.duration}
                  </p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatPrice(finalTotalPrice)}
              </p>
              <p className="text-sm text-white/80">
                {passengerCount} {passengerCount === 1 ? 'pasajero' : 'pasajeros'}
                {calculateExtraCost() > 0 && ` (Incluye cargos de asiento: +${formatPrice(calculateExtraCost())})`}
              </p>
            </div>
          </div>
        </Card>

        {/* ========================================================== */}
        {/* PASO 1: FORMULARIO DE PASAJEROS                            */}
        {/* ========================================================== */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            {passengers.map((passenger, index) => (
              <Card key={index} className="p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Pasajero {index + 1} {index === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-normal">Titular</span>}
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

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-blue-800">
              <p className="text-sm">
                <strong>Importante:</strong> Asegúrate de que los nombres coincidan exactamente 
                con los documentos de identidad que presentarás en el aeropuerto.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-2xl font-bold">
                Total Base: {formatPrice(baseBookingPrice * passengerCount)}
              </p>
              <Button 
                type="submit" 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full px-8"
              >
                Elegir Asientos
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================== */}
        {/* PASO 2: MAPA DE ASIENTOS CON PRIMERA/EMPRESARIAL/ECONOMICA */}
        {/* ========================================================== */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Selector del pasajero a asignar asiento actualmente */}
            <Card className="p-4 bg-white border border-gray-100 flex flex-wrap gap-2 items-center justify-between rounded-xl shadow-sm">
              <div className="text-sm font-medium text-gray-700">Asignando asiento para:</div>
              <div className="flex gap-2">
                {passengers.map((p, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant={currentPassengerIndex === idx ? 'default' : 'outline'}
                    className={`rounded-full px-4 text-xs ${currentPassengerIndex === idx ? 'bg-blue-600' : ''}`}
                    onClick={() => setCurrentPassengerIndex(idx)}
                  >
                    Pasajero {idx + 1}: {p.firstName || 'Pasajero'} {selectedSeats[idx] ? `(${selectedSeats[idx]})` : '(Sin asiento)'}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Código de colores / Leyenda */}
            <Card className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center font-medium text-gray-600">
              <div className="flex items-center justify-center gap-1.5"><div className="w-4 h-4 bg-amber-400 rounded"></div>Primera Class (+$50)</div>
              <div className="flex items-center justify-center gap-1.5"><div className="w-4 h-4 bg-purple-500 rounded"></div>Empresarial (+$25)</div>
              <div className="flex items-center justify-center gap-1.5"><div className="w-4 h-4 bg-blue-500 rounded"></div>Económica (+$0)</div>
              <div className="flex items-center justify-center gap-1.5"><div className="w-4 h-4 bg-gray-300 rounded"></div>Ocupado</div>
              <div className="flex items-center justify-center gap-1.5"><div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>Tu Selección</div>
            </Card>

            {/* Renderizado de Cabina e Inyección de Asientos */}
            <Card className="p-8 bg-slate-50 border border-gray-200 rounded-3xl max-w-md mx-auto shadow-inner flex flex-col items-center">
              <div className="w-full text-center text-xs tracking-widest text-gray-400 font-bold uppercase mb-6 pb-2 border-b-2 border-dashed border-gray-300">
                Frente del Avión / Cabina de Pilotos
              </div>

              <div className="w-full space-y-6">
                {/* 1. SECCIÓN PRIMERA CLASE */}
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3">
                  <div className="text-[10px] text-amber-700 font-bold tracking-wider uppercase mb-3 text-center">Primera Clase</div>
                  {Array.from(new Set(airplaneSeats.filter(s => s.class === 'Primera').map(s => s.row))).map(rowNum => (
                    <div key={rowNum} className="flex justify-center items-center gap-2 mb-2">
                      <span className="w-5 text-center text-xs text-gray-400 font-bold">{rowNum}</span>
                      {airplaneSeats.filter(s => s.row === rowNum).map((seat, sIdx) => (
                        <div key={seat.id} className="flex items-center">
                          {sIdx === 2 && <div className="w-10"></div> /* Pasillo del avión */}
                          <button
                            type="button"
                            disabled={seat.isOccupied}
                            className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center border-b-4
                              ${seat.isOccupied ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed' : 
                                selectedSeats[currentPassengerIndex] === seat.id ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md' :
                                Object.values(selectedSeats).includes(seat.id) ? 'bg-emerald-200 text-emerald-800 border-emerald-300' :
                                'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500'}`}
                            onClick={() => handleSelectSeat(seat.id)}
                            title={`${seat.id} - ${seat.class} (+${formatPrice(seat.priceModifier)})`}
                          >
                            <Armchair className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* 2. SECCIÓN CLASE EMPRESARIAL */}
                <div className="border border-purple-200 bg-purple-50/50 rounded-xl p-3">
                  <div className="text-[10px] text-purple-700 font-bold tracking-wider uppercase mb-3 text-center">Clase Empresarial</div>
                  {Array.from(new Set(airplaneSeats.filter(s => s.class === 'Empresarial').map(s => s.row))).map(rowNum => (
                    <div key={rowNum} className="flex justify-center items-center gap-1.5 mb-2">
                      <span className="w-5 text-center text-xs text-gray-400 font-bold">{rowNum}</span>
                      {airplaneSeats.filter(s => s.row === rowNum).map((seat, sIdx) => (
                        <div key={seat.id} className="flex items-center">
                          {sIdx === 3 && <div className="w-8"></div> /* Pasillo del avión */}
                          <button
                            type="button"
                            disabled={seat.isOccupied}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center border-b-4
                              ${seat.isOccupied ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed' : 
                                selectedSeats[currentPassengerIndex] === seat.id ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md' :
                                Object.values(selectedSeats).includes(seat.id) ? 'bg-emerald-200 text-emerald-800 border-emerald-300' :
                                'bg-purple-500 hover:bg-purple-600 text-white border-purple-600'}`}
                            onClick={() => handleSelectSeat(seat.id)}
                            title={`${seat.id} - ${seat.class} (+${formatPrice(seat.priceModifier)})`}
                          >
                            <Armchair className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* 3. SECCIÓN CLASE ECONÓMICA */}
                <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-3 h-72 overflow-y-auto custom-scrollbar shadow-inner">
                  <div className="text-[10px] text-blue-700 font-bold tracking-wider uppercase mb-3 text-center sticky top-0 bg-slate-50 py-1">Clase Económica</div>
                  {Array.from(new Set(airplaneSeats.filter(s => s.class === 'Economica').map(s => s.row))).map(rowNum => (
                    <div key={rowNum} className="flex justify-center items-center gap-1.5 mb-2">
                      <span className="w-5 text-center text-xs text-gray-400 font-bold">{rowNum}</span>
                      {airplaneSeats.filter(s => s.row === rowNum).map((seat, sIdx) => (
                        <div key={seat.id} className="flex items-center">
                          {sIdx === 3 && <div className="w-8"></div> /* Pasillo del avión */}
                          <button
                            type="button"
                            disabled={seat.isOccupied}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center border-b-4
                              ${seat.isOccupied ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed' : 
                                selectedSeats[currentPassengerIndex] === seat.id ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md' :
                                Object.values(selectedSeats).includes(seat.id) ? 'bg-emerald-200 text-emerald-800 border-emerald-300' :
                                'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'}`}
                            onClick={() => handleSelectSeat(seat.id)}
                            title={`${seat.id} - ${seat.class}`}
                          >
                            <Armchair className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Footer de confirmación final */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <p className="text-2xl font-bold">{formatPrice(finalTotalPrice)}</p>
                <p className="text-xs text-gray-500">Precio final con asientos incluidos</p>
              </div>
              <Button 
                type="button" 
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-full px-8"
                onClick={handleFinalSubmit}
              >
                Proceder al pago ({Object.keys(selectedSeats).length}/{passengers.length})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}