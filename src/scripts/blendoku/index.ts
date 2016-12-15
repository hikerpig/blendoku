import Game from './game'
import Board from '../vunits/board'

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
    // TODO: dispatch
    let initData = {

    }
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
