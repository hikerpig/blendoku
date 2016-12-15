import Game, {ColorBlock} from './game'
import Board from '../vunits/board'
import DEBUG_TOOLS from './debug'

/**
 * @class Blendoku
 * 连接视图和游戏逻辑的game director
 */
export class Blendoku {
  public game: Game
  public board: Board
  constructor() {
    this.game = new Game()
    var board = new Board()
    this.board = board
    this.resizeToFit()
  }

  public start(): Blendoku {
    let blocks = DEBUG_TOOLS.getInitialBlocks()
    // console.log("blocks", blocks)
    // TODO： 建立视图对于game store data的监听
    this.game.loadData({
      blocks: blocks
    })
    return this
  }

  /**
   * 根据视窗大小调整
   * @method resizeToFit
   */
  public resizeToFit() {
    let bodyRect = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.board.draw()
    this.board.setSize({width: bodyRect.width, height: bodyRect.height})
  }
}
