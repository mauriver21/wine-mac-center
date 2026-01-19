import { Launcher } from '@app-launcher/components/Launcher';
import { MainLayout } from '@app-launcher/layouts/MainLayout';
import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <Launcher /> }]
  }
];
