import { jsonAPI } from 'api/base'

export const getCurrentSession = () => {
    return jsonAPI(api => api.get('/votingsession/current/'))
}

export const voteForToken = data => {
    return jsonAPI(api => api.post('/votingpayment/', data))
}

export const getVotingPaymentAddress = () => {
    return jsonAPI(api => api.get('/votingpayment/address/'))
}
