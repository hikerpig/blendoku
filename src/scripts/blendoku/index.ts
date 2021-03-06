import Game, {IColorBlock, IRiddleFrame, GameData} from './game'
import {IBlendokuStore, BlendokuStore} from './store'
import Vunit, {IVunitCoord} from '../vunits/base'
import VBoard from '../vunits/board'
import VBlock from '../vunits/block'
import VFrame from '../vunits/frame'
import DEBUG_TOOLS from './debug'
import * as SnapSvg from 'snapsvg-cjs'
import globals from 'scripts/globals'
import * as util from 'scripts/utils/util'
import {reaction, autorun} from 'mobx'
import RiddleFactory from 'scripts/blendoku/riddle-factory'

/**
 * @class Blendoku
 * 连接视图和游戏逻辑的game director
 */
export class Blendoku {
  public game: Game
  public board: VBoard
  /**
   * VBlock list
   */
  public blocks: Array<VBlock> = []
  public frames: Array<VFrame> = []
  public store: any
  public boardSize: IVunitCoord
  /**
   * A snap.svg paper that all child elements come from and be drawn to
   */
  public paper: Paper
  constructor(options: any) {
    this.store = options.store
    Vunit.groupMap = new Map

    const store = this.getStore()
    this.game = new Game({
      data: store,
      config: store.config,
    })
    globals.game = this.game
    let paper = SnapSvg()
    paper.attr('version', '2.0') // svg 2.0
    let sc = SnapSvg('#main-svg')
    sc.append(paper)
    this.paper = paper

    var board = new VBoard({paper})
    this.board = board
    this.resizeToFit()
    this.initStoreWatcher(this.store)
  }

  public start() {
    this.startByDebug()
  }

  public startByRiddleId(id) {
    const gameData = RiddleFactory.getInstance().makeGame({
      id,
      boardSize: this.boardSize
    })
    this.startByRiddleFrames(gameData.riddleFrames)

    if (gameData.cues) {
      this.game.applyCues(gameData.cues)
    }
  }

  public startByDebug(){
    let blocks = DEBUG_TOOLS.getInitialBlocks(this.game.config)
    this._start({
      blocks
    })
    this.game.setRiddleByBlocks(blocks)
  }

  public startByRiddleFrames(riddleFrames: IRiddleFrame[]){
    const blocks = Game.generateBlocksByFrames(riddleFrames)
    this.game.stageBlocks(blocks, {boardSize: this.boardSize})
    // console.log('got blocks', blocks)
    this._start({blocks, riddleFrames})
  }

  protected _start(gameData: GameData): Blendoku {
    // let {blocks} = gameData
    // TODO: 如果有riddleFrames
    this.game.loadData(gameData)
    return this
  }

  // public stageBlocks(blocks: IColorBlock[]) {
  // }

  /**
   * 根据视窗大小调整
   * @method resizeToFit
   */
  public resizeToFit() {
    // const bRect = window.document.documentElement.getBoundingClientRect()
    let bodyRect = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.board.draw()
    this.board.setSize({width: bodyRect.width, height: bodyRect.height})
    this.boardSize = {
      gx: (bodyRect.width / this.store.config.unitLen) >> 0,
      gy: (bodyRect.height / this.store.config.unitLen) >> 0,
    }

    this.paper.attr({
      width: bodyRect.width,
      height: bodyRect.height,
    })
  }

  /**
   * Init VBlocks by blocks, will add to this.blocks
   * @method initBlocks
   * @param  {Array<IColorBlock>} blocks Blocks data
   */
  protected initBlocks(blocks: Array<IColorBlock>):void {
    this.game.blockMatrix.setBlocks(blocks)
    var noop = function(){}
    let {game} = this

    // console.log('init blocks', blocks, blocks.length);
    blocks.forEach((block) => {
      let vBlock = new VBlock({
        paper: this.paper,
        // color: block.color,
        coord: block.coord,
        colorBlock: block,
      })
      vBlock.draw()
      this.blocks.push(vBlock)

      // console.log('new block', block.coord, block.color);
    })
  }

  protected initRiddleFrames(riddleFrames:any[]) {
    // console.log('initRiddleFrames')
    riddleFrames.forEach((rf) => {
      let vf = new VFrame({
        paper: this.paper,
        coord: rf.coord
      })
      vf.draw()
      this.frames.push(vf)
      // console.log('new block', block.coord, block.color);
    })
  }
  protected initStoreWatcher(store: any):void {
    reaction(
      util.makeGetter(store, 'actionCount'),
      () => {
        const { completed } = this.game.checkGame()
        if (completed) {
          this.toggleWinModal(true)
        }
      }
    )
    reaction(
      util.makeGetter(store, 'blocks.length'),
      () => {
        // console.log('blocks length changed');
        let blocks  = store.blocks
        // console.log('got blocks', blocks.toJSON());
        this.initBlocks(blocks)
      },
      true
    )
    reaction(
      util.makeGetter(store, 'riddleFrames.length'),
      () => {
        this.initRiddleFrames(store.riddleFrames)
      },
      true
    )
  }

  getStore(): BlendokuStore {
    return this.store
  }

  public saveGame(): Promise<Object> {
    return new Promise((resolve, reject) => {
      let storeData = this.game.serialize()
      localStorage.setItem('gameData', JSON.stringify(storeData))
      resolve({})
    })
  }

  private applyGameData(gameData: IBlendokuStore): Blendoku {
    let storeData = Game.toObservables(gameData)
    // console.log('got storeData', storeData)
    return this._start(storeData)
  }

  private loadGameData(): Promise<IBlendokuStore> {
    return new Promise((resolve, reject) => {
      let gameData
      try {
        gameData = JSON.parse(localStorage.getItem('gameData'))
        // console.log('gameData', gameData)
        resolve(gameData)
      } catch (err) {
      }
    })
  }
  public restartByCache() {
    this.clear()
    this.loadGameData()
      .then((gameData) => {
        this.applyGameData(gameData)
      })
  }
  public clear() {
    this.store.clearData()
    this.blocks.map((vblk) => { vblk.dispose() })
    this.frames.map((vf) => { vf.dispose() })
  }

  // 额外的视图
  toggleWinModal(show: boolean) {
    const modal = document.querySelector('.win-modal')
    if (modal) {
      modal.classList[show ? 'add': 'remove']('in')
    }
  }
}
