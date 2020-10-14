import React from 'react'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

import TextInput from 'components/TextInput'

import { MatomoContext } from 'context/Matomo'

import { getCurrentSession } from 'api/voting'

import { getReadableCoins } from 'utils/misc'

import VotingModal from './VotingModal'
import s from './Voting.module.scss'

class Voting extends React.Component {
    static contextType = MatomoContext

    state = {
        currentSession: {},
        inputState: {
            coinSearch: '',
        },
        tokens: [],
        selectedToken: {},
        fetchingSession: true,
    }

    componentDidMount() {
        setTimeout(() => this.context.trackPageView(), 2000)
        getCurrentSession()
            .then(response =>
                this.setState({
                    currentSession: response.data,
                    tokens: response.data.tokens,
                    fetchingSession: false,
                })
            )
            .catch(() => {
                this.setState({
                    fetchingSession: false,
                })
            })
    }

    onInputChange = (id, value) => {
        if (id === 'coinSearch') {
            const tokens = this.state.currentSession.tokens.filter(x =>
                x.name.toLowerCase().startsWith(value.toLowerCase())
            )
            this.setState(prevState => ({
                inputState: {
                    ...prevState.inputState,
                    [id]: value,
                },
                tokens,
            }))
        } else {
            this.setState(prevState => ({
                inputState: {
                    ...prevState.inputState,
                    [id]: value,
                },
            }))
        }
    }

    selectToken = selectedToken => {
        if (!isEmpty(selectedToken)) {
            this.context.trackEvent({
                category: 'Dialog',
                action: 'Click',
                name: `Vote - ${selectedToken.name}`,
            })
        }
        this.setState({
            selectedToken,
        })
    }

    render() {
        const { className } = this.props
        const {
            currentSession,
            inputState,
            tokens,
            selectedToken,
            fetchingSession,
        } = this.state
        const cx = classnames(s.container, className, {
            'no-voting-session': isEmpty(currentSession),
        })

        return (
            <div className={cx}>
                {!fetchingSession ? (
                    !isEmpty(currentSession) ? (
                        <>
                            <div className="session-header">
                                <h5>Vote for your favorite coin. </h5>
                                <p>{currentSession.description}</p>
                            </div>
                            <div className="date-and-search">
                                <p className="voting-period mb-1 mb-lg-0">
                                    From:{' '}
                                    {moment(currentSession.start_date).format(
                                        'M/YY'
                                    )}{' '}
                                    To:{' '}
                                    {moment(currentSession.end_date).format(
                                        'M/YY'
                                    )}
                                </p>
                                <TextInput
                                    id="coinSearch"
                                    label="Search for a coin..."
                                    className="coin-search"
                                    icon={
                                        <i className="material-icons">search</i>
                                    }
                                    value={inputState.coinSearch}
                                    onChange={this.onInputChange}
                                />
                                <p className="session-end mb-1 mb-lg-0">
                                    Ends{' '}
                                    {moment(currentSession.end_date).fromNow()}
                                </p>
                            </div>
                            <div className="tokens">
                                <div className="token">
                                    <span className="mr-2">Logo</span>
                                    <span className="mr-2">Name</span>
                                    <span className="mr-2">Symbol</span>
                                    <span className="mr-2">Algo</span>
                                    <span className="mr-2">Total Votes</span>
                                    <span className="flex-1" />
                                    <span>Added Date</span>
                                </div>
                                {tokens.map((x, i) => (
                                    <div
                                        className="token"
                                        key={i}
                                        onClick={() => this.selectToken(x)}>
                                        <img
                                            src={
                                                process.env
                                                    .REACT_APP_DOCUMENT_ROOT +
                                                x.logo
                                            }
                                            className="img-fluid mr-2"
                                            style={{
                                                width: '40px',
                                            }}
                                            alt="token logo"
                                        />
                                        <span className="mr-2">
                                            <a
                                                href={x.homepage_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e =>
                                                    e.stopPropagation()
                                                }>
                                                {x.name}
                                            </a>
                                        </span>
                                        <span className="mr-2">{x.symbol}</span>
                                        <span className="mr-2">{x.algo}</span>
                                        <span
                                            className="mr-2"
                                            title="Total Votes">
                                            {x.amount_raised
                                                ? getReadableCoins(
                                                      x.amount_raised,
                                                      1000000
                                                  )
                                                : 'N/A'}
                                        </span>
                                        <span className="flex-1" />
                                        {x.won_date && (
                                            <span>
                                                {moment(x.won_date).format(
                                                    'DD/MM/YYYY'
                                                )}
                                            </span>
                                        )}
                                        {x.added_date && (
                                            <span>
                                                {moment(x.added_date).format(
                                                    'DD/MM/YYYY'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <VotingModal
                                votingModalIsOpen={!isEmpty(selectedToken)}
                                closeVotingModal={() => this.selectToken({})}
                                selectedToken={selectedToken}
                                isSessionPaused={currentSession.is_paused}
                            />
                        </>
                    ) : (
                        <h5 className="text-center">
                            It seems no voting session is active now, check back
                            later
                        </h5>
                    )
                ) : (
                    <i className="fas fa-spinner fa-spin fa-3x" />
                )}
            </div>
        )
    }
}

export default Voting
