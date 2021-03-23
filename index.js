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

app.get('/registries', (_, res) => {
    res.json(Object.keys(testData))
})

app.get('/metrics/:metric', (req,res) => {
    let {registries, set} = req.query

    let data = readDataCSV(__dirname+'\\data\\'+set)

    if (req.params.metric === "consistency") {
        res.json(
            objUtils.getMetricValues(
                'consist',
                registries.split(','),
                data)
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

app.get('/totals', (req, res) => {
    
    let {registries, set} = req.query
    let data = readDataCSV(__dirname+'\\data\\'+set)

    res.json(objUtils.getMetricValues("", registries.split(','), data))
})

app.post('/uploadCSV', uploader.single('file'), (_, res) => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    res.send(csvs[0].path)
})

app.get('/csvList', (_, res) => {
    let csvs = dataReader.getCSVList()
    res.json(csvs)
})

app.get('/timeData/:metric', (req, res) => {
    let {registries, start, end} = req.query
    res.json(
        dataReader.averagesOverTime(registries.split(','), req.params.metric, start, end)
    )
})

app.get('/getUploadedCSVList', (_, res) => {
    res.json(getCSVList())
})

app.listen(port, () => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    console.log(`Server listening on port:${port}`)
    // console.log(objUtils.renameKeys(testData['Hoth'], KEY_DICT))
})