import { mount } from "@vue/test-utils"
import App from "@/App.vue"
import Header from "@/components/Header.vue"
import FlightDetails from "@/components/flightDisplay/FlightDetails.vue"

describe("App.vue", () => {
  it("renders the correct subcomponents", () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(Header).exists()).toBe(true)
    expect(wrapper.findComponent(FlightDetails).exists()).toBe(true)
  })
})
