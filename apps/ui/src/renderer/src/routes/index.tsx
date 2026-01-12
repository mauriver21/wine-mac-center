import { AppConfig } from '@components/AppConfig';
import { AppPipeline } from '@components/AppPipeline';
import { CreateApp } from '@components/CreateApp';
import { NotFoundApp } from '@components/NotFoundApp';
import { MainLayout } from '@layouts/MainLayout';
import { SimpleLayout } from '@layouts/SimpleLayout';
import { InstalledApps } from '@pages/InstalledApps';
import { Settings } from '@pages/Settings';
import { Scripts } from '@pages/Scripts';
import { Test } from '@pages/Test';
import { RouteObject } from 'react-router-dom';
import { PipelineScript } from '@components/PipelineScript';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <InstalledApps /> },
      { path: 'apps', element: <InstalledApps /> },
      { path: 'settings', element: <Settings /> },
      { path: 'scripts', element: <Scripts /> },
      { path: 'configs', element: <Test /> }
    ]
  },
  {
    path: '/app-config',
    element: <SimpleLayout />,
    children: [{ path: ':appName', element: <AppConfig /> }]
  },
  {
    path: '/app-pipeline',
    element: <SimpleLayout />,
    children: [
      { index: true, element: <AppPipeline /> },
      { path: ':appName', element: <AppPipeline /> }
    ]
  },
  {
    path: '/create-app',
    element: <SimpleLayout />,
    children: [{ index: true, element: <CreateApp /> }]
  },
  {
    path: '/app-not-found',
    element: <SimpleLayout />,
    children: [{ path: ':appName', element: <NotFoundApp /> }]
  },
  {
    path: '/script',
    element: <SimpleLayout />,
    children: [
      { index: true, element: <PipelineScript /> },
      { path: ':appName', element: <PipelineScript /> }
    ]
  }
];
