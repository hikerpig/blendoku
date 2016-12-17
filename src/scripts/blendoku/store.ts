import Game, {ColorBlock, GameData, GameConfig} from './game'
import mts from './mutation-types'
import * as util from '../utils/util'
import globals from 'scripts/globals'
import {assign, clone} from 'lodash'
// import getters from './getters'

interface BlendokuState extends GameData{
  game: Object,
  config: GameConfig
}

var state:BlendokuState = {
  game: {},
  config: {
    boardUSize: {
      w: 15,
      h: 15
    },
    unitLen: 40
  },
  blocks: []
}

var mutations = {
  ADD_BLOCKS: (state:BlendokuState, payload:any) => {
    util.replaceArray(state.blocks, payload.blocks)
  },
  DRAG_BLOCK_TO: (state:BlendokuState, payload:any) => {
    // console.log('DRAG_BLOCK_TO', state, payload);
    let {from, to} = payload
    let {uid} = payload.sender
    let {game} = globals
    let fBlock = game.getBlockByCoord(from.coord)
    let tBlock = game.getBlockByCoord(to.coord)
    // console.log('fBlock', fBlock);
    if (tBlock && fBlock) {
      let fColor = clone(fBlock.color)
      let tColor = clone(tBlock.color)
      assign(tBlock.color, fColor)
      assign(fBlock.color, tColor)
      // assign(tBlock.coord, clone(from.coord))
    } else {
      assign(fBlock.coord, clone(to.coord))
    }
  }
}

export default {
  state,
  mutations,
  // getters
}
