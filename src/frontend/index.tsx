import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '#/frontend/app/app';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <MantineProvider
      theme={{ colorScheme: 'dark' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <App>
        <div>page</div>
      </App>
    </MantineProvider>
  </StrictMode>,
);