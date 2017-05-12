import {riddles} from 'data/riddles'
import {
  makeColorRange,
  makeColorStops,
  makeHsl
} from './colors'
import Game, {IColorBlock, DIRECTIONS, GameConfig, IRiddleFrame} from './game'
import Vunit, {VunitCoord, IVunitCoord} from '../vunits/base'
import {
  assign
} from 'lodash'
import store from 'scripts/stores/store'

interface IRiddlePoint {
  pos: number[],
  color: number[]
}

interface IFrameDef {
  from : IRiddlePoint,
  direction: string,
  to: any,
  split: number,
  // to : IRiddlePoint,
}

interface IRiddleDef {
  frames: IFrameDef[]
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
    return RiddleFactory.makeGameData(riddles[0])
  }

  static makeGameData(rd: IRiddleDef) {
    // console.log('rd', rd)
    let riddleFrames = []
    rd.frames.map((fr) => {
      // console.log('stageHeight', store.config.stageHeight)
      let sh = store.config.stageHeight
      let cr = makeColorRange(fr.from.color, fr.to.color)
      let fromPos = fr.from.pos
      let fsCoord = new VunitCoord({gx: fromPos[0], gy: fromPos[1] + sh})
      // 根据 from.pos 和 direct 生成 coords
      let coords = Game.makeCoords(fsCoord, fr.direction, fr.split + 2)
      return makeColorStops(cr, fr.split).map((stopColor, i) => {
        // console.log('stopColor', stopColor)
        let riddleFrame: IRiddleFrame = {
          coord: coords[i],
          color: stopColor,
        }
        riddleFrames.push(riddleFrame)
      })
    })
    // console.log('riddleFrames', riddleFrames)
    return {riddleFrames}
  }
}