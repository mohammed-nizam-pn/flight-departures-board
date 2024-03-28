import { mount } from "@vue/test-utils"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"

describe("LoadingAnimation.vue", () => {
  it("should render loading animation", () => {
    const wrapper = mount(LoadingAnimation, {})
    let loadingAnimation = wrapper.find(".loading-animation")
    expect(loadingAnimation.exists()).toBe(true)
  })
})
