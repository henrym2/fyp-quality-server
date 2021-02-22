const { filterKeyVals } = require("../../js/objUtils")

const testObject = {
    "test1": 1,
    "test2": [],
    "nonTest1": 1,
    "nonTest2": []
}

test('Return object containing only keys input to function', () => {
    expect(filterKeyVals(['test1', 'test2'], testObject)).toStrictEqual({
        "test1": 1,
        "test2": []
    })
})

test('Return empty object if no keys are provided', () => {
    expect(filterKeyVals([], testObject)).toStrictEqual({})
})

test('Ensure case sensitive object access', () => {
    expect(filterKeyVals(['test1', 'Test2'], testObject)).toStrictEqual({
        "test1": 1,
    })
})