import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HomePage from 'pages/Home'
import AboutPage from 'pages/About'
import VotingPage from 'pages/Voting'

const appRoutes = location => (
    <Switch location={location}>
        <Route path="/" exact component={HomePage} />
        <Route path="/about" exact component={AboutPage} />
        <Route path="/vote" exact component={VotingPage} />
    </Switch>
)

export default appRoutes
