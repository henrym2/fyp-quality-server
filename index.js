/**
 * @requires express
 * @requires cors
 */
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const dataReader = require("./js/dataRead.js")
const uploader = require("./js/multer.js")
const { readDataCSV } = require("./js/dataRead.js")
const metricsHandler = require("./handlers/metrics.js")
const registriesHandler = require("./handlers/registries.js")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000


app.use('/metrics', metricsHandler)
app.use('/registries', registriesHandler)

/**
 * @description Upon a successful post request, uploads a metrics CSV file
 * @param CSVfile
 * @name POST:/csvs
 * @function
 * @inner
 */
app.post('/csvs', uploader.single('file'), (_, res) => {
    let csvs = dataReader.getCSVList()
    res.send(csvs[0].path)
})

/**
 * @description Upon a successful GET request, return a list of all current csvs with path, name and filename
 * @param CSVfile
 * @name GET:/csvs
 * @function
 * @inner
 */
app.get('/csvs', (_, res) => {
    let csvs = dataReader.getCSVList()
    res.json(csvs)
})



//Server initialization function
app.listen(port, () => {
    let csvs = dataReader.getCSVList()
    console.log(`Server listening on port:${port}`)
    // console.log(objUtils.renameKeys(testData['Hoth'], KEY_DICT))
})