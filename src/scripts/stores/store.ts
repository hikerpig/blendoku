import {Store} from 'vuex'
import * as Blendoku from 'scripts/blendoku/store'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {extend, each} from 'lodash'

interface StoreOptions {
  modules?: Object
}

var store = new Store({
  modules: {
    doku: Blendoku
  }
})

export default store
