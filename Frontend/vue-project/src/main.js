import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'

// import './api/axios.js'
import axios from 'axios'

// To set access token cookie in the request headers
axios.defaults.baseURL = 'http://localhost:3333/api/';
axios.defaults.withCredentials = true;

// Binds the axios variable to the window variable
// to give access to the functionality within any VueJS component
window.axios = require('axios');


// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
// import { VBtn } from 'vuetifyjs/components'

const vuetify = createVuetify({
  components,
  directives,
  // blueprint: md3,
  // aliases: {
  //   VBtnSecondary: VBtn,
  // },
  defaults: {
    VBtn: {
      color: 'deep-orange-darken-4',
      // variant: 'text',
    },
  }
})


// Create and mount the root instance.
createApp(App).use(vuetify).use(store).use(router).mount('#app')
