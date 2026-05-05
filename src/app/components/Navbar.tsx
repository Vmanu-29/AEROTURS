import { Link, useLocation } from 'react-router';
import { Plane, User, Ticket, Menu } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-lg shadow-lg">
              <Plane className="h-7 w-7 text-white" />
            </div>

            <div>
              <span className="font-bold text-2xl text-gray-900">
                AEROTURS
              </span>
              <p className="text-xs text-gray-500 -mt-1">
                Vuela con nosotros
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className={`hover:text-blue-600 transition-colors font-medium ${
                location.pathname === '/'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              Reserva tu vuelo
            </Link>

            <Link
              to="/registro"
              className={`hover:text-blue-600 transition-colors font-medium ${
                location.pathname === '/registro'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              Registro
            </Link>

            <Link
              to="/estado-vuelo"
              className={`hover:text-blue-600 transition-colors font-medium ${
                location.pathname === '/estado-vuelo'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              Estado del vuelo
            </Link>

            <Link
              to="/my-bookings"
              className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium ${
                location.pathname === '/my-bookings'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              <Ticket className="h-4 w-4" />
              Mis Reservas
            </Link>

          </div>

          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

          </div>

        </div>
      </div>
    </nav>
  );
}