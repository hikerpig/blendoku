import Blendoku from '../blendoku/store'
// import * as Vue from 'vue'
import Vue from 'vue'
import {install, Store} from 'vuex'
import * as getters from '../blendoku/getters'
install(Vue)

console.log('blendoku', Blendoku)
var store = new Store({
  modules: {
    game: Blendoku,
    // game: {
    //   state: Blendoku.state,
    //   mutations: Blendoku.mutations
    // }
  },
  getters: getters
})

export default store

export function getState() {
  return store.state
}
