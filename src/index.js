import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Router from './Router';
import registerServiceWorker from './registerServiceWorker';

if(typeof ['test'].includes !== 'undefined'){
    ReactDOM.render(<Router />, document.getElementById('root'));
    registerServiceWorker();
}else{
    document.getElementById('root').innerHTML = '<div class="ui warning message">App doesn\'t support your browser, use modern browsers like Chrome or Firefox.</div>'
}

