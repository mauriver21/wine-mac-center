import { Launcher } from '@app-launcher/components/Launcher';
import { LauncherMenu } from '@app-launcher/components/LauncherMenu';
import { MainLayout } from '@app-launcher/layouts/MainLayout';
import { AppConfig } from '@components/AppConfig';
import { EnvPaths } from '@components/EnvPaths';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Launcher />,
        children: [
          { index: true, element: <LauncherMenu /> },
          { path: 'app-config', element: <AppConfig /> },
          {
            path: 'env-paths',
            element: (
              <ConfigLayout
                mainTitle="Environment"
                contentSlot={<EnvPaths />}
                showTableOfContents={false}
              />
            )
          }
        ]
      }
    ]
  }
];
