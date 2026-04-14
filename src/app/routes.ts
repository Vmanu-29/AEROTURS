import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { FlightResults } from './pages/FlightResults';
import { PassengerInfo } from './pages/PassengerInfo';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { MyBookings } from './pages/MyBookings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'flights', Component: FlightResults },
      { path: 'passenger-info', Component: PassengerInfo },
      { path: 'payment', Component: Payment },
      { path: 'confirmation/:bookingRef', Component: Confirmation },
      { path: 'my-bookings', Component: MyBookings },
    ],
  },
]);
