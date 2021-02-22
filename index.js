const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const objUtils = require("./js/objUtils.js")
const { readDataCSV } = require("./js/dataRead")

let testData = {}


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000

app.post('/totals/:metric', (req, res) => {
    let reg = req.body
    let metric = req.params.metric
    if (reg == undefined) {
        res.sendStatus(402)
    }
    if (reg == []) {
        res.json({})
    }
    res.json(summaryCalcs[metric](reg))
})

app.get('/registries', (_, res) => {
    res.json(Object.keys(testData))
})

app.post('/totals', (req, res) => {
    let reg = req.body.registries
    res.json(objUtils.getMetricValues("", reg, testData))
})

app.post('/completeness', (req, res) => {
    let reg = req.body
    res.json(objUtils.getMetricValues("complete", reg, testData))
})

app.post('/uniqueness', (req, res) => {
    let reg = req.body
    res.json(objUtils.getMetricValues("unique", reg, testData))
})

app.post('/consistency', (req, res) => {
    let reg = req.body
    res.json(objUtils.getMetricValues("consist", reg, testData))
})

app.post('/correctness', (req, res) => {
    let reg = req.body
    res.json(objUtils.getMetricValues("correct", reg, testData))
})


app.listen(port, async () => {
    testData = await readDataCSV(__dirname+'\\'+'testData.csv')
    console.log(`Server listening on port:${port}`)
})

const summaryCalcs = {
    "unique": (reg) => {
        let metrics = objUtils.getMetricValues("unique", reg, testData)
        return Object.keys(metrics).reduce((acc, cur) => {
            acc[cur] = 100 - parseInt(metrics[cur]['unique_ids_perc'])
            return acc
        }, {})
    },
    "complete": (reg) => {
        let metrics = objUtils.getMetricValues("complete", reg, testData)
        return Object.keys(metrics).reduce((acc, cur) => {
            acc[cur] = parseInt(metrics[cur]['complete_all'])
            return acc
        }, {})
    },
    "consistency": (reg) => {
        let metrics = objUtils.getMetricValues("consist", reg, testData)
        return objUtils.objAverage(metrics)
    },
    "correct": (reg) => {
        let metrics = objUtils.getMetricValues("correct", reg, testData)
        return objUtils.objAverage(metrics)
    }
}