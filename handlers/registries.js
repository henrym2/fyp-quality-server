const { Router } = require("express")
const objUtils = require("../js/objUtils")
const dataReader = require("../js/dataRead")

const handler = Router()

/**
 * @description Upon a successful GET request, provides all metric values for a specific set
 * @name GET:/totals
 * @function
 * @inner
 */
handler.get('/totals', (req, res) => {
    let {registries, set} = req.query
    let data = dataReader.readDataCSV(__dirname+'\\data\\'+set)

    res.json(objUtils.getMetricValues("", registries.split(','), data))
})

/**
 * @description Upon a successful GET request, provides a list of all registries in the most recent data set
 * @name GET:/registries
 * @function
 * @inner
 */
handler.get('/', (_, res) => {
    const csvs = dataReader.getCSVList()
    res.json(Object.keys(
        dataReader.readDataCSV(__dirname+'\\..\\data\\'+csvs[0].path)
    ))
})

module.exports = handler