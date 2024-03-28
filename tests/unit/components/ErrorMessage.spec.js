import { mount } from "@vue/test-utils"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"

describe("ErrorMessage.vue", () => {
  const MockFontAwesomeIcon = {
    name: "font-awesome-icon",
    template: "<span></span>",
  }
  it("should render error message and icon", () => {
    const wrapper = mount(ErrorMessage, {
      stubs: {
        FontAwesomeIcon: MockFontAwesomeIcon,
      },
    })
    let errorMessage = wrapper.find("p")
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain("Server Error")
    expect(wrapper.find(".icon").exists()).toBe(true)
  })
})
