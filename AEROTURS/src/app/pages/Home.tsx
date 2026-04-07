import { SearchForm } from '../components/SearchForm';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Plane, Shield, Clock, Award, Globe, HeadphonesIcon, MapPin, Star, TrendingUp } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

export function Home() {
  const popularDestinations = [
    {
      city: 'París',
      country: 'Francia',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc3MjIwOTc2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 596000
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
      price: 3596000
    },
    {
      city: 'Londres',
      country: 'Reino Unido',
      image: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBiaWclMjBiZW58ZW58MXx8fHwxNzcyMTcxODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 796000
    },
    {
      city: 'Dubái',
      country: 'Emiratos Árabes',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGNpdHl8ZW58MXx8fHwxNzczMTU1NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 1996000
    },
    {
      city: 'Barcelona',
      country: 'España',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBjaXR5fGVufDF8fHx8MTc3MzE1NTYzNHww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 316000
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section compacto con formulario integrado */}
      <div className="relative h-[320px] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1567019619915-138426e5b1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYWlycGxhbmUlMjBmbHlpbmclMjBza3l8ZW58MXx8fHwxNzc1MzcxMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Airplane flying"
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
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Check-in</h3>
              <p className="text-gray-600 text-sm">Realiza tu check-in online y ahorra tiempo en el aeropuerto</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Plane className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Estado del vuelo</h3>
              <p className="text-gray-600 text-sm">Consulta el estado en tiempo real de tu vuelo</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Gestiona tu reserva</h3>
              <p className="text-gray-600 text-sm">Modifica o cancela tu reserva fácilmente</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AeroMiles</h3>
              <p className="text-gray-600 text-sm">Acumula millas y disfruta beneficios exclusivos</p>
            </div>
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
            <div
              key={index}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.city}
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
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg">
                    Ver vuelos
                  </button>
                </div>
              </div>
            </div>
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
                alt="Luxury airline interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clases de servicio */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Elige tu clase</h2>
          <p className="text-gray-600 text-lg">Viaja con el confort que mereces</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow">
            <div className="relative h-56">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1539576776193-2c07122e5fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiYWNrcGFja3xlbnwxfHx8fDE3NzMxNTU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Economy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3">Económica</h3>
              <p className="text-gray-600 mb-4">Tarifas accesibles con todo lo que necesitas para un viaje cómodo</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Equipaje de mano incluido
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Snacks y bebidas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Entretenimiento a bordo
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium">
                Ver más
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-blue-600 hover:shadow-2xl transition-shadow relative">
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
              Popular
            </div>
            <div className="relative h-56">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1567916190725-372c28edc554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxvdCUyMGNvY2twaXQlMjBjb250cm9sc3xlbnwxfHx8fDE3NzQyNDExNzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Business"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3">Business</h3>
              <p className="text-gray-600 mb-4">Máximo confort y servicio premium para profesionales</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Asientos reclinables 180°
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Comida gourmet
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Acceso a salas VIP
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Prioridad en embarque
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors font-medium">
                Ver más
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow">
            <div className="relative h-56">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1772354982639-5fdffe032394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWwlMjBidXNpbmVzcyUyMGNsYXNzfGVufDF8fHx8MTc3MzE1NTYyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="First Class"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3">Primera Clase</h3>
              <p className="text-gray-600 mb-4">Lujo excepcional y experiencia incomparable</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Suites privadas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Chef a bordo
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Servicio personalizado
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Amenities de lujo
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium">
                Ver más
              </button>
            </div>
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