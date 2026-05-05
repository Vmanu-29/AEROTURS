export default function RegistroPage(){
// Integrar en AEROTURS:
// 1. Guarda este archivo en src/app/pages/Registro.tsx
// 2. En tu router importa Registro y crea ruta /registro
// 3. Reemplaza en Navbar el texto Check-in por Registro y apunta a /registro
// 4. Usa esta página como reemplazo directo del módulo anterior

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-700 text-white p-6 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">AEROTURS</h1>
          <nav className="space-x-6 text-sm md:text-base">
            <a href="#">Inicio</a>
            <a href="#">Vuelos</a>
            <a href="#" className="font-semibold underline">Registro</a>
            <a href="#">Contacto</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-start">
        <section className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-3xl font-bold mb-2">Registro de Pasajero</h2>
          <p className="text-slate-600 mb-6">Ingresa tus datos para gestionar tu vuelo, seleccionar asiento y recibir tu pase de abordar.</p>
          <div className="grid gap-4">
            <input className="border rounded-xl p-3" placeholder="Código de reserva" />
            <input className="border rounded-xl p-3" placeholder="Nombre completo" />
            <input className="border rounded-xl p-3" placeholder="Documento de identidad" />
            <input className="border rounded-xl p-3" placeholder="Correo electrónico" />
            <select className="border rounded-xl p-3">
              <option>Selecciona asiento</option>
              <option>Ventana</option>
              <option>Pasillo</option>
              <option>Centro</option>
            </select>
            <button className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-3 font-semibold">Continuar Registro</button>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-3">Beneficios del Registro</h3>
            <ul className="space-y-2 text-slate-600">
              <li>• Ahorra tiempo en el aeropuerto</li>
              <li>• Elige asiento disponible</li>
              <li>• Confirma datos del vuelo</li>
              <li>• Recibe pase de abordar digital</li>
            </ul>
          </div>
          <div className="bg-blue-700 text-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-2">Horario disponible</h3>
            <p>El registro online se habilita 24 horas antes de la salida del vuelo.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
