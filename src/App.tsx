import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Boards from './components/Boards';
import Board from './components/Board';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Boards} />
        <Route path='/board' component={Board} />
        {/* <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
        <Route path='/boards' component={Boards} /> */}
    </Layout>
);
