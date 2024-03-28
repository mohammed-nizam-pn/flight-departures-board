import { mount } from "@vue/test-utils"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"

describe("DataUnavailable.vue", () => {
  const MockFontAwesomeIcon = {
    name: "font-awesome-icon",
    template: "<span></span>",
  }
  it("should render no flights available and icon", () => {
    const wrapper = mount(DataUnavailable, {
      stubs: {
        FontAwesomeIcon: MockFontAwesomeIcon,
      },
    })
    let dataUnavailable = wrapper.find("p")
    expect(dataUnavailable.exists()).toBe(true)
    expect(dataUnavailable.text()).toContain("No Flights Available")
    expect(wrapper.find(".icon").exists()).toBe(true)
  })
})
