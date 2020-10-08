import React from 'react'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

import TextInput from 'components/TextInput'

import { getCurrentSession } from 'api/voting'

import VotingModal from './VotingModal'
import s from './Voting.module.scss'

class Voting extends React.Component {
    state = {
        currentSession: {},
        inputState: {
            coinSearch: '',
        },
        tokens: [],
        selectedToken: {},
    }

    componentDidMount() {
        getCurrentSession().then(response =>
            this.setState({
                currentSession: response.data,
                tokens: response.data.tokens,
            })
        )
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
        this.setState({
            selectedToken,
        })
    }

    render() {
        const { className } = this.props
        const { currentSession, inputState, tokens, selectedToken } = this.state
        const cx = classnames(s.container, className, {
            'no-voting-session': isEmpty(currentSession),
        })

        return (
            <div className={cx}>
                {!isEmpty(currentSession) ? (
                    <>
                        <div className="session-header">
                            <h5>
                                Vote using our baza token towards your favorite
                                coin and we will host the winner.{' '}
                            </h5>
                            <p>{currentSession.description}</p>
                        </div>
                        <div className="date-and-search">
                            <p className="voting-period">
                                {moment(currentSession.start_date).format(
                                    'M/YY'
                                )}{' '}
                                -{' '}
                                {moment(currentSession.end_date).format('M/YY')}
                            </p>
                            <TextInput
                                id="coinSearch"
                                label="Search for a coin..."
                                className="coin-search"
                                icon={<i className="material-icons">search</i>}
                                value={inputState.coinSearch}
                                onChange={this.onInputChange}
                            />
                            <p className="session-end">
                                Ends {moment(currentSession.end_date).fromNow()}
                            </p>
                        </div>
                        <div className="tokens">
                            {tokens.map((x, i) => (
                                <div
                                    className="token align-items-center d-flex"
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
                                            onClick={e => e.stopPropagation()}>
                                            {x.name}
                                        </a>
                                    </span>
                                    <span className="mr-2">{x.symbol}</span>
                                    <span className="mr-2">{x.algo}</span>
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
                        />
                    </>
                ) : (
                    <h5 className="text-center">
                        It seems no voting session is active now, check back
                        later
                    </h5>
                )}
            </div>
        )
    }
}

export default Voting
