import React from 'react'
import Modal from 'react-bootstrap/Modal'
import classnames from 'classnames'
import get from 'lodash/get'

import { voteForToken, getVotingPaymentAddress } from 'api/voting'

import TextInput from 'components/TextInput'

import s from './Voting.module.scss'

//TODO: Clean up modal on close(maybe others too)
class VotingModal extends React.Component {
    state = {
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
                    inputState: {
                        txHash: '',
                    },
                    votingSuccess: true,
                    errorState: {
                        txHash: null,
                        nonField: null,
                    },
                })
            })
            .catch(responseData => {
                this.setState({
                    txHash: get(responseData, 'tx_hash', null),
                    nonField: get(responseData, 'non_field_errors', null),
                })
            })
    }

    render() {
        const {
            className,
            votingModalIsOpen,
            closeVotingModal,
            selectedToken,
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
                onHide={closeVotingModal}
                dialogClassName={cx}>
                <Modal.Header>
                    <Modal.Title>Vote for {selectedToken.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!votingSuccess ? (
                        <>
                            <p>
                                Send BAZA to the address mentioned below, then
                                add the transaction hash below and submit
                            </p>
                            <p className="payment-address">{votingAddress}</p>
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
                                    onClick={closeVotingModal}>
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
                        <p>Thank you for voting for {selectedToken.name}</p>
                    )}
                </Modal.Body>
            </Modal>
        )
    }
}

export default VotingModal
