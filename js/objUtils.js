module.exports = {
    /**
    * @returns {Array}
    * @param {String} metric 
    * @param {Array} registries 
    * @param {Array} data 
    */
    getMetricValues(metric, registries, data) {
        if (typeof data !== "object" || Object.keys(data).length === 0 ) {
            return {}
        }
        let completeKeys = this.getKeys(metric, data[registries[0]])
        let results = registries.reduce((acc, cur) => {
            acc[cur] = this.filterKeyVals(completeKeys, data[cur])
            return acc
        }, {})
        return results
    },

    getKeys(param, obj) {
        if (typeof obj !== "object" || Object.keys(obj).length === 0) {
            return []
        }
        let keys = Object.keys(obj)
        return keys.filter(elm => elm.includes(param))
    },

    filterKeyVals(keys, obj) {
        if (typeof obj !== "object" || Object.keys(obj).length === 0) {
            return {}
        }
        let retObj = {}
        for (const [ key, val ] of Object.entries(obj)) {
            if (keys.includes(key)) {
                retObj[key] = val
            }
        }
        return retObj
    },

    /**
      * 
      * @param {Object} metrics An object of objects
      * @description Returns the average value for every value in a dictionary of objects  
      */
    objAverage(metrics){
        if ( metrics === null || typeof metrics !== "object" || Object.keys(metrics).length === 0 ) {
            return {}
        }
        return Object.keys(metrics).reduce((acc, cur) => {
            //Sums up and associates average with registry
            acc[cur] = parseInt(Object.values(metrics[cur])
                            //Sums and divides by number of values
                             .reduce((tot, e) => {
                                 tot += isNaN(parseInt(e)) ? 0 : parseInt(e)
                                 return tot
                            }, 0) / Object.values(metrics[cur]).length).toFixed(2)
            return acc
        }, {})
    },
    renameKeys(object, newKeys) {
        return Object.keys(object).reduce((acc, cur) => {
            acc[newKeys[cur]] = object[cur]
            return acc
        }, {})
    },
    getCountsMetrics(registries, data) {
        if (typeof data !== "object" || Object.keys(data).length === 0 ) {
            return {}
        }
        let completeKeys = this.getKeys('total', data[registries[0]])
        return registries.reduce((acc, cur) => {
            acc[cur] = this.filterKeyVals(completeKeys, data[cur])
            return acc
        }, {})
    }
}