import Vue from "vue"
import App from "./App.vue"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faPlaneDeparture } from "@fortawesome/free-solid-svg-icons"

library.add(faPlaneDeparture)

Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({
  render: (h) => h(App),
}).$mount("#app")
