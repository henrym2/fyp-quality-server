const objUtils = require('./objUtils.js')

module.exports = {
    summaryCalcs: {
        "unique": (reg, data) => {
            let metrics = objUtils.getMetricValues("unique", reg, data)
            return Object.keys(metrics).reduce((acc, cur) => {
                acc[cur] = 100 - parseInt(metrics[cur]['unique_ids_perc'])
                return acc
            }, {})
        },
        "complete": (reg, data) => {
            let metrics = objUtils.getMetricValues("complete", reg, data)
            return Object.keys(metrics).reduce((acc, cur) => {
                acc[cur] = parseInt(metrics[cur]['complete_all'])
                return acc
            }, {})
        },
        "consistency": (reg, data) => {
            let metrics = objUtils.getMetricValues("consist", reg, data)
            return objUtils.objAverage(metrics)
        },
        "correct": (reg, data) => {
            let metrics = objUtils.getMetricValues("correct", reg, data)
            return objUtils.objAverage(metrics)
        }
    }
}