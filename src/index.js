import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import * as serviceWorker from './serviceWorker'
import App from 'containers/App'

const render = Component => {
    return ReactDOM.render(
        <React.StrictMode>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </React.StrictMode>,
        document.getElementById('root')
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        const NextApp = require('./containers/App').default
        render(NextApp)
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
