import React from 'react'
import Modal from 'react-bootstrap/Modal'
import classnames from 'classnames'
import get from 'lodash/get'

import { voteForToken, getVotingPaymentAddress } from 'api/voting'

import TextInput from 'components/TextInput'

import s from './Voting.module.scss'

const INITIAL_STATE = {
    inputState: {
        txHash: '',
    },
    votingSuccess: false,
    votingAddress: '',
    errorState: {
        txHash: null,
        nonField: null,
    },
}

class VotingModal extends React.Component {
    state = {
        ...INITIAL_STATE,
    }

    componentDidMount() {
        getVotingPaymentAddress().then(response => {
            this.setState({
                votingAddress: response.data.wallet_address,
            })
        })
    }

    onInputChange = (id, value) => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                [id]: value,
            },
        }))
    }

    onClickSubmit = () => {
        voteForToken({
            token_id: this.props.selectedToken.id,
            tx_hash: this.state.inputState.txHash,
        })
            .then(() => {
                this.setState({
                    votingSuccess: true,
                })
            })
            .catch(responseData => {
                this.setState({
                    errorState: {
                        txHash: get(responseData, 'tx_hash', null),
                        nonField: get(responseData, 'non_field_errors', null),
                    },
                })
            })
    }

    cleanUpVotingModalAndClose = () => {
        const votingAddress = this.state.votingAddress
        this.setState(
            {
                ...INITIAL_STATE,
                votingAddress,
            },
            () => this.props.closeVotingModal()
        )
    }

    render() {
        const {
            className,
            votingModalIsOpen,
            selectedToken,
            isSessionPaused,
        } = this.props
        const {
            inputState,
            votingSuccess,
            errorState,
            votingAddress,
        } = this.state
        const cx = classnames(s.votingModal, className)

        return (
            <Modal
                show={votingModalIsOpen}
                onHide={this.cleanUpVotingModalAndClose}
                dialogClassName={cx}>
                <Modal.Header>
                    <Modal.Title>Vote for {selectedToken.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isSessionPaused ? (
                        !votingSuccess ? (
                            !selectedToken.is_archived ? (
                                <>
                                    <p>
                                        Send BAZA to the address mentioned
                                        below, then add the transaction hash
                                        below and submit
                                    </p>
                                    <p className="payment-address">
                                        {votingAddress}
                                    </p>
                                    <TextInput
                                        id="txHash"
                                        label="Transaction Hash"
                                        className="my-2"
                                        value={inputState.txHash}
                                        onChange={this.onInputChange}
                                        errorState={errorState.txHash}
                                    />
                                    {!!errorState.nonField && (
                                        <div className="alert alert-danger">
                                            {errorState.nonField.map((x, i) => (
                                                <p
                                                    className={`${
                                                        i === 0 ? 'mb-0' : ''
                                                    }`}
                                                    key={i}>
                                                    {x}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    <div className="d-flex">
                                        <div className="flex-1" />
                                        <button
                                            className="btn btn-dark mr-2"
                                            onClick={
                                                this.cleanUpVotingModalAndClose
                                            }>
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-dark"
                                            onClick={this.onClickSubmit}>
                                            Submit
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>
                                    This token is archived, please contact
                                    support for further information{' '}
                                    <a
                                        href="http://t.me/bazafoundation"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        http://t.me/bazafoundation.
                                    </a>
                                </p>
                            )
                        ) : (
                            <p>Thank you for voting for {selectedToken.name}</p>
                        )
                    ) : (
                        <p>
                            The voting has been paused, please contact support
                            at{' '}
                            <a
                                href="http://t.me/bazafoundation"
                                target="_blank"
                                rel="noopener noreferrer">
                                http://t.me/bazafoundation.
                            </a>
                        </p>
                    )}
                </Modal.Body>
            </Modal>
        )
    }
}

export default VotingModal
