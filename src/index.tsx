import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import 'core-js/stable';

import configureStore from '@app/store/store';
import App from './app';

if (process.env.NODE_ENV === 'development') {
  import('react-grab').then((m) => m.init({ activationMode: 'toggle', allowActivationInsideInput: false, maxContextLines: 3 }));
}

const { store } = configureStore();

window.global = window;

export default store;

ReactDOM.render(
  <MemoryRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </MemoryRouter>,
  document.getElementById('root'),
);
