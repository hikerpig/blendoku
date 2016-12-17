import Vunit, {VunitCoord} from '../vunits/base'
import store from '../stores/store'
import mts from './mutation-types'
import * as COLORS from './colors'
import {range} from 'lodash'
import {ColorRange, HSLColor} from './colors'

export const DIRECTIONS = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
}
export function randomDirection ():string {
  let keys:Array<string> = Object.keys(DIRECTIONS)
  let s:number = Math.floor(Math.random() * keys.length)
  return keys[s]
}

// export function enumRandom<T>(e: T) {
//   let keys:Array<string> = Object.keys(e)
//   return e[Math.floor((Math.random() * length))]
// }

export const DIRECT_DIFFS = {
  [DIRECTIONS.Up]: [0, -1],
  [DIRECTIONS.Down]: [0, 1],
  [DIRECTIONS.Left]: [-1, 0],
  [DIRECTIONS.Right]: [1, 0],
}

export interface ColorBlock {
  color: HSLColor,
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
  public data: GameData
  constructor() {
    this.data = {
      blocks: []
    }
  }
  public loadData(d: GameData) {
    this.data.blocks.concat(d.blocks)
    store.commit('ADD_BLOCKS', {blocks: d.blocks })
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
  static makeCoords(start: VunitCoord, direc:string, count:number=1):Array<VunitCoord> {
    let diffs = DIRECT_DIFFS[direc]
    return range(count).map((v:number) => {
      return new VunitCoord({gx: start.gx + v*diffs[0], gy: start.gy + v*diffs[1]})
    })
  }
}
