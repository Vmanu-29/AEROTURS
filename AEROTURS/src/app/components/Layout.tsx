import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <footer className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">AEROTURS</h3>
              </div>
              <p className="text-white/80 text-sm">
                Tu compañía de confianza para volar a cualquier destino del mundo.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Reservar vuelos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Registro online</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del vuelo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gestionar reserva</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Equipaje</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Políticas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 AEROTURS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}