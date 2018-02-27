import Vunit, {VunitCoord, IVunitCoord} from '../vunits/base'
import store from '../stores/store'
import{IBlendokuStore} from './store'
import * as COLORS from './colors'
import {range, uniqueId, find, last, pick, clone, assign, shuffle} from 'lodash'
import {ColorRange, HSLColor, IHSLColor} from './colors'
import {observable, reaction, action} from 'mobx'
import {makeGetter, shallowCopy} from 'scripts/utils/util'

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

export const DIRECT_DIFFS = {
  [DIRECTIONS.Up]: [0, -1],
  [DIRECTIONS.Down]: [0, 1],
  [DIRECTIONS.Left]: [-1, 0],
  [DIRECTIONS.Right]: [1, 0],
}

export interface IColorBlock {
  color: HSLColor,
  coord?: VunitCoord
  riddleFrame?: IRiddleFrame
}

export class ColorBlock implements IColorBlock {
  public uid: string
  @observable color: HSLColor
  @observable coord?: VunitCoord

  constructor() {
    this.uid = uniqueId()
    this.coord = new VunitCoord()
    this.color = new HSLColor()
  }
}

export interface IRiddleFrame {
  color?: IHSLColor,
  coord?: IVunitCoord
}

export interface BoardUSize {
  w: number
  h: number
}

export interface GameConfig {
  boardUSize: BoardUSize
  unitLen: number
  stageHeight: number
  frameColor: string
}

export interface GameData {
  blocks?: IColorBlock[]
  riddleFrames?: IRiddleFrame[]
  cues?: Array<number[]>
}

type tMaybeBlock = ColorBlock|void
type tMaybeUid = string|void

export class BlockMatrix {
  blocks: Array<ColorBlock>
  config: GameConfig
  // To store block uids in a 2D matrix, _matrix[i][j] represents row i and col j
  protected _matrix: Array<Array<tMaybeUid>>
  /**
   * Key 为 uid, value 为坐标数组
   */
  protected _posCache: Object
  constructor(options: any) {
    this.config = options.config
    this._posCache = {}
  }
  protected _buildMatrix(blocks) {
    this._matrix = range(this.config.boardUSize.h).map((i) => {
      return new Array(this.config.boardUSize.w)
    })
  }
  setBlocks(blocks) {
    this.blocks = blocks
    blocks.map((blk) => { this._bindBlockReactions(blk) })
    this._refreshMatrix()
  }
  private _bindBlockReactions(block) {
    reaction(
      () => {return block.coord.posSig},
      () => {
        let blk = last(arguments)
        this.moveTo(blk)
      },
    )
  }
  public moveTo(blk: ColorBlock) {
    let matchedPos = this._posCache[blk.uid]
    if (matchedPos) {
      this.set(matchedPos[0], matchedPos[1], null)
    }
    this.set(blk.coord.gx, blk.coord.gy, blk.uid)
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
    if (!this._matrix[row]) this._matrix[row] = []
    // console.log('set', row, col, 'to', uid);
    this._matrix[row][col] = uid
    if (uid) {
      this._posCache[uid] = [row, col]
    }
    return this
  }
  get(row:number, col:number): ColorBlock | void {
    if (!this._matrix) return
    if (!this._matrix[row]) this._matrix[row] = []
    let uid = this._matrix[row][col]
    if (uid) {
      return this.blocks.find((block)=> {return block.uid === uid})
    }
  }
  public visualize() {
    return this._matrix.map((rowObj=[])=> {
      // return rowObj.toString()
      // return rowObj.map((e) => {return e || 0}).toString()
      console.log(rowObj.map((e) => {return e || 0}).toString())
    })
  }
}



/**
 * @class Game
 * 处理游戏逻辑
 */
export default class Game {
  // public data: GameData
  @observable data: GameData
  config: GameConfig
  public blockMatrix: BlockMatrix
  private _riddleFrames:IRiddleFrame[]

  constructor(options:any) {
    this.data = options.data
    this.config = options.config
    this.blockMatrix = new BlockMatrix({
      config: this.config
    })
    this.blockMatrix.setBlocks(this.data.blocks)
  }
  public loadData(d: GameData) {
    console.log('loadData', d)
    store.addBlocks({blocks: d.blocks })
    if (d.riddleFrames) {
      store.addRiddleFrames(d)
    }
  }
  public getBlockByCoord(c: IVunitCoord) {
    return this.blockMatrix.get(c.gx, c.gy)
  }
  static generateBlocks(rangeList: any[]): IColorBlock[] {
    let blocks: Array<IColorBlock> = []
    rangeList.map((gbOpt:any) => {
      let [cr, split] = gbOpt
      COLORS.makeColorStops(cr, split).map(function (stopColor) {
        let block = new ColorBlock()
        block.color = stopColor
        blocks.push(block)
      })
    })
    return blocks
  }
  static generateBlocksByFrames(frames: IRiddleFrame[]): IColorBlock[] {
    let blocks = frames.map((fr) => {
      const block = new ColorBlock()
      assign(block, {
        color: new HSLColor(fr.color),
        coord: shallowCopy<IVunitCoord>(fr.coord, VunitCoord),
        riddleFrame: fr
      })
      return block
    })
    return blocks
  }
  static generateRiddleFrames(blocks: Array<IColorBlock>):IRiddleFrame[] {
    // console.log('generateRiddleFrames', blocks)
    let rFrames:IRiddleFrame[]
    rFrames = blocks.map((blk) => {
      return {
        coord: <IVunitCoord>pick(blk.coord, ['gx', 'gy']),
        color: blk.color.shallowCopy(),
      }
    })
    return rFrames
  }
  static makeCoords(start: VunitCoord, direc:string, count:number=1):Array<VunitCoord> {
    let diffs = DIRECT_DIFFS[direc]
    return range(count).map((v:number) => {
      return new VunitCoord({gx: start.gx + v*diffs[0], gy: start.gy + v*diffs[1]})
    })
  }
  public stageBlocks(blocks: IColorBlock[], opts: any): IColorBlock[] {
    let curY = 0
    let {boardSize} = opts
    let boardW = boardSize.gx
    if (!opts.noShuffle) {
      blocks = shuffle(blocks)
    }
    // 超出当前页面x bound以后换行
    return blocks.map((blk, i) => {
      let gx = i % boardW
      blk.coord.gx = gx
      blk.coord.gy = curY
      if (gx === boardW - 1) {
        curY++
      }
      return blk
    })
  }

  public setRiddleByBlocks(blocks: Array<IColorBlock>) {
    const riddleFrames = Game.generateRiddleFrames(blocks)
    // this._riddleFrames = riddleFrames
    store.addRiddleFrames({riddleFrames})
  }

  applyCues(cues: number[]) {
    cues.map((pos) => {
      const blk = this.data.blocks[pos]
      // console.log('block for cue', blk);
      if (blk && blk.riddleFrame) {
        const rf = blk.riddleFrame
        assign(blk.coord, rf.coord)
      }
    })
  }

  // public updateBlock(payload) {
  //   let {data, path} = payload
  //   // console.log('update block', path, data);
  //   switch (path) {
  //     case 'coord': {
  //       let {gx, gy} = data.coord
  //       // TODO: need to unset prev
  //       this.blockMatrix.set(gx, gy, data.uid)
  //     } break
  //   }
  // }
  private isRiddleSatisfied(rf):boolean {
    let block = this.blockMatrix.get(rf.coord.gx, rf.coord.gy)
    if (block) {
      let rc = rf.color
      let bc = block.color
      return (bc.h == rc.h) && (bc.s == rc.s) && (bc.l == rc.l)
    }
    return false
  }
  public checkGame() {
    let rfs = store.riddleFrames
    let completed = true
    rfs.forEach((rf) => {
      if (!this.isRiddleSatisfied(rf)) {
        completed = false
        return false
      }
    } )
    if (completed) {
      console.log('completed', completed)
    }
  }
  public serialize(): GameData {
    return store.serialize()
  }
  static toObservables(gameData: IBlendokuStore): IBlendokuStore {
    gameData.blocks = gameData.blocks.map((blk) => {
      let cb = new ColorBlock(),
        coord = cb.coord,
        c = cb.color
      assign(coord, blk.coord)
      assign(c, blk.color)
      return cb
    })
    gameData.riddleFrames = gameData.riddleFrames.map((rf) => {
      let frame: IRiddleFrame = {
        coord: rf.coord,
        color: rf.color
      }
      return frame
    })
    return gameData
  }
}
