import Vue from "vue"
import App from "./App.vue"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
  faPlaneDeparture,
  faPlaneSlash,
  faCircleExclamation,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons"

/*
 * Adding font awesone icons to the svg library and creating a component.
 * Refer https://docs.fontawesome.com/web/use-with/vue/ for more.
 */
library.add(faPlaneDeparture, faPlaneSlash, faCircleExclamation, faArrowUp)
Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({
  render: (h) => h(App),
}).$mount("#app")
