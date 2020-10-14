export const getReadableCoins = (coins, coinUnits) =>
    Number(coins / coinUnits).toFixed(coinUnits.toString().length - 1)

export const getReadableHashRateString = hashrate => {
    let i = 0
    const byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH']
    while (hashrate > 1000) {
        hashrate = hashrate / 1000
        i++
    }
    return hashrate.toFixed(2) + byteUnits[i]
}

export const getPoolPercentage = poolStat => {
    const netWorkHash =
        poolStat.network.difficulty / poolStat.config.coinDifficultyTarget
    const poolHash = poolStat.pool.hashrate
    return Number((poolHash / netWorkHash) * 100).toFixed(2)
}
