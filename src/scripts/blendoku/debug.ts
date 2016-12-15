import * as COLORS from './colors'
import Game, {ColorBlock} from './game'
import Vunit, {VunitCoord} from '../vunits/base'

const DEBUG_TOOLS = {
  getInitialBlocks(): Array<ColorBlock> {
    let blkOpts = [
      [COLORS.makeColorRange([ 1,1,1 ], [90, 90, 90]), 2]
    ]
    return Game.generateBlocks(blkOpts).map((blk) => {
      blk.coord = new VunitCoord({
        gx: 30 * Math.random() >> 0,
        gy: 20 * Math.random() >> 0
      })
      return blk
    })
  }

}
export default DEBUG_TOOLS
