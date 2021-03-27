const objUtils = require('./objUtils.js')

module.exports = {
    /**
     * @description Object containing a list of functions that can be indexed by metric type
     * @property
     */
    summaryCalcs: {
        /**
         * @description Retrieves registry data for the uniqueness metric
         * @param {string[]} reg List of registry names
         * @param {{
         *  registry: {
         *     fields: number
         * }
         * }} data Array of registry objects
         * @returns {object}
         */
        "unique": (reg, data) => {
            let metrics = objUtils.getMetricValues("unique", reg, data)
            return Object.keys(metrics).reduce((acc, cur) => {
                acc[cur] = (100 - parseInt(metrics[cur]['unique_ids_perc'])).toFixed(2)
                return acc
            }, {})
        },
        /**
         * @description Retrieves registry data for completeness metric
         * @param {string[]} reg List of registry names
         * @param {{
         *  registry: {
         *      fields: number
         * }
         * }} data Array of registry objects
         * @returns {Object}
         */
        "complete": (reg, data) => {
            let metrics = objUtils.getMetricValues("complete", reg, data)
            return Object.keys(metrics).reduce((acc, cur) => {
                acc[cur] = parseInt(metrics[cur]['complete_all']).toFixed(2)
                return acc
            }, {})
        },
        /**
         * @description Retrieves registry data for consistency metric
         * @param {string[]} reg List of registry names
         * @param {{
         *  registry: {
         *      fields: number
         * }
         * }} data Array of registry objects
         * @returns {Object}
         */
        "consistency": (reg, data) => {
            let metrics = objUtils.getMetricValues("consist", reg, data)
            return objUtils.objAverage(metrics)
        },
        /**
         * @description Retrieves registry data for correctness metric
         * @param {string[]} reg List of registry names
         * @param {{
         *  registry: {
         *      fields: number
         * }
         * }} data Array of registry objects
         * @returns {Object}
         */
        "correct": (reg, data) => {
            let metrics = objUtils.getMetricValues("correct", reg, data)
            return objUtils.objAverage(metrics)
        }
    }
}