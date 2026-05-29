import { Home } from '@components/Home';
import { MainLayout } from '@layouts/MainLayout';
import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ path: '', element: <Home /> }],
  },
];
