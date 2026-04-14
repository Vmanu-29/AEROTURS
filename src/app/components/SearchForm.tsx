import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Plane, Users } from 'lucide-react';
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
      <RadioGroup
        value={tripType}
        onValueChange={(value) => setTripType(value as any)}
      >
        <div className="flex gap-4 mb-3">
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

      {/* GRID */}
      <div className="grid grid-cols-12 gap-2 items-end">

        {/* Origen */}
        <div className={tripType === 'round-trip' ? "col-span-3" : "col-span-4"}>
          <Label className="text-xs mb-1 block">Origen</Label>
          <div className="relative">
            <Plane className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-45" />
            <Select
              value={searchData.from}
              onValueChange={(value) => setSearchData({ ...searchData, from: value })}
            >
              <SelectTrigger className="pl-8 h-9 rounded-md border border-gray-200">
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
        <div className={tripType === 'round-trip' ? "col-span-3" : "col-span-4"}>
          <Label className="text-xs mb-1 block">Destino</Label>
          <div className="relative">
            <Plane className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select
              value={searchData.to}
              onValueChange={(value) => setSearchData({ ...searchData, to: value })}
            >
              <SelectTrigger className="pl-8 h-9 rounded-md border border-gray-200">
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
        <div className="col-span-2">
          <Label className="text-xs mb-1 block">Ida</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              className="pl-8 h-9 rounded-md border border-gray-200 cursor-pointer"
              style={{ colorScheme: 'light' }}
              value={searchData.departureDate}
              onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Vuelta */}
        {tripType === 'round-trip' && (
          <div className="col-span-2">
            <Label className="text-xs mb-1 block">Vuelta</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                className="pl-8 h-9 rounded-md border border-gray-200 cursor-pointer"
                style={{ colorScheme: 'light' }}
                value={searchData.returnDate}
                onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Pasajeros (mitad) */}
        <div className="col-span-1">
          <Label className="text-xs mb-1 block">Pas.</Label>
          <div className="relative">
            <Users className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select
              value={searchData.passengers}
              onValueChange={(value) =>
                setSearchData({ ...searchData, passengers: value })
              }
              >
              <SelectTrigger className="pl-7 pr-1 h-9 rounded-md border border-gray-200 text-center">
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

        {/* Botón */}
        <div className="col-span-1">
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