const { Router } = require("express")
const dataReader = require("../js/dataRead")
const uploader = require("../js/multer.js")


const handler = Router()

/**
 * @description Upon a successful post request, uploads a metrics CSV file
 * @param CSVfile
 * @name POST:/csvs
 * @function
 * @inner
 */
handler.post('/', uploader.single('file'), (req, res) => {
    if (req.fileValidationError) {
        res.status(415).send(req.fileValidationError)
        return
    }
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

    if (csvs.length === 0) {
        res.status(204).json([])
        return
    }
    res.json(csvs)
})

module.exports = handler
