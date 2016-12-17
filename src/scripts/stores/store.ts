import Blendoku from '../blendoku/store'
import * as Vue from 'vue'
import {install, Store} from 'vuex'
install(Vue)

var store = new Store({
  modules: {
    game: Blendoku
  }
})

export default store
