const { Router } = require("express")
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

    let registries = Object.keys(
        dataReader.readDataCSV(__dirname+'\\..\\data\\'+csvs[0].path)
    )

    if (registries.length === 0 || csvs.length === 0) {
        res.status(204).json({})
        return
    }
    
    res.json(registries)
})

module.exports = handler