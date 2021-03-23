const { TestScheduler } = require("@jest/core")
const { renameKeys } = require("../../js/objUtils.js")

/**
 * renameKeys(object, newKeys) {
        return Object.keys(object).reduce((acc, cur) => {
            acc[newKeys[cur]] = object[cur]
            return acc
        }, {})
    },
 */

const testObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
}

test("Ensure single key is changed and all others are untouched", () => {
    expect(renameKeys(testObj, {"a": "newA"})).toStrictEqual({
        newA: 1,
        b: 2,
        c: 3,
        d: 4
    })
})