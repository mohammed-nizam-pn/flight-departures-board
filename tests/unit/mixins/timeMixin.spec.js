import { timeMixin } from "@/mixins/timeMixin.js"

describe("timeMixin", () => {
  it("should format time correctly", () => {
    const testDateTime = "2022-08-22T10:51:00"
    const expectedResult = "10.51"
    const vm = {
      methods: {
        formatTime: timeMixin.methods.formatTime,
      },
    }
    const formattedTime = vm.methods.formatTime(testDateTime)
    expect(formattedTime).toEqual(expectedResult)
  })
})
