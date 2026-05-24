import React, { useState } from 'react';
import { TourPackage } from '../types/tour';
import { formatPrice } from '../utils/formatPrice';

type Props = {
  tour: TourPackage;
  price?: number;
  origin?: string;
  onReserve?: (passengers: number) => void;
};

export default function TourPackageCard({ tour, price, origin, onReserve }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [planType, setPlanType] = useState<'pareja' | 'familiar'>('pareja');
  const [passengerCount, setPassengerCount] = useState(2);
  const displayPrice = price ?? tour.price;

  const totalPrice = typeof displayPrice === 'number' ? displayPrice * passengerCount : 0;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-400 px-6 py-5 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_55%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-100/80">Plan de viaje</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{tour.title}</h3>
          </div>
          <div className="rounded-3xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {tour.days} días
          </div>
        </div>
        {tour.description && <p className="mt-4 text-sm text-slate-100/90">{tour.description}</p>}
      </div>

      <div className="p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tour.includesFood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {tour.includesFood ? 'Comidas incluidas' : 'Sin comidas'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{tour.hotels.length} hotel(es)</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{tour.places.length} destinos</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Precio por persona</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{typeof displayPrice === 'number' ? formatPrice(displayPrice) : '-'}</p>
            {origin && <span className="text-xs text-slate-500">{origin}</span>}
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{formatPrice(totalPrice)}</p>
            <span className="text-xs text-slate-500">{passengerCount} viajeros</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-900">Tipo de plan</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setPlanType('pareja');
                  setPassengerCount(2);
                }}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${planType === 'pareja' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
              >
                Pareja
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlanType('familiar');
                  setPassengerCount(3);
                }}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${planType === 'familiar' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
              >
                Familiar
              </button>
            </div>
            {planType === 'familiar' && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <label className="font-medium">Personas:</label>
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPassengerCount(count)}
                    className={`rounded-2xl border px-3 py-2 transition ${passengerCount === count ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`overflow-hidden transition-[max-height] duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">Lugares destacados</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {tour.places.map((p, i) => (
                    <li key={i} className="rounded-2xl bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{p.name}</p>
                      {p.description && <p className="mt-1 text-slate-600">{p.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">Hoteles incluidos</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {tour.hotels.map((h, i) => (
                    <li key={i} className="rounded-2xl bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{h.name}</p>
                      {h.address && <p className="mt-1 text-slate-600">{h.address}</p>}
                      {typeof h.rating === 'number' && (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Valoración: {h.rating}/5</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {expanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
          <button
            type="button"
            onClick={() => onReserve?.(passengerCount)}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700"
          >
            Reservar ahora
          </button>
        </div>
      </div>
    </article>
  );
}
