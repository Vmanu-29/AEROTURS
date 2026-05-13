import { createBrowserRouter } from 'react-router';
import { createElement, lazy } from 'react';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const FlightResults = lazy(() => import('./pages/FlightResults').then((module) => ({ default: module.FlightResults })));
const PassengerInfo = lazy(() => import('./pages/PassengerInfo').then((module) => ({ default: module.PassengerInfo })));
const Payment = lazy(() => import('./pages/Payment').then((module) => ({ default: module.Payment })));
const Confirmation = lazy(() => import('./pages/Confirmation').then((module) => ({ default: module.Confirmation })));
const MyBookings = lazy(() => import('./pages/MyBookings').then((module) => ({ default: module.MyBookings })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const Registro = lazy(() => import('./pages/Registro').then((module) => ({ default: module.Registro })));
const EstadoVuelo = lazy(() => import('./pages/EstadoVuelo'));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));

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
