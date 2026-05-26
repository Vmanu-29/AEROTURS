import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Sparkles, Briefcase, Armchair, X, Calendar } from 'lucide-react';
import TourPackageCard from '../components/TourPackageCard';
import { mockTours } from '../../data/mockTours';
import { isAuthenticated } from '../utils/auth';
import { TourPackage } from '../types/tour';
import { Button } from '../components/ui/button';

const originOptions = [
  { value: 'Ciudad de México', label: 'Ciudad de México' },
  { value: 'Bogotá', label: 'Bogotá' },
  { value: 'Madrid', label: 'Madrid' },
  { value: 'Miami', label: 'Miami' },
];

export function Tours() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(originOptions[0].value);

  // Estados para controlar el Modal de Selección de Clase y Fecha
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travelDate, setTravelDate] = useState(''); // Nuevo estado para la fecha del viaje
  const [pendingTourData, setPendingTourData] = useState<{ tour: TourPackage; passengers: number } | null>(null);

  // Abrir el modal de selección de cabina al hacer clic en reservar
  const handleOpenClassSelection = (tour: TourPackage, passengers: number) => {
    setPendingTourData({ tour, passengers });
    setTravelDate(''); // Resetear la fecha cada vez que se abre un nuevo tour
    setIsModalOpen(true);
  };

  // Procesar la reserva final con la clase de avión y fecha elegida
  const handleConfirmTourClass = (selectedClass: 'First' | 'Business' | 'Economy') => {
    if (!pendingTourData || !travelDate) return;

    const { tour, passengers } = pendingTourData;
    let basePrice = tour.priceByOrigin?.[origin] ?? tour.price ?? 0;

    // Modificadores de tarifa oficiales de AEROTURS
    if (selectedClass === 'First') {
      basePrice = basePrice * 1.25; // +25% Primera Clase
    } else if (selectedClass === 'Business') {
      basePrice = basePrice * 0.90; // -10% Descuento Corporativo
    }

    // Formatear la fecha para que sea legible y compatible
    const formattedDate = new Date(travelDate + 'T00:00:00').toLocaleDateString();

    const tourSelection = {
      tour,
      origin,
      date: formattedDate,          // Enviamos la fecha seleccionada por el usuario
      planType: passengers === 2 ? 'pareja' : 'familiar',
      passengersCount: passengers, 
      bookingType: 'tour',          // Identifica que es un plan turístico
      selectedClass: selectedClass, // Envía 'First', 'Business' o 'Economy'
      totalPrice: basePrice * passengers
    };

    sessionStorage.setItem('selectedTour', JSON.stringify(tourSelection));
    setIsModalOpen(false);

    if (isAuthenticated()) {
      navigate('/passenger-info', { state: tourSelection });
      return;
    }

    navigate('/login', { 
      state: { 
        from: '/passenger-info', 
        pendingBooking: tourSelection 
      } 
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 relative">
      <div className="container mx-auto px-4">
        
        {/* Banner Principal */}
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-sky-600 via-slate-900 to-cyan-600 p-8 shadow-xl shadow-slate-300/30 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-cyan-100/90">Descubre tu próxima aventura</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Planes turísticos únicos para cada viaje
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-100/90">
                Elige entre experiencias culturales, aventuras en la naturaleza y estadías premium con todo incluido. Ajusta el origen y descubre precios personalizados para ti con vuelos incluidos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[420px]">
              <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm">
                <p className="text-sm text-cyan-100">Paquetes disponibles</p>
                <p className="mt-3 text-3xl font-bold">{mockTours.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm">
                <p className="text-sm text-cyan-100">Origen actual</p>
                <p className="mt-3 text-3xl font-bold">{origin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Origen */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Selecciona tu punto de partida</h2>
            <p className="mt-1 text-sm text-slate-600">Cambia la ciudad y revisa los precios actualizados al instante con traslados incluidos.</p>
          </div>

          <div className="w-full max-w-sm">
            <label htmlFor="origin" className="block text-sm font-medium text-slate-700">
              Origen de salida
            </label>
            <select
              id="origin"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {originOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catálogo de Paquetes */}
        <section aria-label="Listado de paquetes turísticos">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {mockTours.map((tour) => {
              const price = tour.priceByOrigin?.[origin] ?? tour.price ?? 0;
              return (
                <TourPackageCard
                  key={tour.id}
                  tour={tour}
                  price={price}
                  origin={origin}
                  onReserve={(passengers) => handleOpenClassSelection(tour, passengers)}
                />
              );
            })}
          </div>
        </section>
      </div>

      {/* MODAL DE SELECCIÓN DE CLASE Y FECHA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-2">
                <Armchair className="h-3.5 w-3.5" /> Configuración del traslado
              </span>
              <h3 className="text-xl font-bold text-slate-950">Personaliza tu viaje</h3>
              <p className="text-xs text-slate-500 mt-1">
                Elige la fecha de salida y la categoría en la que viajarán los <span className="font-semibold text-slate-700">{pendingTourData?.passengers} pasajeros</span>.
              </p>
            </div>

            {/* SECCIÓN DE FECHA */}
            <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label htmlFor="travel-date" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Calendar className="h-3.5 w-3.5 text-blue-600" /> Selecciona la fecha de salida:
              </label>
              <input
                id="travel-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]} // Evita seleccionar fechas pasadas
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* SECCIÓN DE CLASES (Habilitadas solo si hay fecha elegida) */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Selecciona la Clase:</p>
              
              {/* Económica */}
              <button
                type="button"
                disabled={!travelDate}
                onClick={() => handleConfirmTourClass('Economy')}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 text-left transition disabled:opacity-40 disabled:hover:border-slate-100 disabled:hover:bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Clase Económica</p>
                    <p className="text-xs text-slate-500">Mantiene el precio base del paquete.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">Tarifa Base</span>
              </button>

              {/* Business */}
              <button
                type="button"
                disabled={!travelDate}
                onClick={() => handleConfirmTourClass('Business')}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50/20 text-left transition disabled:opacity-40 disabled:hover:border-slate-100 disabled:hover:bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Clase Ejecutiva (Business)</p>
                    <p className="text-xs text-slate-500">Aplica 10% de descuento corporativo.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600">-10%</span>
              </button>

              {/* Primera Clase */}
              <button
                type="button"
                disabled={!travelDate}
                onClick={() => handleConfirmTourClass('First')}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50/20 text-left transition disabled:opacity-40 disabled:hover:border-slate-100 disabled:hover:bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Primera Clase</p>
                    <p className="text-xs text-slate-500">Asientos premium y catering selecto.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600">+25%</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}