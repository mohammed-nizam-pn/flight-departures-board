import { mount } from "@vue/test-utils"
import App from "@/App.vue"

describe("App.vue", () => {
  const MockFontAwesomeIcon = {
    name: "font-awesome-icon",
    template: "<span></span>",
  }
  it("should render header and icon", () => {
    const wrapper = mount(App, {
      stubs: {
        FontAwesomeIcon: MockFontAwesomeIcon,
      },
    })
    let header = wrapper.find("#main-container")
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain("Departures")
    expect(wrapper.find(".icon").exists()).toBe(true)
  })
})
