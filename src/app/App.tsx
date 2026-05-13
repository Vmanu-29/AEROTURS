import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Cargando aplicación...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
