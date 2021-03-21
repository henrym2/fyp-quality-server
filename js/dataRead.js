const parse = require("csv-parse/lib/sync")
const fs = require("fs")
const { summaryCalcs } = require("./dataManipulation.js")

module.exports = {
    generateReadableLabels() {
        const fileContent = fs.readFileSync(__dirname+'\\..\\dictionary\\valueToLabelDict.csv')
        const records = parse(fileContent)
        return records.reduce((acc, cur) => {
            acc[cur[0]] = cur[1]
            return acc
        }, {})
    },
    readDataCSV(inputCSV) {
        const fileContent = fs.readFileSync(inputCSV);
        const records = parse(fileContent, {columns: true});
        let init = {}
        for (let i = 1; i < Object.keys(records[0]).length; i++) {
            init[Object.keys(records[0])[i]] = {}
        }
        const data = records.reduce((acc, cur) => {
            let keys = Object.keys(cur)
            for (let i = 1; i < keys.length; i++) {
                acc[keys[i]][cur[keys[0]]] = Number(cur[keys[i]]).toFixed(2)
            }
            return acc
        }, init)
        return data
    },
    getCSVList() {
        let fileList = fs.readdirSync('./data')
        let filesByDate = fileList.map(e => {
            let split = e.split('-')
            return {
                name: split[1],
                date: new Date(parseInt(split[0])),
                path: e
            }
        }).sort((a,b) => new Date(b.date) - new Date(a.date))
        return filesByDate
    },
    averagesOverTime(registry, metric) {
        // const metrics = Object.keys(summaryCalcs)
        const csvsByDate = this.getCSVList()
        const ret = csvsByDate.reduce((date, e) => {
            let data = this.readDataCSV(__dirname+'\\..\\data\\'+e.path)
            date[e.date] = summaryCalcs[metric](registry, data)
            return date
        }, {})
        const newRet = registry.map(r => {
            return {
                name: r,
                data: Object.keys(ret).reduce((acc, elm) => {
                    acc[elm] = parseInt(ret[elm][r]).toFixed(2)
                    return acc
                }, {})
            }
        })
        return newRet
    }
}