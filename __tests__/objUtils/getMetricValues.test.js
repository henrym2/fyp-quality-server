const objUtils = require("../../js/objUtils")

const testData = {
    Alderaan: { 
        "metric1": 10,
        "metric2": 15,
        "test1": 20
    },
    DeathStar: {
        "metric1": 15,
        "metric2": 20,
        "test1": 25
    },
    StarBase: {
        "metric1": 20,
        "metric2": 25,
        "test1": 30
    }
}

test("Ensure correct metrics are returned", () => {
    expect(objUtils.getMetricValues("test", ['Alderaan', 'DeathStar', 'StarBase'], testData)).toStrictEqual({
        Alderaan: {
            test1: 20
        },
        DeathStar: {
            test1: 25
        },
        StarBase: {
            test1: 30
        }
    })
})

test("Ensure correct registries are returned", () => {
    expect(objUtils.getMetricValues("test", ['Alderaan', 'DeathStar'], testData)).toStrictEqual({
        Alderaan: {
            test1: 20
        },
        DeathStar: {
            test1: 25
        },
    })
})

test("Ensure that is empty search param all keys are returned", () => {
    expect(objUtils.getMetricValues("", ['Alderaan', 'DeathStar', 'StarBase'], testData)).toStrictEqual(
        {
            Alderaan: { 
                "metric1": 10,
                "metric2": 15,
                "test1": 20
            },
            DeathStar: {
                "metric1": 15,
                "metric2": 20,
                "test1": 25
            },
            StarBase: {
                "metric1": 20,
                "metric2": 25,
                "test1": 30
            }
        }
    )
})

test("Ensure empty object is returned if data is empty", () => {
    expect(objUtils.getMetricValues("", ['Alderaan', 'DeathStar', 'StarBase'], {})).toStrictEqual({})
    
})