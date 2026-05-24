import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import TourPackageCard from '../components/TourPackageCard';
import { mockTours } from '../../data/mockTours';
import { isAuthenticated } from '../utils/auth';
import { TourPackage } from '../types/tour';

const originOptions = [
  { value: 'Ciudad de México', label: 'Ciudad de México' },
  { value: 'Bogotá', label: 'Bogotá' },
  { value: 'Madrid', label: 'Madrid' },
  { value: 'Miami', label: 'Miami' },
];

export function Tours() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(originOptions[0].value);

  const handleSelectTour = (tour: TourPackage, passengers: number) => {
    const tourSelection = {
      tour,
      origin,
      planType: passengers === 2 ? 'pareja' : 'familiar',
      passengers,
    };
    sessionStorage.setItem('selectedTour', JSON.stringify(tourSelection));

    if (isAuthenticated()) {
      navigate('/passenger-info');
      return;
    }

    navigate('/login', { state: { from: '/tours' } });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-sky-600 via-slate-900 to-cyan-600 p-8 shadow-xl shadow-slate-300/30 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-cyan-100/90">Descubre tu próxima aventura</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Planes turísticos únicos para cada viaje
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-100/90">
                Elige entre experiencias culturales, aventuras en la naturaleza y estadías premium con todo incluido. Ajusta el origen y descubre precios personalizados para ti.
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

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Selecciona tu punto de partida</h2>
            <p className="mt-1 text-sm text-slate-600">Cambia la ciudad y revisa los precios actualizados al instante.</p>
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
            <p className="mt-2 text-xs text-slate-500">
              Precios calculados para tu origen.
            </p>
          </div>
        </div>

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
                  onReserve={(passengers) => handleSelectTour(tour, passengers)}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
