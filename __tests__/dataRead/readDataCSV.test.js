const { readDataCSV } = require("../../js/dataRead")

test("Test that data is read", async () => {
    await expect(readDataCSV(__dirname+'\\testData.csv')).resolve
})