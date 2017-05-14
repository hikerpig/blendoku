// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// const store = require('scripts/stores/store').default
// import store from 'scripts/stores/game'
import store from 'scripts/stores/store'
import {Blendoku} from 'scripts/blendoku/index'
import RiddleFactory from 'scripts/blendoku/riddle-factory'
// import * as util from 'scripts/utils/util'
// import store from 'scripts/stores/store'

require('styles/app.scss')

var gameData = RiddleFactory.test()

// window.store = store

/* eslint-disable no-new */
const blendoku = new Blendoku({
  store: store
})
window.blendoku = blendoku
window.store = store

// blendoku.start()
blendoku.startByRiddleFrames(gameData.riddleFrames)
