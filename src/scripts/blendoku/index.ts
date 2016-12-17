import Game, {ColorBlock} from './game'
import VBoard from '../vunits/board'
import VBlock from '../vunits/block'
import DEBUG_TOOLS from './debug'
import * as getters from './getters'
import * as SnapSvg from 'snapsvg-cjs'

/**
 * @class Blendoku
 * 连接视图和游戏逻辑的game director
 */
export class Blendoku {
  public game: Game
  public board: VBoard
  public blocks: Array<VBlock> = []
  public store: any
  public paper: Paper
  constructor(options: any) {
    this.game = new Game()
    let paper = SnapSvg()
    this.paper = paper

    var board = new VBoard({paper})
    this.board = board
    this.resizeToFit()
    this.store = options.store
    this.initStoreWatcher(this.store)
  }

  public start(): Blendoku {
    let blocks = DEBUG_TOOLS.getInitialBlocks()
    console.log('initial blocks', blocks)
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

  protected initBlocks(blocks: Array<ColorBlock>):void {
    blocks.forEach((block) => {
      let vBlock = new VBlock({
        paper: this.paper,
        color: block.color,
        coord: block.coord
      })
      vBlock.draw()
      this.blocks.push(vBlock)
    })
  }

  protected initStoreWatcher(store: any):void {
    store.watch(getters.blocks, (blocks:Array<ColorBlock>) => {
      this.initBlocks(blocks)
    })
  }
}
