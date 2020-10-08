import React from 'react'

import Header from 'components/Header'
import Footer from 'components/Footer'

import appRoutes from './appRoutes'

import './App.scss'

class App extends React.Component {
    render() {
        return (
            <div className="app-main">
                <Header />
                <div className="content">{appRoutes(this.props.location)}</div>
                <Footer />
            </div>
        )
    }
}

export default App
