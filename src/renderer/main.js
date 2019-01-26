import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import VTooltip from 'v-tooltip'
import axios from 'axios'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import Spinner from 'vue-spinkit'
require("vue-awesome-notifications/dist/styles/style.css")
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import VueAWN from "vue-awesome-notifications"


import App from './App'
import router from './router'
import store from './store'
let VueScrollTo = require('vue-scrollto');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueLazyLoad)
Vue.use(VTooltip, {defaultDelay: 150,})
Vue.use(VuejsDialog, {
   html: true,
   okText: 'OK',
   cancelText: 'Cancel action',
})
Vue.use(VueAWN, {
   icons: {enabled: false}
})
Vue.use(VueScrollTo)

Vue.component('Spinner', Spinner)

/* eslint-disable no-new */
new Vue({
   components: {App},
   router,
   store,
   template: '<App/>'
}).$mount('#app')
