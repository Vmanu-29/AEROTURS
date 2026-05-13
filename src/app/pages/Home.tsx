import { useNavigate } from 'react-router';
import { SearchForm } from '../components/SearchForm';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { LazyImage } from '../components/LazyImage';
import { ArrowRight, Check, Plane, Shield, Clock, Award, Globe, MapPin, Star, TrendingUp } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

export function Home() {
  const navigate = useNavigate();

  const popularDestinations = [
    {
      city: 'París',
      country: 'Francia',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc3MjIwOTc2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 4596000
    },
    {
      city: 'Nueva York',
      country: 'Estados Unidos',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzcyMjA5NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 2396000
    },
    {
      city: 'Tokio',
      country: 'Japón',
      image: 'https://images.unsplash.com/photo-1583915223588-7d88ebf23414?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXxlbnwxfHx8fDE3NzIxODc0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 6596000
    },
    {
      city: 'Londres',
      country: 'Reino Unido',
      image: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBiaWclMjBiZW58ZW58MXx8fHwxNzcyMTcxODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 4796000
    },
    {
      city: 'Dubái',
      country: 'Emiratos Árabes',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGNpdHl8ZW58MXx8fHwxNzczMTU1NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 5996000
    },
    {
      city: 'Barcelona',
      country: 'España',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBjaXR5fGVufDF8fHx8MTc3MzE1NTYzNHww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 4316000
    }
  ];

  const flightClasses = [
    {
      name: 'Económica',
      value: 'economy',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'La mejor tarifa para viajar cómodo, ligero y con lo esencial incluido.',
      features: ['Equipaje de mano', 'Snacks y bebidas', 'Entretenimiento a bordo'],
      priceNote: 'Precio base',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    },
    {
      name: 'Business',
      value: 'business',
      image: 'https://images.unsplash.com/photo-1581213900249-5d25f6f3ae76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Más espacio, prioridad y beneficios pensados para viajes de empresa.',
      features: ['10% de descuento empresarial', 'Asientos reclinables 180°', 'Comida gourmet', 'Acceso a salas VIP'],
      priceNote: '10% de descuento',
      popular: true,
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      name: 'Primera Clase',
      value: 'first',
      image: 'https://images.unsplash.com/photo-1540339832862-474599807836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Una experiencia exclusiva con privacidad, atención personalizada y lujo a bordo.',
      features: ['25% adicional al precio base', 'Suites privadas', 'Chef a bordo', 'Servicio personalizado'],
      priceNote: '+25% premium',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section compacto con formulario integrado */}
      <div className="relative h-[320px] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1567019619915-138426e5b1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYWlycGxhbmUlMjBmbHlpbmclMjBza3l8ZW58MXx8fHwxNzc1MzcxMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Avión de AEROTURS volando en el cielo azul"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              Descubre el mundo con AEROTURS
            </h1>
            <p className="text-base text-white/95">
              Reserva tus vuelos con las mejores tarifas
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de búsqueda superpuesto */}
      <div className="container mx-auto px-4 -mt-16 relative z-10 mb-12">
        <SearchForm />
      </div>

      {/* Sección de servicios rápidos */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button 
              type="button"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => navigate('/registro')}
              aria-label="Ir a registro de pasajero"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg mb-2">Registro</h3>
              <p className="text-gray-600 text-sm">Crea tu cuenta y accede a beneficios exclusivos</p>
            </button>
            <button 
              type="button"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => navigate('/estado-vuelo')}
              aria-label="Ir a estado del vuelo"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Plane className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg mb-2">Estado del vuelo</h3>
              <p className="text-gray-600 text-sm">Consulta el estado en tiempo real de tu vuelo</p>
            </button>
            <button 
              type="button"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => navigate('/my-bookings')}
              aria-label="Ir a gestionar reservas"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg mb-2">Gestiona tu reserva</h3>
              <p className="text-gray-600 text-sm">Modifica o cancela tu reserva fácilmente</p>
            </button>
            <button 
              type="button"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => navigate('/registro')}
              aria-label="Ir a AeroMiles"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg mb-2">AeroMiles</h3>
              <p className="text-gray-600 text-sm">Acumula millas y disfruta beneficios exclusivos</p>
            </button>
          </div>
        </div>
      </div>

      {/* Destinos populares */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">Destinos populares</h2>
          </div>
          <p className="text-gray-600 text-lg">Descubre los destinos más visitados por nuestros pasajeros</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest, index) => (
            <button
              key={index}
              className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => window.location.href = `/flights?destination=${dest.city}`}
              aria-label={`Ver vuelos a ${dest.city}, ${dest.country} desde ${formatPrice(dest.price)}`}
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={dest.image}
                  alt={`Destino turístico: ${dest.city}, ${dest.country}. Imagen de la ciudad con precio desde ${formatPrice(dest.price)}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-1">{dest.city}</h3>
                  <p className="text-sm text-white/90">{dest.country}</p>
                </div>
              </div>
              <div className="bg-white p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Desde</p>
                    <p className="text-3xl font-bold text-blue-600">{formatPrice(dest.price)}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sección de experiencia con imagen */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Una experiencia premium en cada vuelo</h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Disfruta de la comodidad y el servicio de clase mundial que nos caracteriza.
                Desde el momento en que reservas hasta que llegas a tu destino.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Seguridad garantizada</div>
                    <div className="text-white/80">Cumplimos con los más altos estándares de seguridad internacional</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Servicio premiado</div>
                    <div className="text-white/80">Reconocidos por la excelencia en el servicio al cliente</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Red global</div>
                    <div className="text-white/80">Más de 500 destinos en todo el mundo</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1584078764256-3000191c9377?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhaXJsaW5lJTIwaW50ZXJpb3IlMjByZWQlMjBzZWF0c3xlbnwxfHx8fDE3NzQyNDExNzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Interior lujoso de cabina de avión con asientos rojos y comodidad premium"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clases de servicio */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-600">Clases de vuelo</p>
              <h2 className="text-4xl font-bold text-gray-900">Elige cómo quieres viajar</h2>
            </div>
            <p className="max-w-xl text-gray-600 text-lg">
              Económica conserva el precio base, Business tiene descuento empresarial y Primera clase suma servicios premium.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {flightClasses.map((flightClass) => (
              <article
                key={flightClass.value}
                className={`relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  flightClass.popular ? 'border-blue-600 ring-2 ring-blue-600/15' : 'border-gray-200'
                }`}
              >
                {flightClass.popular && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white shadow-lg">
                    Popular
                  </div>
                )}

                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={flightClass.image}
                    alt={`Clase ${flightClass.name} de AEROTURS`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 rounded-full bg-white/95 px-4 py-1 text-sm font-bold text-blue-700">
                    {flightClass.priceNote}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 text-2xl font-bold text-gray-950">{flightClass.name}</h3>
                  <p className="mb-5 text-gray-600">{flightClass.description}</p>

                  <ul className="mb-6 space-y-3 text-sm text-gray-700">
                    {flightClass.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-md font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${flightClass.buttonClass}`}
                    onClick={() => navigate(`/flights?flightClass=${flightClass.value}`)}
                  >
                    Ver vuelos
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="relative bg-gray-900 py-24">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1650378204776-62dc0d3a51d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHN1bnNldCUyMHRha2VvZmZ8ZW58MXx8fHwxNzczMTU1NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Airplane sunset"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-bold text-white mb-6">¿Listo para tu próximo destino?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Reserva ahora y aprovecha nuestras ofertas especiales. Tu aventura comienza aquí.
          </p>
          <button className="bg-blue-600 text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-2xl">
            Explorar destinos
          </button>
        </div>
      </div>
    </div>
  );
}
