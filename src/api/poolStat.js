import { jsonAPI } from 'api/base'

export const getPools = () => {
    const url = `/poolstats/pools/`
    return jsonAPI(api => api.get(url))
}

export const getPoolStat = url => {
    return jsonAPI(api => api.get(url))
}
