import Game, {ColorBlock, GameData} from './game'
import mts from './mutation-types'
import * as util from '../utils/util'

interface BlendokuState extends GameData{
  game: Object,
  config: Object
}

var state:BlendokuState = {
  game: {},
  config: {
  },
  blocks: []
}

var mutations = {
  ADD_BLOCKS: (state:BlendokuState, payload:any) => {
    util.replaceArray(state.blocks, payload.blocks)
  }
}

export default {
  state,
  mutations
}
