import Vunit, {VunitCoord} from '../vunits/base'
import store from '../stores/store'
import mts from './mutation-types'
import * as COLORS from './colors'
import {ColorRange} from './colors'


export interface ColorBlock {
  // color: HSLColor,
  color: Object,
  coord?: VunitCoord
}

export interface GameData {
  blocks?: ColorBlock[]
}

/**
 * @class Game
 * 处理游戏逻辑
 */
export default class Game {
  public loadData(d: GameData) {
    // store.dispatch('ADD_BLOCKS', d.blocks)
  }
  static generateBlocks(rangeList: any[]): ColorBlock[] {
    let blocks: Array<ColorBlock> = []
    rangeList.map((gbOpt:any) => {
      let [cr, split] = gbOpt
      COLORS.makeColorStops(cr, split).map(function (stopColor) {
        let block = {color: stopColor}
        blocks.push(block)
      })
    })
    return blocks
  }
}
