const { Router } = require("express")
const objUtils = require("../js/objUtils")
const dataReader = require("../js/dataRead")

const handler = Router()


/**
 * @description Upon a successful GET request, provides a list of all registries in the most recent data set
 * @name GET:/registries
 * @function
 * @inner
 */
handler.get('/', (req, res) => {
    const { set } = req.query

    let csvs = []

    if (set === undefined || set === "undefined") {
        csvs = dataReader.getCSVList()
    }
    res.json(Object.keys(
        dataReader.readDataCSV(__dirname+'\\..\\data\\'+csvs[0].path)
    ))
})

module.exports = handler