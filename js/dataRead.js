const parse = require("csv-parse/lib/sync")
const fs = require("fs")

module.exports = {
    async readDataCSV(inputCSV) {
        const fileContent = await fs.readFileSync(inputCSV);
        const records = parse(fileContent, {columns: true});
        let init = {}
        for (let i = 1; i < Object.keys(records[0]).length; i++) {
            init[Object.keys(records[0])[i]] = {}
        }
        const data = records.reduce((acc, cur) => {
            let keys = Object.keys(cur)
            for (let i = 1; i < keys.length; i++) {
                acc[keys[i]][cur[keys[0]]] = cur[keys[i]]
            }
            return acc
        }, init)
        return data
    }
    
}