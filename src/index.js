import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { createMatomoInstance, MatomoProvider } from 'context/Matomo'

import * as serviceWorker from './serviceWorker'
import App from 'containers/App'

const matomoInstance = createMatomoInstance({
    urlBase: 'https://matomo.ekata.io',
    siteId: process.env.REACT_APP_MATOMO_SITE_ID,
    linkTracking: false,
})

const render = Component => {
    return ReactDOM.render(
        <React.StrictMode>
            <BrowserRouter>
                <MatomoProvider value={matomoInstance}>
                    <Component />
                </MatomoProvider>
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

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
