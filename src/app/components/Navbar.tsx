import { Link, useLocation, useNavigate } from 'react-router';
import { Lock, LogOut, Menu, Plane, Settings, Ticket, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getAuthUser, logout } from '../utils/auth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getAuthUser());

  useEffect(() => {
    setUser(getAuthUser());
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => setUser(getAuthUser());

    window.addEventListener('storage', syncAuth);
    window.addEventListener('aeroturs-auth-change', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('aeroturs-auth-change', syncAuth);
    };
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.id_rol === 1;

  const protectedLinkClass = (path: string) =>
    `transition-colors font-medium flex items-center gap-1.5 ${
      location.pathname === path
        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
        : isLoggedIn
          ? 'text-gray-700 hover:text-blue-600'
          : 'text-gray-400 hover:text-blue-600'
    }`;

  const protectedLinkState = (path: string) =>
    isLoggedIn ? undefined : { from: path };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav aria-label="Navegación principal" className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200">
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
              aria-current={location.pathname === '/' ? 'page' : undefined}
              className={`hover:text-blue-600 transition-colors font-medium ${
                location.pathname === '/'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              Reserva tu vuelo
            </Link>

            <Link
              to="/tours"
              aria-current={location.pathname === '/tours' ? 'page' : undefined}
              className={`hover:text-blue-600 transition-colors font-medium ${
                location.pathname === '/tours'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700'
              }`}
            >
              Planes turísticos
            </Link>

            <Link
              to={isLoggedIn ? '/estado-vuelo' : '/login'}
              state={protectedLinkState('/estado-vuelo')}
              aria-current={location.pathname === '/estado-vuelo' ? 'page' : undefined}
              className={protectedLinkClass('/estado-vuelo')}
            >
              {!isLoggedIn && <Lock className="h-3.5 w-3.5" />}
              Estado del vuelo
            </Link>

            <Link
              to={isLoggedIn ? '/my-bookings' : '/login'}
              state={protectedLinkState('/my-bookings')}
              aria-current={location.pathname === '/my-bookings' ? 'page' : undefined}
              className={protectedLinkClass('/my-bookings')}
            >
              {isLoggedIn ? <Ticket className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
              Mis Reservas
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                aria-current={location.pathname === '/admin' ? 'page' : undefined}
                className={protectedLinkClass('/admin')}
              >
                <Settings className="h-4 w-4" />
                Administrador
              </Link>
            )}

          </div>

          <div className="flex items-center gap-3">

            {isLoggedIn ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                aria-label="Iniciar sesión en AEROTURS"
              >
                <Link to="/login" state={{ from: location.pathname }}>
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" />
            </Button>

          </div>

        </div>
      </div>
    </nav>
  );
}
