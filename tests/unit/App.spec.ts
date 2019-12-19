import DragonSpinner from "../../src/pageparts/components/DragonSpinner.vue"
import { createLocalVue,shallowMount  } from "@vue/test-utils"


const localVue = createLocalVue()

describe("DragonSpinner.vue", () => {

  it("Expect it to exist?", () => {
    const msg = "new message"
    const wrapper = shallowMount(DragonSpinner, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })


})
