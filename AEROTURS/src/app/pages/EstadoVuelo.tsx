export default function EstadoVuelo(){
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Estado de Vuelo</h1>
          <p className="text-slate-600 mb-6">Consulta horarios, puertas de embarque y estado actualizado de tu vuelo.</p>
          <div className="grid gap-4">
            <input className="border rounded-xl p-3" placeholder="Número de vuelo (Ej: AT102)" />
            <input className="border rounded-xl p-3" placeholder="Origen" />
            <input className="border rounded-xl p-3" placeholder="Destino" />
            <input type="date" className="border rounded-xl p-3" />
            <button className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-3 font-semibold">Consultar vuelo</button>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
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