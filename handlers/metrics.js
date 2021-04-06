const { Router } = require("express")
const objUtils = require("../js/objUtils")
const dataReader = require("../js/dataRead")
const { summaryCalcs } = require("../js/dataManipulation")
const KEY_DICT = dataReader.generateReadableLabels() 

const handler = Router()

/**
 * Utility function for checking if a date is valid
 * @param {date} d Date to check if valid
 * @returns {boolean}
 */
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

/**
 * @description Upon a successful GET request, return a average over time data for a given metric on queried registries over a range
 * @param registries
 * @param start
 * @param end
 * @name GET:/timeData/:metric
 * @function
 * @inner
 */
handler.get('/timeData/:metric', (req, res) => {
    let {registries, start, end} = req.query

    if (registries === undefined || start === undefined || end === undefined) {
        res.sendStatus(400)
        return
    }

    if (!isValidDate(new Date(parseInt(start))) || !isValidDate(new Date(parseInt(end)))) {
        res.sendStatus(400)
        return
    }

    if (registries == []) {
        res.status(204).json([])
        return
    }

    let metricData = dataReader.averagesOverTime(registries.split(','), req.params.metric, start, end)
    
    if (metricData.length === 0 || metricData.every(e => Object.keys(e.data).length === 0)) {
        res.status(204).json([])
        return
    }
    res.json(metricData)
})

/**
 * @description Upon a successful GET request provides summary calculations of all queried registries in the queried set
 * @param set The dataset to query
 * @param registries The registries to query
 * @name GET:/totals/metric
 * @function
 * @inner
 */
handler.get('/totals/:metric', (req, res) => {
    let {registries, set} = req.query
    
    if (set === undefined || set === 'undefined') {
        set = dataReader.getCSVList()[0].path
    }
    
    let data = dataReader.readDataCSV(__dirname+'\\..\\data\\'+set)
    let metric = req.params.metric

    if (registries == undefined) {
        res.sendStatus(400)
        return
    }

    if (registries == []) {
        res.status(204).json({})
        return
    }

    let summaryData = summaryCalcs[metric](registries.split(','), data)

    if (Object.keys(summaryData).length === 0) {
        res.status(204).json({})
        return
    }
    res.json(summaryData)
})

/**
 * @description Upon a successful get request, returns the counts metrics for the queried set and registries
 * @param registries
 * @param set
 * @name GET:/counts
 * @function
 * @inner
 */
 handler.get('/counts', (req, res) => {
    let {registries, set} = req.query

    if (set === undefined || set === 'undefined') {
        set = dataReader.getCSVList()[0]
    }

    let data = dataReader.readDataCSV(__dirname+'\\..\\data\\'+set)

    if (registries == undefined) {
        res.sendStatus(400)
        return
    }

    if (registries.length === 0) {
        res.status(204).json({})
        return
    }

    let countMetrics = objUtils.getCountsMetrics(registries.split(','), data)

    if (Object.keys(countMetrics).length === 0) {
        res.status(204).json({})
        return
    }

    res.json(countMetrics)
})

/**
 * @description Upon a successful get request, returns the metric values for the queried set and registries
 * @param registries
 * @param set
 * @name GET:/metrics/metric
 * @function
 * @inner
 */
 handler.get('/:metric', (req,res) => {
    let {registries, set} = req.query

    let data = dataReader.readDataCSV(__dirname+'\\..\\data\\'+set)

    if (registries == undefined) {
        res.sendStatus(400)
        return
    }

    if (registries.length === 0) {
        res.status(203).json({})
        return
    }

    let metricValues

    if (req.params.metric === "consistency") {
        metricValues = objUtils.getMetricValues('consist', registries.split(','), data)
        if (Object.keys(metricValues) === 0) {
            res.status(203).json({})
            return
        }
        res.json(
            Object.keys(metricValues).reduce((acc, cur) => {
                acc[cur] = objUtils.renameKeys(metricValues[cur], KEY_DICT)
                return acc
            }, {})
        )
    } else {
        metricValues = objUtils.getMetricValues(req.params.metric, registries.split(','), data)
        if (Object.keys(metricValues) === 0) {
            res.status(203).json({})
            return
        }
        res.json(metricValues)
    }
})

module.exports =  handler