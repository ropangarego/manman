import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { Providers } from './app/providers';
import { AppErrorBoundary } from './components/ui/AppErrorBoundary';
import './styles/globals.css';
import './styles/prototype.css';
import './styles/prototype-react-overrides.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </Providers>
  </StrictMode>,
);
