import * as COLORS from './colors'
const {makeColorRange} = COLORS
import Game, {IColorBlock, DIRECTIONS, randomDirection, GameConfig} from './game'
import Vunit, {VunitCoord} from '../vunits/base'
import {some, assign} from 'lodash'

const DEBUG_TOOLS = {
  /**
   * 生成颜色块，目前是随机
   * @method getInitialBlocks
   * @return {Array<ColorBlock>}
   */
  getInitialBlocks(config: GameConfig): Array<IColorBlock> {
    // TODO: given colors, calc solution ?
    let blkOpts = [
      // [makeColorRange([ 1,1,1 ], [90, 90, 90]), 3],
      // [makeColorRange([ 100,1,1 ], [180, 90, 90]), 2],
      // [makeColorRange([ 100,10,30 ], [130, 100, 90]), 3],
      // [makeColorRange([ 200,10,30 ], [250, 50, 90]), 3],
      // [makeColorRange([ 250,10,30 ], [300, 50, 100]), 3],
      // [makeColorRange([ 80,20,30 ], [120, 60, 100]), 4],
      [makeColorRange([ 10,20,30 ], [100, 60, 80]), 3],
    ]
    let out:Array<IColorBlock> = []
    let curCoords:Array<VunitCoord> = []
    blkOpts.map((arr:any) => {
      let direc = randomDirection()
      // console.log('direc is', direc)
      let count = arr[arr.length - 1] + 2
      let coords = DEBUG_TOOLS.getValidCoords(count, curCoords, config)
      curCoords.concat(coords)
      Game.generateBlocks([arr]).map((blk, i) => {
        assign(blk.coord, coords[i])
        blk.coord = blk.coord
        out.push(blk)
      })
    })
    return out
  },
  /**
   * Make sure coords does not collide
   * @method getValidCoords
   * @param  {number}            count
   * @param  {Array<VunitCoord>} curCoords
   * @param  {string}            direc     One of DIRECTIONS
   * @return Array<VunitCoord>
   */
  getValidCoords(count:number, curCoords:Array<VunitCoord>, config, direc?:string):Array<VunitCoord> {
    let startCoord:VunitCoord
    if (!direc) {
      direc = randomDirection()
    }
    let maxRec = 90
    let _hasSameStart = function(coord:VunitCoord):boolean {
      return curCoords.some((c:VunitCoord) => {
        return VunitCoord.isSameStart(coord, c)
      })
    }
    let {w, h} = config.boardUSize
    while (true) {
      let valid = true
      startCoord = new VunitCoord({
        gx: 12 * Math.random() >> 0,
        gy: 15 * Math.random() >> 0
      })
      let coords = Game.makeCoords(startCoord, direc, count)
      for (let i = 0; i < coords.length; i++) {
        let coord = coords[i]
        // Avoid edge of the board
        if (
          ((coord.gx * coord.gy) < 0) ||
          ((coord.gx >= w) || (coord.gy >= h))
        ) {
          valid = false
          break
        }
        if (_hasSameStart(coord)) {
          valid = false
          break
        }
      }
      if (valid) {
        return coords
      }
      maxRec--
    }
  }

}
export default DEBUG_TOOLS
