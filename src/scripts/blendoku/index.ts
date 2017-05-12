import Game, {IColorBlock, GameData} from './game'
import {IBlendokuStore} from './store'
import Vunit from '../vunits/base'
import VBoard from '../vunits/board'
import VBlock from '../vunits/block'
import VFrame from '../vunits/frame'
import DEBUG_TOOLS from './debug'
import * as getters from '../blendoku/getters'
import * as SnapSvg from 'snapsvg-cjs'
import globals from 'scripts/globals'
import * as util from 'scripts/utils/util'
import * as Vue from 'vue'
import {reaction, autorun} from 'mobx'

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
  /**
   * A snap.svg paper that all child elements come from and be drawn to
   */
  public paper: Paper
  constructor(options: any) {
    this.store = options.store
    Vunit.groupMap = new Map

    this.game = new Game({
      data: getters.data(this.getStore()),
      config: getters.config(this.getStore())
      // data: getters.data(this.getStore().state),
      // config: getters.config(this.getStore().state)
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

  public start(): Blendoku {
    let blocks = DEBUG_TOOLS.getInitialBlocks(this.game.config)
    this._start({
      blocks
    })
    this.game.setRiddleByBlocks(blocks)
    return this
  }

  protected _start(gameData: GameData): Blendoku {
    // let {blocks} = gameData
    // TODO: 如果有riddleFrames
    this.game.loadData(gameData)
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
        color: block.color,
        coord: block.coord
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
      () => { this.game.checkGame()}
    )
    reaction(
      util.makeGetter(store, 'blocks.length'),
      () => {
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

  getStore(): any {
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
}
