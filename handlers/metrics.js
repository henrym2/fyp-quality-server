const { Router } = require("express")
const objUtils = require("../js/objUtils")
const dataReader = require("../js/dataRead")
const { summaryCalcs } = require("../js/dataManipulation")
const KEY_DICT = dataReader.generateReadableLabels() 

const handler = Router()

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
        res.sendStatus(401)
    }
    res.json(objUtils.getCountsMetrics(registries.split(','), data))
})

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
    res.json(
        dataReader.averagesOverTime(registries.split(','), req.params.metric, start, end)
    )
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
        res.sendStatus(402)
        return
    }
    if (registries == []) {
        res.json({})
        return
    }
    res.json(summaryCalcs[metric](registries.split(','), data))
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

    if (req.params.metric === "consistency") {
        let metric = objUtils.getMetricValues(
            'consist',
            registries.split(','),
            data)
        res.json(
            Object.keys(metric).reduce((acc, cur) => {
                acc[cur] = objUtils.renameKeys(metric[cur], KEY_DICT)
                return acc
            }, {})
        )
    } else {
        res.json(
            objUtils.getMetricValues(
                req.params.metric,
                registries.split(','),
                data)
        )
    }
})

module.exports =  handler