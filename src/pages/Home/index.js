import React from 'react'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'

import { getPoolStat } from 'api/poolStat'

import bazaLogo from 'assets/images/baza_logo.svg'
import s from './Home.module.scss'

class Home extends React.Component {
    state = {
        poolsStat: {},
    }

    componentDidMount() {
        getPoolStat('https://pool.baza.foundation/api/v2/stats').then(
            response =>
                this.setState({
                    poolsStat: { baza: response.data },
                })
        )
    }

    render() {
        const { className } = this.props
        const { poolsStat } = this.state
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <div className="pools">
                    <div className="pool">
                        <div className="pool-header">
                            <img
                                className="img-fluid mr-1"
                                src={bazaLogo}
                                alt="Baza Logo"
                            />
                            <h6>BAZA(BAZ)</h6>
                        </div>
                        <div className="pool-info">
                            {!isEmpty(poolsStat.baza) && (
                                <a
                                    href="https://pool.baza.foundation"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <div className="d-flex mb-2">
                                        <b>
                                            <i className="fas fa-tachometer-alt" />{' '}
                                            Pool hashrate:{' '}
                                        </b>
                                        <span className="flex-1" />
                                        <span>
                                            {poolsStat.baza.pool.hashrate} H/s
                                        </span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <b>
                                            <i className="fas fa-users" />{' '}
                                            Miners:{' '}
                                        </b>
                                        <span className="flex-1" />
                                        <span>
                                            {poolsStat.baza.pool.miners}
                                        </span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <b>
                                            <i className="fas fa-money-bill-alt" />{' '}
                                            Fee:{' '}
                                        </b>
                                        <span className="flex-1" />
                                        <span>
                                            {poolsStat.baza.config.fee} %
                                        </span>
                                    </div>
                                    <div className="d-flex mb-2">
                                        <b>
                                            <i className="fas fa-certificate" />{' '}
                                            Block Reward:{' '}
                                        </b>
                                        <span className="flex-1" />
                                        <span>
                                            {poolsStat.baza.network.reward /
                                                1000000}
                                        </span>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
