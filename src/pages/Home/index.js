import React from 'react'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'

import { MatomoContext } from 'context/Matomo'

import { getPoolStat, getPools } from 'api/poolStat'

import {
    getReadableHashRateString,
    getPoolPercentage,
    getReadableCoins,
} from 'utils/misc'

import s from './Home.module.scss'

class Home extends React.Component {
    static contextType = MatomoContext

    state = {
        pools: [],
        poolsStat: {},
    }

    componentDidMount() {
        setTimeout(() => this.context.trackPageView(), 2000)
        getPools().then(response =>
            this.setState({ pools: response.data }, () => {
                this.setPoolsStat()
                this.setPoolStatInterval = setInterval(
                    () => this.setPoolsStat(),
                    10000
                )
            })
        )
    }

    componentWillUnmount() {
        if (this.setPoolStatInterval) {
            clearInterval(this.setPoolStatInterval)
        }
    }

    setPoolsStat = () => {
        const { pools } = this.state
        for (const pool of pools) {
            getPoolStat(pool.pool_stats_api_url).then(response =>
                this.setState(prevState => ({
                    poolsStat: {
                        ...prevState.poolsStat,
                        [pool.symbol]: response.data,
                    },
                }))
            )
        }
    }

    renderOnePoolStat = (pool, i) => {
        const poolStat = this.state.poolsStat[pool.symbol]
        return (
            <div className="pool" key={i}>
                <div className="pool-header">
                    {pool.logo_url && (
                        <img
                            className="img-fluid mr-1"
                            src={pool.logo_url}
                            alt="Token Logo"
                        />
                    )}
                    <h6>{pool.symbol}</h6>
                    <div className="flex-1" />
                    {pool.last_price && <span>{pool.last_price} USDT</span>}
                </div>
                <div className="pool-info">
                    {!isEmpty(poolStat) && (
                        <a
                            href={pool.pool_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-tachometer-alt" />{' '}
                                    Network hashrate:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>
                                    {getReadableHashRateString(
                                        poolStat.network.difficulty /
                                            poolStat.config.coinDifficultyTarget
                                    )}
                                    /s
                                </span>
                            </div>
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-tachometer-alt" /> Pool
                                    hashrate:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>
                                    {getReadableHashRateString(
                                        poolStat.pool.hashrate
                                    )}
                                    /s
                                </span>
                            </div>
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-chart-pie" /> Pool
                                    percentage:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>{getPoolPercentage(poolStat)} %</span>
                            </div>
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-users" /> Miners:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>{poolStat.pool.miners}</span>
                            </div>
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-money-bill-alt" /> Fee:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>{poolStat.config.fee} %</span>
                            </div>
                            <div className="d-flex mb-2">
                                <b>
                                    <i className="fas fa-certificate" /> Block
                                    Reward:{' '}
                                </b>
                                <span className="flex-1" />
                                <span>
                                    {pool.symbol !== 'XMR'
                                        ? getReadableCoins(
                                              poolStat.network.reward,
                                              poolStat.config.coinUnits
                                          )
                                        : getReadableCoins(
                                              poolStat.lastblock.reward,
                                              poolStat.config.coinUnits
                                          )}
                                </span>
                            </div>
                        </a>
                    )}
                </div>
            </div>
        )
    }

    render() {
        const { className } = this.props
        const { pools } = this.state
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <div className="pools">{pools.map(this.renderOnePoolStat)}</div>
            </div>
        )
    }
}

export default Home
