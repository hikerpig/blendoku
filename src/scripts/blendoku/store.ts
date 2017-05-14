import Game, {ColorBlock, GameData, GameConfig} from './game'
import * as util from '../utils/util'
import globals from 'scripts/globals'
import {assign, clone} from 'lodash'
import {observable, reaction, action, autorun} from 'mobx'

export interface IBlendokuStore extends GameData {
  game: Object,
  config: GameConfig
}
class BlendokuStore implements IBlendokuStore {
  @observable game: Object
  @observable config: GameConfig
  @observable blocks
  @observable riddleFrames
  @observable actionCount:number = 0

  constructor() {
    this.game = {}
    this.config = {
      boardUSize: {
        w: 15,
        h: 15
      },
      unitLen: 40,
      stageHeight: 4,
      frameColor: 'rgba(255,255,255, 0.8)'
    }
    this.blocks = []
    this.riddleFrames = []
  }

  @action
  public addBlocks(payload:any) {
    // console.log('addBlocks', arguments);
    util.replaceArray(this.blocks, payload.blocks)
    // payload.blocks.map(blk => this.blocks.push(blk))
  }
  @action
  public addRiddleFrames(payload:any) {
    // console.log('addRiddleFrames', payload);
    util.replaceArray(this.riddleFrames, payload.riddleFrames)
  }

  @action
  public dragBlockTo(payload:any) {
    // console.log('DRAG_BLOCK_TO', state, payload);
    let {from, to} = payload
    let {uid} = payload.sender
    let {game} = globals
    let fBlock = game.getBlockByCoord(from.coord)
    let tBlock = game.getBlockByCoord(to.coord)
    let deferInfo:any = {}
    // console.log('fBlock', fBlock);
    if (tBlock && fBlock) {
      let fColor = clone(fBlock.color)
      let tColor = clone(tBlock.color)
      assign(tBlock.color, fColor)
      assign(fBlock.color, tColor)
      deferInfo.shouldRewind = true
      // let tCoord = clone(to.coord)
      // let fCoord = clone(from.coord)
      // assign(fBlock.coord, tCoord)
      // assign(tBlock.coord, fCoord)
    } else {
      if (!fBlock) {
        console.log('no fBlock from', from.coord);
      } else {
        assign(fBlock.coord, clone(to.coord))
      }
    }
    payload.defer.resolve(deferInfo)
    this.actionCount++
  }

  public serialize(): IBlendokuStore {
    return JSON.parse(JSON.stringify(this))
  }

  @action
  public clearData() {
    util.clearArray(this.blocks)
    util.clearArray(this.riddleFrames)
    this.actionCount = 0
  }
}

const store = new BlendokuStore

// const ar = autorun(
//   () => console.log(store.blocks.length),
//   () => {
//     console.log('blocks length changed', arguments);
//
//   }
// )

export default store
