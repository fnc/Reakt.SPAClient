import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Boards from './components/Boards';
import Board from './components/Board';

import './css/custom.css';

export default () => (
    <Layout>
        <Route exact path='/' component={Boards} />
        <Route path='/board' component={Board} />        
    </Layout>
);
