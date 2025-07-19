import { AppConfig } from '@components/AppConfig';
import { CreateApp } from '@components/CreateApp';
import { MainLayout } from '@layouts/MainLayout';
import { SimpleLayout } from '@layouts/SimpleLayout';
import { Apps } from '@pages/Apps';
import { Home } from '@pages/Home';
import { Settings } from '@pages/Settings';
import { Tasks } from '@pages/Tasks';
import { Test } from '@pages/Test';
import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'apps', element: <Apps /> },
      { path: 'settings', element: <Settings /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'test', element: <Test /> }
    ]
  },
  {
    path: '/app-config',
    element: <SimpleLayout />,
    children: [{ path: ':realAppName', element: <AppConfig /> }]
  },
  {
    path: '/create-app',
    element: <SimpleLayout />,
    children: [{ index: true, element: <CreateApp /> }]
  }
];
