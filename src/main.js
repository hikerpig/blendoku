// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
const store = require('scripts/stores/store').default
import {Blendoku} from 'scripts/blendoku/index'
// import store from 'scripts/stores/store'

require('styles/app.scss')

// window.store = store

/* eslint-disable no-new */
const blendoku = new Blendoku({
  store: store
})
window.Vue = Vue
window.blendoku = blendoku
window.store = store
blendoku.start()

const App = require('./App')
new Vue({
  el: '#app',
  // components: { App },
  store,
  render: function (h) { return h(App) }
})
