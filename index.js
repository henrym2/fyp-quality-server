/**
 * @requires express
 * @requires cors
 */

//External modules
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

//Handlers
const metricsHandler = require("./handlers/metrics.js")
const registriesHandler = require("./handlers/registries.js")
const csvsHandler = require("./handlers/csvs.js")

//App setup
const port = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(cors())


//Metrics interface
app.use('/metrics', metricsHandler)

//Registries interface
app.use('/registries', registriesHandler)

//CSVS interface
app.use('/csvs', csvsHandler)

//Server initialization function
app.listen(port, () => {
    console.log(`Server listening on port:${port}`)
})