const parse = require("csv-parse/lib/sync")
const fs = require("fs")
const { summaryCalcs } = require("./dataManipulation.js")

module.exports = {
    /**
     * @description Generates readable labels based on a key value dictionary between field names and "readable" versions of the names. To be used when replacing registry data field names with readable versions
     * @returns {{
     *  field: string 
     * }} Key value dict between field values and readable names
     */
    generateReadableLabels() {
        const fileContent = fs.readFileSync(__dirname+'\\..\\dictionary\\valueToLabelDict.csv')
        const records = parse(fileContent)
        return records.reduce((acc, cur) => {
            acc[cur[0]] = cur[1]
            return acc
        }, {})
    },
    /**
     * @description Read the data from the CSV files and construct an appropriate object for consumption by the other functions. 
     * @param {string} inputCSV Path to CSV
     * @returns {Object} Data
     */
    readDataCSV(inputCSV) {
        try {
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
        } catch (err) {
            return {}
        }
    },
    /**
     * @description Get a list of all CSVs currently stored
     * @returns {
     *  {
     *  name: string,
     *  date: date,
     *  path: string
     * }[]
     * }
     */
    getCSVList() {
        try {
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
        } catch (e) {
            return []
        }
    },
    /**
     * @description Retrieve average data for a metric/registry combination over time
     * @param {string} registry Registrys to retrieve data for
     * @param {string} metric Metric to retrieve
     * @param {Date | String} start start date
     * @param {Date | String} end End date
     * @returns {Object}
     */
    averagesOverTime(registry, metric, start, end) {
        try {
            let startDate = new Date(parseInt(start))
            let endDate = new Date(parseInt(end))
            const csvsByDate = this.getCSVList().filter(e => {            
                return e.date >= startDate && e.date <= endDate 
            })
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
        } catch (e) {
            return []
        }
    }
}