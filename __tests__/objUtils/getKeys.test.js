const { getKeys } = require("../../js/objUtils.js")

const testObject = {
    "test1": 1,
    "test2": [],
    "nonTest1": 1,
    "nonTest2": []

}

test('Get keys from a test object with the param `test`', () => {
    expect(getKeys("test", testObject)).toStrictEqual(["test1", "test2"])
})

test('Get all keys with empty search param', () => {
    expect(getKeys("", testObject)).toStrictEqual(["test1", "test2", "nonTest1", "nonTest2"])
})

test('Ensure case sensitivity', () => {
    expect(getKeys("Test", testObject)).toStrictEqual(["nonTest1", "nonTest2"])
})