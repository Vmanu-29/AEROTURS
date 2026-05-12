import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Calendar, Plane, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { destinations } from '../data/mockFlights';

export function SearchForm() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');

  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    flightClass: 'economy'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      departureDate: searchData.departureDate,
      returnDate: tripType === 'round-trip' ? searchData.returnDate : '',
      passengers: searchData.passengers,
      flightClass: searchData.flightClass,
      tripType
    });
    navigate(`/flights?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-md p-3 border border-gray-200"
    >

      {/* Tipo de viaje */}
      <fieldset className="border-b pb-4 mb-4">
        <legend className="text-sm font-bold block mb-3">Tipo de viaje</legend>
        <RadioGroup
          value={tripType}
          onValueChange={(value) => setTripType(value as any)}
        >
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" />
              <Label htmlFor="round-trip" className="text-sm">Ida y vuelta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" />
              <Label htmlFor="one-way" className="text-sm">Solo ida</Label>
            </div>
          </div>
        </RadioGroup>
      </fieldset>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-2 items-end">

        {/* Origen */}
        <div className={tripType === 'round-trip' ? "lg:col-span-2" : "lg:col-span-3"}>
          <Label className="text-sm mb-1 block font-semibold">Origen</Label>
          <div className="relative">
            <Plane className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-45" aria-hidden="true" />
            <Select
              value={searchData.from}
              onValueChange={(value) => setSearchData({ ...searchData, from: value })}
            >
              <SelectTrigger className="w-full pl-8 h-9 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <SelectValue placeholder="Ciudad origen" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map(dest => (
                  <SelectItem key={dest.code} value={dest.code}>
                    {dest.city} ({dest.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Destino */}
        <div className={tripType === 'round-trip' ? "lg:col-span-2" : "lg:col-span-3"}>
          <Label className="text-sm mb-1 block font-semibold">Destino</Label>
          <div className="relative">
            <Plane className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Select
              value={searchData.to}
              onValueChange={(value) => setSearchData({ ...searchData, to: value })}
            >
              <SelectTrigger className="w-full pl-8 h-9 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <SelectValue placeholder="Ciudad destino" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map(dest => (
                  <SelectItem key={dest.code} value={dest.code}>
                    {dest.city} ({dest.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ida */}
        <div className="lg:col-span-2">
          <Label className="text-sm mb-1 block font-semibold">Fecha de ida</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input
              type="date"
              className="w-full pl-8 h-9 rounded-md border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              style={{ colorScheme: 'light' }}
              value={searchData.departureDate}
              onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
              required
              aria-required="true"
            />
          </div>
        </div>

        {/* Vuelta */}
        {tripType === 'round-trip' && (
          <div className="lg:col-span-2">
            <Label className="text-sm mb-1 block font-semibold">Fecha de vuelta</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                type="date"
                className="w-full pl-8 h-9 rounded-md border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                style={{ colorScheme: 'light' }}
                value={searchData.returnDate}
                onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                required
                aria-required="true"
              />
            </div>
          </div>
        )}

        {/* Pasajeros */}
        <div className="lg:col-span-1">
          <Label className="text-sm mb-1 block font-semibold">Pasajeros</Label>
          <div className="relative">
            <Users className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Select
              value={searchData.passengers}
              onValueChange={(value) =>
                setSearchData({ ...searchData, passengers: value })
              }
              >
              <SelectTrigger className="w-full pl-7 pr-1 h-9 rounded-md border border-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <SelectValue>
                  {searchData.passengers}
                </SelectValue>
              </SelectTrigger>
              
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clase */}
        <div className="lg:col-span-2">
          <Label className="text-sm mb-1 block font-semibold">Clase</Label>
          <div className="relative">
            <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Select
              value={searchData.flightClass}
              onValueChange={(value) =>
                setSearchData({ ...searchData, flightClass: value })
              }
            >
              <SelectTrigger className="w-full pl-8 h-9 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <SelectValue placeholder="Clase" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="economy">Económica</SelectItem>
                <SelectItem value="business">Business (empresas)</SelectItem>
                <SelectItem value="first">Primera clase</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botón */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md"
          >
            Buscar
          </Button>
        </div>

      </div>
    </form>
  );
}
