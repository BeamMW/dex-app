import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import 'babel-polyfill';

import App from './app';
import { StoreAccessorProvider } from '@app/contexts/Store/StoreAccessorContext';

window.global = window;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <StoreAccessorProvider>
      <App />
    </StoreAccessorProvider>
  </Router>
);
