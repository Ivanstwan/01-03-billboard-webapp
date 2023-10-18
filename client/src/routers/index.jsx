import { lazy } from 'react';

import Home from '@/pages/Home';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';

const NotFound = lazy(() => import('@/pages/NotFound'));

export const privateRoutes = [
  {
    path: '/home',
    element: <Home />,
  },
];

export const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  // below is route that should be private, but not yet configure for the login etc
  {
    path: '/signup',
    element: <SignUp />,
  },
  // --------------------------------
  {
    path: '*',
    element: <NotFound />,
  },
];
