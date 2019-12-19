import Vue from "vue"

import "./assets/quasar/quasar.styl"
import "@quasar/extras/material-icons/material-icons.css"
import "@quasar/extras/mdi-v4/mdi-v4.css"
import Quasar from "quasar"

Vue.use(Quasar, {
  config: {
    animations: "all"
  }
})
