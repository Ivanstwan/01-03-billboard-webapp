import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AppProvider } from '@/providers/app';
import PrivateRoute from '@/routers/privateRoute';
import { privateRoutes, publicRoutes } from '@/routers';
import { AuthProvider } from '@/context/AuthProvider';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AppProvider>
      <AuthProvider>
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
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
