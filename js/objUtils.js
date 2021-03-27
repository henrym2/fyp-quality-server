module.exports = {
    /**
     * @description Retrieve values for a specific metric and list of registries from CSV read data
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
    /**
     * @description Retrieve a list of keys from an object based on a given search param/keyword
     * @param {string} param Search parameter for filting keys
     * @param {object} obj Object to filter
     * @returns {Object}
     */
    getKeys(param, obj) {
        if (typeof obj !== "object" || Object.keys(obj).length === 0) {
            return []
        }
        let keys = Object.keys(obj)
        return keys.filter(elm => elm.includes(param))
    },
    /**
     * @description Filter an objects key value pairs based on a provided list of keys
     * @param {string[]} keys List of object keys
     * @param {Object} obj Object to be filtered
     * @returns {Object} filtered object
     */
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
    /**
     * @description Utility function for replacing the keys for specific values in an object. 
     * @param {object} object Object with keys to be renamed
     * @param {Object} newKeys Object containing key value pairs between old and new values for the input object keys
     * @returns {Object} New object with replaced keys
     */
    renameKeys(object, newKeys) {
        return Object.keys(object).reduce((acc, cur) => {
            if (newKeys[cur] !== undefined) acc[newKeys[cur]] = object[cur]
            else acc[cur] = object[cur]
            return acc
        }, {})
    },
    /**
     * @description Retrieves specifically "totals" metrics from a list of registries in a dataset
     * @param {string[]} registries List of registries
     * @param {Object} data Data
     * @returns {Object}
     */
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