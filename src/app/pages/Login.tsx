import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowRight, LockKeyhole, Mail, Plane, ShieldCheck, TicketCheck, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { login } from '../utils/auth';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const user = await login(correo, password);

    if (!user) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid min-h-[680px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-blue-950/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden bg-blue-700 lg:block">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Avion de AEROTURS despegando"
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-800/45 to-sky-500/30" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                <Plane className="h-4 w-4" />
                AEROTURS Club
              </div>
              <h1 className="mb-4 max-w-xl text-5xl font-bold leading-tight">
                Gestiona tus viajes desde un solo lugar
              </h1>
              <p className="max-w-lg text-lg text-white/85">
                Accede a tus reservas, pases de abordar y beneficios de viajero frecuente con una cuenta segura.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              <Link to="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
                <div className="rounded-lg bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/25">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-950">AEROTURS</span>
                  <p className="text-xs text-slate-500">Vuela con nosotros</p>
                </div>
              </Link>

              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Inicio de sesión
                </p>
                <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                  Bienvenido de nuevo
                </h2>
                <p className="mt-3 text-slate-600">
                  Ingresa con tu correo para consultar tus vuelos y continuar tus reservas.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={correo}
                      onChange={(event) => setCorreo(event.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Contraseña
                    </label>
                    <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Olvidé mi contraseña
                    </a>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <label htmlFor="rememberMe" className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  Mantener mi sesión iniciada
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar sesión
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <TicketCheck className="mb-3 h-6 w-6 text-blue-600" />
                  <p className="text-sm font-semibold text-slate-900">Reservas activas</p>
                  <p className="mt-1 text-xs text-slate-500">Consulta cambios y detalles.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="mb-3 h-6 w-6 text-blue-600" />
                  <p className="text-sm font-semibold text-slate-900">Cuenta segura</p>
                  <p className="mt-1 text-xs text-slate-500">Protegemos tus datos.</p>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600">
                Usuario demo:{' '}
                <span className="font-bold text-slate-900">cliente@aeroturs.com</span>
                {' / '}
                <span className="font-bold text-slate-900">cliente123</span>
              </p>

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  ¿No tienes cuenta?
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Crea tu usuario para guardar reservas y consultar tus vuelos.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 h-11 rounded-xl border-blue-600 bg-white px-5 font-bold text-blue-600 hover:bg-blue-100"
                >
                  <Link to="/registro">
                    <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Crear cuenta
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
