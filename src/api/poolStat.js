import { jsonAPI } from 'api/base'

export const getPoolStat = url => {
    return jsonAPI(api => api.get(url))
}
