import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import { AppProvider } from '@/providers/app';
import PrivateRoute from '@/routers/privateRoute';
import { privateRoutes, publicRoutes } from '@/routers';
import { AuthProvider } from '@/context/AuthProvider';
import { ErrorProvider } from '@/context/ErrorProvider';
import ErrorNotification from '@/components/custom/error/errorNotification';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AppProvider>
      <ErrorProvider>
        <AuthProvider>
          <ErrorNotification />
          <Routes>
            {/* private routes */}
            <Route element={<PrivateRoute />}>
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* public routes */}
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </AuthProvider>
      </ErrorProvider>
    </AppProvider>
  );
}

export default App;
