import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from './Application';
import { ExampleApi, CartApi } from './api';
import { initStore } from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const basename = '/hw/store';

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

const application = (
    <BrowserRouter basename={basename}>
        <Provider store={store}>
            <Application />
        </Provider>
    </BrowserRouter>
);

render(application, document.getElementById('root'));
