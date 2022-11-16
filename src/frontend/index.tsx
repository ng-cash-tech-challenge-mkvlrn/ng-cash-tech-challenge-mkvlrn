import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import { App } from '#/frontend/app/app';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <RecoilRoot>
      <MantineProvider
        theme={{ colorScheme: 'dark' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <App />
      </MantineProvider>
    </RecoilRoot>
  </StrictMode>,
);
