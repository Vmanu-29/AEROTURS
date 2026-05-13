export default function EstadoVuelo(){
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Estado de Vuelo</h1>
          <p className="text-slate-600 mb-6">Consulta horarios, puertas de embarque y estado actualizado de tu vuelo.</p>
          <form className="grid gap-4">
            <div>
              <label htmlFor="flight-number" className="block text-sm font-semibold text-slate-700 mb-1">Número de vuelo</label>
              <input id="flight-number" type="text" className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" placeholder="AT102" required />
            </div>
            <div>
              <label htmlFor="flight-origin" className="block text-sm font-semibold text-slate-700 mb-1">Origen</label>
              <input id="flight-origin" type="text" className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" placeholder="Bogotá" required />
            </div>
            <div>
              <label htmlFor="flight-destination" className="block text-sm font-semibold text-slate-700 mb-1">Destino</label>
              <input id="flight-destination" type="text" className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" placeholder="Medellín" required />
            </div>
            <div>
              <label htmlFor="flight-date" className="block text-sm font-semibold text-slate-700 mb-1">Fecha de vuelo</label>
              <input id="flight-date" type="date" className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" required />
            </div>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" aria-label="Consultar estado del vuelo">Consultar vuelo</button>
          </form>
        </section>

        <section className="grid gap-6">
          <div className="bg-white rounded-2xl shadow p-6" role="status" aria-live="polite" aria-atomic="true">
            <h2 className="text-xl font-bold mb-4">Resultado de ejemplo</h2>
            <div className="space-y-3 text-slate-700">
              <p><strong>Vuelo:</strong> AT102</p>
              <p><strong>Ruta:</strong> Bogotá → Medellín</p>
              <p><strong>Salida:</strong> 10:30 AM</p>
              <p><strong>Llegada:</strong> 11:35 AM</p>
              <p><strong>Puerta:</strong> B12</p>
              <p><strong>Estado:</strong> En horario</p>
            </div>
          </div>

          <div className="bg-blue-700 text-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-2">Consejo</h3>
            <p>Llega al aeropuerto con mínimo 2 horas de anticipación para vuelos nacionales.</p>
          </div>
        </section>
      </div>
    </div>
  )
}