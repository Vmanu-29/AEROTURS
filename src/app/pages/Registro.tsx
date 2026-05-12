import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, LockKeyhole, Mail, Plane, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { register } from '../utils/auth';

export function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    confirmPassword: '',
    tipo_cuenta: 'persona',
    tipo_documento: '',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    ciudad: '',
    pais: '',
    telefono_principal: '',
    fecha_nacimiento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await register({
      correo: formData.correo,
      password: formData.password,
      tipo_cuenta: formData.tipo_cuenta as 'persona' | 'empresa',
      tipo_documento: formData.tipo_documento,
      numero_documento: formData.numero_documento,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      ciudad: formData.ciudad,
      pais: formData.pais,
      telefono_principal: formData.telefono_principal,
      fecha_nacimiento: formData.fecha_nacimiento
    });

    if (result.success) {
      setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
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
                Únete a AEROTURS
              </h1>
              <p className="max-w-lg text-lg text-white/85">
                Crea tu cuenta y accede a beneficios exclusivos para viajeros frecuentes.
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
                  Crear cuenta
                </p>
                <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                  Regístrate ahora
                </h2>
                <p className="mt-3 text-slate-600">
                  Completa tus datos para crear tu cuenta y empezar a volar con nosotros.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tipo_cuenta" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de cuenta *
                  </label>
                  <Select value={formData.tipo_cuenta} onValueChange={(value) => handleInputChange('tipo_cuenta', value)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <SelectValue placeholder="Selecciona el tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persona">Persona natural</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-xs text-slate-500">
                    La clase Business solo estará disponible para cuentas empresariales.
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.correo}
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirmar contraseña *
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white pl-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tipo_documento" className="block text-sm font-semibold text-slate-700 mb-2">
                      Tipo documento *
                    </label>
                    <Select value={formData.tipo_documento} onValueChange={(value) => handleInputChange('tipo_documento', value)}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cedula">Cédula</SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                        <SelectItem value="DNI">DNI</SelectItem>
                        {formData.tipo_cuenta === 'empresa' && (
                          <SelectItem value="NIT">NIT</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="numero_documento" className="block text-sm font-semibold text-slate-700 mb-2">
                      Número documento *
                    </label>
                    <Input
                      id="numero_documento"
                      type="text"
                      placeholder="1234567890"
                      value={formData.numero_documento}
                      onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombres" className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombres *
                    </label>
                    <Input
                      id="nombres"
                      type="text"
                      placeholder="Juan Carlos"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="apellidos" className="block text-sm font-semibold text-slate-700 mb-2">
                      Apellidos *
                    </label>
                    <Input
                      id="apellidos"
                      type="text"
                      placeholder="Pérez García"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-semibold text-slate-700 mb-2">
                      Ciudad *
                    </label>
                    <Input
                      id="ciudad"
                      type="text"
                      placeholder="Bogotá"
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="pais" className="block text-sm font-semibold text-slate-700 mb-2">
                      País *
                    </label>
                    <Input
                      id="pais"
                      type="text"
                      placeholder="Colombia"
                      value={formData.pais}
                      onChange={(e) => handleInputChange('pais', e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono_principal" className="block text-sm font-semibold text-slate-700 mb-2">
                    Teléfono *
                  </label>
                  <Input
                    id="telefono_principal"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={formData.telefono_principal}
                    onChange={(e) => handleInputChange('telefono_principal', e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="fecha_nacimiento" className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha de nacimiento *
                  </label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div role="alert" aria-live="polite" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <UserPlus className="ml-2 h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
