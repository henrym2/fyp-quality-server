const { objAverage } = require("../../js/objUtils")

const testObj = {
    "Alderaan": {
        "metric1": 10,
        "metric2": 20,
        "metric3": 25
    },
    "DeathStar": {
        "metric1": 10,
        "metric2": 20,
        "metric3": 15
    }
}

test("Ensure average is calculated for each nested object", () => {
    expect(objAverage(testObj)).toStrictEqual({
        Alderaan: 18.333333333333332,
        DeathStar: 15
    })
})

test("Ensure empty object returned if empty object supplied", () => {
    expect(objAverage({})).toStrictEqual({})
})

test("Ensure empty object returned if non object is supplied", () => {
    expect(objAverage([])).toStrictEqual({})
    expect(objAverage("")).toStrictEqual({})
    expect(objAverage(10)).toStrictEqual({})
    expect(objAverage()).toStrictEqual({})
})

test("Ensure NaN values are handled in object averaging", () => {
    const NaNObj = {
        "Alderaan": {
            "metric1": [],
            "metric2": {},
            "metric3": "hi"
        },
        "DeathStar": {
            "metric1": 10,
            "metric2": 20,
            "metric3": NaN
        }
    }
    expect(objAverage(NaNObj)).toStrictEqual({
        "Alderaan": 0,
        "DeathStar": 10
    })
})