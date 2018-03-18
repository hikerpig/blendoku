import {riddles} from 'data/riddles'
import {
  makeColorRange,
  makeColorStops,
  makeHsl,
  CSSHslString,
  HSLColor,
} from './colors'
import Game, {IColorBlock, DIRECTIONS, GameConfig, IRiddleFrame} from './game'
import Vunit, {VunitCoord, IVunitCoord} from '../vunits/base'
import {
  assign,
  reduce,
} from 'lodash'
import store from 'scripts/stores/store'

interface IRiddlePoint {
  pos: number[],
  color: number[] | CSSHslString
}

interface IFrameDef {
  from : IRiddlePoint,
  direction?: string,
  to: any,
  split: number,
  // to : IRiddlePoint,
}

type FrameCuePos = number[]

interface IRiddleDef {
  frames: IFrameDef[]
  cuePosList: FrameCuePos[]
  // frames: {[key: string]: any}
  // frames: {[key: string]: IRiddleDef}
}

export default class RiddleFactory {
  static instance: RiddleFactory
  static getInstance() {
    if (!RiddleFactory.instance) {
      RiddleFactory.instance = new RiddleFactory
    }
    return RiddleFactory.instance
  }
  static test() {
    // this.getInstance()
    console.log('riddles from data', riddles)
    return RiddleFactory.makeGameData(riddles[0], {gx: 10, gy: 15})
  }

  static makeGameData(rd: IRiddleDef, bs: IVunitCoord) {
    // console.log('rd', rd, 'boardSize', bs)
    let riddleFrames = []
    const cues = []
    let cueMap = {}
    if (rd.cuePosList) {
      cueMap = reduce(rd.cuePosList, (m, [r, c]) => {
        if (!m[r]) {
          m[r] = []
        }
        m[r].push(c)
        return m
      }, {})
    }
    rd.frames.map((fr, i) => {
      // console.log('stageHeight', store.config.stageHeight)
      let sh = store.config.stageHeight
      let cr = makeColorRange(fr.from.color, fr.to.color)
      let fromPos = fr.from.pos
      let fsCoord = new VunitCoord({gx: fromPos[0], gy: fromPos[1] + sh})
      // 根据 from.pos 和 direct 生成 coords
      fr.direction = fr.direction || 'Right'
      let coords = Game.makeCoords(fsCoord, fr.direction, fr.split + 2)
      const rfs = makeColorStops(cr, fr.split).map((stopColor, i) => {
        // console.log('stopColor', stopColor)
        const riddleFrame: IRiddleFrame = {
          coord: coords[i],
          color: stopColor,
        }
        return riddleFrame
      })
      riddleFrames = riddleFrames.concat(rfs)

      if (cueMap[i]) {
        cueMap[i].map((pos, j) => {
          if (rfs[pos]) {
            cues.push(riddleFrames.indexOf(rfs[pos]))
          }
        })
      }
    })
    // console.log('riddleFrames', riddleFrames, cues)
    return {riddleFrames, cues}
  }

  public makeGame(mgOptions: any) {
    let riddle = riddles[mgOptions.id]
    return RiddleFactory.makeGameData(riddle, mgOptions.boardSize)
  }
}
