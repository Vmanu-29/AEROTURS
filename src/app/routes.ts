import { createBrowserRouter } from 'react-router';
import { createElement } from 'react';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { FlightResults } from './pages/FlightResults';
import { PassengerInfo } from './pages/PassengerInfo';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { MyBookings } from './pages/MyBookings';
import { AdminDashboard } from './pages/AdminDashboard';

import { Registro } from './pages/Registro';
import EstadoVuelo from './pages/EstadoVuelo';
import { Login } from './pages/Login';

function protectedElement(Component: () => JSX.Element) {
  return createElement(ProtectedRoute, null, createElement(Component));
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'flights', Component: FlightResults },
      {
        path: 'passenger-info',
        element: protectedElement(PassengerInfo),
      },
      {
        path: 'payment',
        element: protectedElement(Payment),
      },
      {
        path: 'confirmation/:bookingRef',
        element: protectedElement(Confirmation),
      },
      {
        path: 'my-bookings',
        element: protectedElement(MyBookings),
      },
      {
        path: 'admin',
        element: protectedElement(AdminDashboard),
      },
      { path: 'login', Component: Login },
      { path: 'registro', Component: Registro },
      {
        path: 'estado-vuelo',
        element: protectedElement(EstadoVuelo),
      },
    ],
  },
]);
