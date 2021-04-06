const { Router } = require("express")
const dataReader = require("../js/dataRead")
const uploader = require("../js/multer.js")

const KEY_DICT = dataReader.generateReadableLabels()

const handler = Router()

/**
 * @description Upon a successful post request, uploads a metrics CSV file
 * @param CSVfile
 * @name POST:/csvs
 * @function
 * @inner
 */
handler.post('/', uploader.single('file'), (_, res) => {
    let csvs = dataReader.getCSVList()
    res.status(201).send(csvs[0].path)
})

/**
 * @description Upon a successful GET request, return a list of all current csvs with path, name and filename
 * @param CSVfile
 * @name GET:/csvs
 * @function
 * @inner
 */
handler.get('/', (_, res) => {
    let csvs = dataReader.getCSVList()
    res.json(csvs)
})

module.exports = handler
