import { mount } from "@vue/test-utils"
import Header from "@/components/Header.vue"

describe("Header Component", () => {
  const MockFontAwesomeIcon = {
    name: "font-awesome-icon",
    template: "<span></span>",
  }
  it("should render header and icon", () => {
    const wrapper = mount(Header, {
      stubs: {
        FontAwesomeIcon: MockFontAwesomeIcon,
      },
    })
    let header = wrapper.find("h1")
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain("Departures")
    expect(wrapper.find(".icon").exists()).toBe(true)
  })
})
