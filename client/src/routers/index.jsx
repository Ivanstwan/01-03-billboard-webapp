import { lazy } from 'react';

import Home from '@/pages/Home';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Listing from '@/pages/Listing';
import EditListing from '@/pages/EditListing';
import MyListing from '@/pages/MyListing';
import Register from '@/pages/Register';
import RegisterPhase2 from '@/pages/RegisterPhase2';
import AddListing from '@/pages/AddListing';
import EditListingImage from '@/pages/EditListingImage';
import UserProfile from '@/pages/UserProfile';

const NotFound = lazy(() => import('@/pages/NotFound'));

export const privateRoutes = [
  // Listing
  {
    path: '/listing/add',
    element: <AddListing />,
  },
  {
    path: '/listing/edit/:id',
    element: <EditListing />,
  },
  {
    path: '/listing/edit-image/:id',
    element: <EditListingImage />,
  },
  {
    path: '/my-listing',
    element: <MyListing />,
  },
  // User Profile
  {
    path: '/user/profile',
    element: <UserProfile />,
  },
  // Home
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
    path: '/listing',
    element: <Listing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // below is route that should be private, but not yet configure for the login etc
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/register/create',
    element: <RegisterPhase2 />,
  },
  // --------------------------------
  {
    path: '*',
    element: <NotFound />,
  },
];
