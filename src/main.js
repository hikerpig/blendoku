import store from 'scripts/stores/store'
import {Blendoku} from 'scripts/blendoku/index'
// import RiddleFactory from 'scripts/blendoku/riddle-factory'
// import * as util from 'scripts/utils/util'
// import store from 'scripts/stores/store'

require('./styles/app.scss')

// window.store = store

/* eslint-disable no-new */
const blendoku = new Blendoku({
  store: store
})
window.blendoku = blendoku
window.store = store

blendoku.startByRiddleId(0)
// blendoku.start()
// blendoku.startByRiddleFrames(gameData.riddleFrames)
