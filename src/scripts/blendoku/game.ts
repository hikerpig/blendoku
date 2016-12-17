import Vunit, {VunitCoord, IVunitCoord} from '../vunits/base'
import store from '../stores/store'
import mts from './mutation-types'
import * as COLORS from './colors'
import {range, uniqueId, find} from 'lodash'
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

export interface IColorBlock {
  color: HSLColor,
  coord?: VunitCoord
}

export class ColorBlock implements IColorBlock {
  public uid: string
  color: HSLColor
  coord?: VunitCoord
  constructor() {
    this.uid = uniqueId()
  }
}

export interface BoardUSize {
  w: number
  h: number
}

export interface GameConfig {
  boardUSize: BoardUSize
  unitLen: number
}

export interface GameData {
  blocks?: IColorBlock[]
}

// export function maybeOf<arg: T>(){
//   type t = T|void
//   // return t
// }
// type MaybeBlock = maybeOf<ColorBlock>()

type tMaybeBlock = ColorBlock|void
type tMaybeUid = string|void

export class BlockMatrix {
  blocks: Array<ColorBlock>
  config: GameConfig
  // To store block uids in a 2D matrix, _matrix[i][j] represents row i and col j
  protected _matrix: Array<Array<tMaybeUid>>
  constructor(options: any) {
    this.config = options.config
  }
  protected _buildMatrix(blocks) {
    this._matrix = range(this.config.boardUSize.h).map((i) => {
      return new Array(this.config.boardUSize.w)
    })
  }
  setBlocks(blocks) {
    this.blocks = blocks
    this._refreshMatrix()
  }
  private _refreshMatrix() {
    this._buildMatrix(this.blocks)
    this.blocks.map((block: ColorBlock) => {
      this.set(block.coord.gx, block.coord.gy, block.uid)
    })
  }
  set(row, col, uid: ColorBlock | string):BlockMatrix {
    if (uid instanceof ColorBlock) {
      uid = uid.uid
    }
    if (!this._matrix[row]) return this
    this._matrix[row][col] = uid
    return this
  }
  get(row:number, col:number): ColorBlock | void {
    if (!this._matrix) return
    let uid = this._matrix[row][col]
    if (uid) {
      return this.blocks.find((block)=> {return block.uid === uid})
    }
  }
}

/**
 * @class Game
 * 处理游戏逻辑
 */
export default class Game {
  public data: GameData
  config: GameConfig
  public blockMatrix: BlockMatrix
  constructor(options:any) {
    this.data = options.data
    this.config = options.config
    this.blockMatrix = new BlockMatrix({
      config: this.config
    })
    this.blockMatrix.setBlocks(this.data.blocks)
  }
  public loadData(d: GameData) {
    store.commit('ADD_BLOCKS', {blocks: d.blocks })
  }
  public getBlockByCoord(c: IVunitCoord) {
    return this.blockMatrix.get(c.gx, c.gy)
  }
  static generateBlocks(rangeList: any[]): IColorBlock[] {
    let blocks: Array<IColorBlock> = []
    rangeList.map((gbOpt:any) => {
      let [cr, split] = gbOpt
      COLORS.makeColorStops(cr, split).map(function (stopColor) {
        // let block = {color: stopColor}
        let block = new ColorBlock()
        block.color = stopColor
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

  public updateBlock(payload) {
    let {data, path} = payload
    // console.log('update block', path, data);
    switch (path) {
      case 'coord': {
        let {gx, gy} = data.coord
        // TODO: need to unset prev
        this.blockMatrix.set(gx, gy, data.uid)
      } break
    }
  }
}
