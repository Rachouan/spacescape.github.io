import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader';

import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.config.ignoredElements = [/ion-\w*/];

defineIonPhaser(window);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
