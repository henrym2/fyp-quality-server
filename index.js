/**
 * @requires express
 */
/**
 * @const express
 */
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const objUtils = require("./js/objUtils.js")
const dataReader = require("./js/dataRead.js")
const { summaryCalcs } = require("./js/dataManipulation.js")
const uploader = require("./js/multer.js")
const { readDataCSV } = require("./js/dataRead.js")
const dataRead = require("./js/dataRead.js")

let testData = {}
const KEY_DICT = dataRead.generateReadableLabels() 

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000

/**
 * @description Upon a successful GET request provides summary calculations of all queried registries in the queried set
 * @param set The dataset to query
 * @param registries The registries to query
 * @name GET:/totals/metric
 * @function
 * @inner
 */
app.get('/totals/:metric', (req, res) => {
    let {registries, set} = req.query
    
    if (set === undefined || set === 'undefined') {
        set = dataReader.getCSVList()[0].path
    }
    let data = readDataCSV(__dirname+'\\data\\'+set)
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
 * @description Upon a successful GET request, provides a list of all registries in the most recent data set
 * @name GET:/registries
 * @function
 * @inner
 */
app.get('/registries', (_, res) => {
    res.json(Object.keys(testData))
})

/**
 * @description Upon a successful get request, returns the metric values for the queried set and registries
 * @param registries
 * @param set
 * @name GET:/metrics/metric
 * @function
 * @inner
 */
app.get('/metrics/:metric', (req,res) => {
    let {registries, set} = req.query

    let data = readDataCSV(__dirname+'\\data\\'+set)

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
/**
 * @description Upon a successful get request, returns the counts metrics for the queried set and registries
 * @param registries
 * @param set
 * @name GET:/counts
 * @function
 * @inner
 */
app.get('/counts', (req, res) => {
    let {registries, set} = req.query

    if (set === undefined || set === 'undefined') {
        set = dataReader.getCSVList()[0]
    }
    let data = readDataCSV(__dirname+'\\data\\'+set)
    if (registries == undefined) {
        res.sendStatus(401)
    }
    res.json(objUtils.getCountsMetrics(registries.split(','), data))
})

/**
 * @description Upon a successful get request, returns the totals metrics for the queried set and registries
 * @param registries
 * @param set
 * @name GET:/counts
 * @function
 * @inner
 */
app.get('/totals', (req, res) => {
    
    let {registries, set} = req.query
    let data = readDataCSV(__dirname+'\\data\\'+set)

    res.json(objUtils.getMetricValues("", registries.split(','), data))
})

/**
 * @description Upon a successful post request, uploads a metrics CSV file
 * @param CSVfile
 * @name POST:/uploadCSV
 * @function
 * @inner
 */
app.post('/uploadCSV', uploader.single('file'), (_, res) => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    res.send(csvs[0].path)
})

/**
 * @description Upon a successful GET request, return a list of all current csvs with path, name and filename
 * @param CSVfile
 * @name GET:/csvList
 * @function
 * @inner
 */
app.get('/csvList', (_, res) => {
    let csvs = dataReader.getCSVList()
    res.json(csvs)
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
app.get('/timeData/:metric', (req, res) => {
    let {registries, start, end} = req.query
    res.json(
        dataReader.averagesOverTime(registries.split(','), req.params.metric, start, end)
    )
})

/**
 * @description Upon a successful GET request, return a average over time data for a given metric on queried registries over a range
 * @name GET:/timeData/:metric
 * @function
 * @inner
 */
app.get('/getUploadedCSVList', (_, res) => {
    res.json(getCSVList())
})

//Server initialization function
app.listen(port, () => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    console.log(`Server listening on port:${port}`)
    // console.log(objUtils.renameKeys(testData['Hoth'], KEY_DICT))
})