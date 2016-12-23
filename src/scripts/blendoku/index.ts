import Game, {IColorBlock} from './game'
import VBoard from '../vunits/board'
import VBlock from '../vunits/block'
import DEBUG_TOOLS from './debug'
import * as getters from '../blendoku/getters'
import * as SnapSvg from 'snapsvg-cjs'
import globals from 'scripts/globals'
import * as Vue from 'vue'
import DataVue from '../watcher-vues/data-vue'
import BlockVue from '../watcher-vues/block-vue'
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
  public store: any
  /**
   * A snap.svg paper that all child elements come from and be drawn to
   */
  public paper: Paper
  constructor(options: any) {
    this.store = options.store
    console.log(this.store);

    this.game = new Game({
      data: getters.data(this.getStore()),
      config: getters.config(this.getStore())
      // data: getters.data(this.getStore().state),
      // config: getters.config(this.getStore().state)
    })
    globals.game = this.game
    let paper = SnapSvg()
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

      // let dv = new BlockVue({
      //   propsData: {
      //     data: block
      //   }
      // })
      // vBlock.vue = dv
      // dv.$on('update', (payload) => {
      //   console.log('on update', payload);
      //   game.updateBlock(payload)
      //   vBlock.refreshBy(payload)
      // })
    })
  }

  protected initStoreWatcher(store: any):void {
    reaction(
      () => {return store.blocks.length},
      () => {
        let blocks  = store.blocks
        console.log('got blocks', blocks.toJSON());
        this.initBlocks(blocks)
      },
      true
    )
  }

  getStore(): any {
    return this.store
  }
}
