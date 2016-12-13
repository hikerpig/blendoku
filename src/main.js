// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from './App'
import {Blendoku} from 'scripts/blendoku/index'

// const store = require('scripts/stores/store')
// window.store = store

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })

const blendoku = new Blendoku()
window.blendoku = blendoku
blendoku.start()
