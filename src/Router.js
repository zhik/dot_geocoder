import React from 'react';
import { HashRouter as BrowserRouter, Route, Switch } from 'react-router-dom' ;

import App from './components/App';
import MapPreview from './components/MapPreview';
import About from './components/About';
import BlockApp from './components/BlockApp';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/Map" component={MapPreview} />
            <Route exact path="/Block" component={BlockApp} />
            <Route exact path="/About" component={About} />
        </Switch>
    </BrowserRouter>
)
 
export default Router;