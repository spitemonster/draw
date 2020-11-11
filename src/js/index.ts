import './bootstrap.js';
import Vue from 'vue';

import App from './vue/App.vue';
// don't know if I'll need a Bus yet but rather have it set up here just in case
// import Bus from './Bus';

new Vue({
  render: (h: any) => h(App),
}).$mount('#app');
