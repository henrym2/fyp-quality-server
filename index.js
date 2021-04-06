/**
 * @requires express
 * @requires cors
 */
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const dataReader = require("./js/dataRead.js")
const metricsHandler = require("./handlers/metrics.js")
const registriesHandler = require("./handlers/registries.js")
const csvsHandler = require("./handlers/csvs.js")
const multer = require("multer")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000

//Metrics interface
app.use('/metrics', metricsHandler)

//Registries interface
app.use('/registries', registriesHandler)

//CSVS interface
app.use('/csvs', csvsHandler)

//Server initialization function
app.listen(port, () => {
    let csvs = dataReader.getCSVList()
    console.log(`Server listening on port:${port}`)
})