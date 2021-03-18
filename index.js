const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const objUtils = require("./js/objUtils.js")
const dataReader = require("./js/dataRead.js")
const { summaryCalcs } = require("./js/dataManipulation.js")
const uploader = require("./js/multer.js")
const { readDataCSV } = require("./js/dataRead.js")

let testData = {}

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000

app.post('/totals/:metric', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    
    if (set.path === undefined) {
        set = dataReader.getCSVList()[0]
    }
    let data = readDataCSV(__dirname+'\\data\\'+set.path)
    let metric = req.params.metric
    if (reg == undefined) {
        res.sendStatus(402)
    }
    if (reg == []) {
        res.json({})
    }
    res.json(summaryCalcs[metric](reg, data))
})

app.get('/registries', (_, res) => {
    res.json(Object.keys(testData))
})

app.post('/totals', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    let data = readDataCSV(__dirname+'\\data\\'+set.path)

    res.json(objUtils.getMetricValues("", reg, data))
})

app.post('/completeness', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    let data = readDataCSV(__dirname+'\\data\\'+set.path)

    res.json(objUtils.getMetricValues("complete", reg, data))
})

app.post('/uniqueness', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    let data = readDataCSV(__dirname+'\\data\\'+set.path)

    res.json(objUtils.getMetricValues("unique", reg, data))
})

app.post('/consistency', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    let data = readDataCSV(__dirname+'\\data\\'+set.path)

    res.json(objUtils.getMetricValues("consist", reg, data))
})

app.post('/correctness', (req, res) => {
    let reg = req.body.registries
    let set = req.body.set
    let data = readDataCSV(__dirname+'\\data\\'+set.path)

    res.json(objUtils.getMetricValues("correct", reg, data))
})

app.post('/uploadCSV', uploader.single('file'), (_, res) => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    res.send()
})

app.get('/csvList', (_, res) => {
    let csvs = dataReader.getCSVList()
    res.json(csvs)
})

app.post('/timeData', (req, res) => {
    let reg = req.body.registries
    let metric = req.body.metric
    res.json(dataReader.averagesOverTime(reg, metric))
})

app.get('/getUploadedCSVList', (_, res) => {
    res.json(getCSVList())
})

app.listen(port, () => {
    let csvs = dataReader.getCSVList()
    testData = readDataCSV(__dirname+'\\data\\'+csvs[0].path)
    console.log(`Server listening on port:${port}`)
})