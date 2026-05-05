import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Ticket,
  Plane,
  Calendar,
  Users,
  Download,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const savedBookings = JSON.parse(
      sessionStorage.getItem("myBookings") || "[]",
    );
    setBookings(savedBookings);
  }, []);

  const handleCancelBooking = (reference: string) => {
    if (
      confirm(
        "¿Estás seguro de que deseas cancelar esta reserva?",
      )
    ) {
      const updated = bookings.map((b) =>
        b.reference === reference
          ? { ...b, status: "cancelled" }
          : b,
      );
      setBookings(updated);
      sessionStorage.setItem(
        "myBookings",
        JSON.stringify(updated),
      );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            Mis reservas
          </h1>
          <Card className="p-12 text-center rounded-xl">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              No tienes reservas
            </h2>
            <p className="text-gray-600 mb-6">
              Comienza a planificar tu próximo viaje
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-full"
            >
              Buscar vuelos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Mis reservas
          </h1>
          <p className="text-gray-600">
            Gestiona tus reservas y descarga tus billetes
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => {
            const {
              reference,
              flight,
              passengers,
              totalPrice,
              bookingDate,
              status,
            } = booking;
            const isCancelled = status === "cancelled";

            return (
              <Card
                key={reference}
                className={`p-6 rounded-xl ${isCancelled ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Número de reserva
                      </p>
                      <p className="text-xl font-bold">
                        {reference}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      isCancelled ? "destructive" : "default"
                    }
                    className={
                      isCancelled
                        ? ""
                        : "bg-blue-600 rounded-full"
                    }
                  >
                    {isCancelled ? "Cancelada" : "Confirmada"}
                  </Badge>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Flight Info */}
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                        Detalles del vuelo
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Vuelo:
                          </span>
                          <span className="font-medium">
                            {flight.airline}{" "}
                            {flight.flightNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Ruta:
                          </span>
                          <span className="font-medium">
                            {flight.origin} →{" "}
                            {flight.destination}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Salida:
                          </span>
                          <span className="font-medium">
                            {flight.departureTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Llegada:
                          </span>
                          <span className="font-medium">
                            {flight.arrivalTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Passenger Info */}
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Pasajeros ({passengers.length})
                      </h3>
                      <div className="space-y-2 text-sm">
                        {passengers.map(
                          (passenger: any, index: number) => (
                            <div key={index}>
                              <p className="font-medium">
                                {passenger.firstName}{" "}
                                {passenger.lastName}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {passenger.email}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Fecha de reserva
                    </p>
                    <p className="font-medium">
                      {new Date(bookingDate).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Total pagado
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      €
                      {(
                        totalPrice +
                        totalPrice * 0.21 +
                        15
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {!isCancelled && (
                  <div className="border-t pt-4 mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full hover:bg-blue-50 border-blue-600 text-blue-700"
                      onClick={() =>
                        navigate(`/confirmation/${reference}`)
                      }
                    >
                      Ver detalles
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full hover:bg-blue-50 border-blue-600 text-blue-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar billete
                    </Button>
                    <Button
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                      onClick={() =>
                        handleCancelBooking(reference)
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full"
          >
            Buscar más vuelos
          </Button>
        </div>
      </div>
    </div>
  );
}