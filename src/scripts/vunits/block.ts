import Vunit, { VunitOptions, getSeleCoord, alignToVcoord } from "./base"
import { HSLColor, hslToHex } from "../blendoku/colors"
import { assign, clone } from "lodash"
import { observable, reaction } from "mobx"

interface VBlockOptions extends VunitOptions {
  color: HSLColor
}

interface BlockVState {
  dragging: boolean
  dragStartCoord: any
  startMouseOffset: any
}

const BLOCK_DRAGGING_CLASS = "vu-block--dragging"
// const BLOCK_ZINDEX_NORMAL = 100
// const BLOCK_ZINDEX_DRAGGING = 400

export default class Block extends Vunit {
  @observable public color: HSLColor
  protected _state: BlockVState
  protected _refreshPathMap: Object
  static refreshPathMap = {
    coord: "_rePosition",
    color: "_rePaint"
  }
  constructor(options: VBlockOptions) {
    super(options)
    this.color = options.color
    this._refreshPathMap = clone(Block.refreshPathMap)
  }
  public formEle(): Snap.Element {
    let s = this.getGroup("block")
    let rect = s.rect(0, 0, 0, 0).addClass("vu-block")
    rect.attr({ uid: this.uid })
    return rect
  }
  public redraw() {
    this._rePosition()
    this._rePaint()
  }
  public initReactions(): void {
    Vunit.prototype.initReactions.apply(this, arguments)
    this.makeReaction("color.hex", "color")
  }
  protected _rePosition() {
    // console.log('block _rePosition', this.uid);
    let rect = <Snap.Element>this.sele
    let sw = this.blockStrokeWidth
    let c = this.coord
    let vCoord = {
      x: c.gx * this.unitLen,
      y: c.gy * this.unitLen,
      // width: this.unitLen - 2 * sw,
      // height: this.unitLen - 2 * sw
      width: this.unitLen,
      height: this.unitLen
    }
    rect.attr(vCoord).attr({
      stroke: "transparent",
      strokeWidth: sw,
      rx: this.blockRadius,
    })
  }
  protected _rePaint() {
    let rect = <Snap.Element>this.sele
    var cStr: String = "transparent"
    if (this.color) {
      cStr = hslToHex(this.color)
    }
    rect.attr({ fill: cStr })
  }

  static redrawKeys = ["coord", "color"]
  refreshBy(payload: any) {
    // console.log('refreshBy', payload.path)
    let { data, path } = payload
    let method: Function = this[this._refreshPathMap[path]]
    if (method) {
      method.apply(this, payload)
    }
    // if (Block.redrawKeys.indexOf(path) > -1) {
    //   // console.log('block coord update', data.coord);
    //   this.redraw()
    // }
    return this
  }

  /**
   * 处理svg元素的交互, 理想情况下在交互过程中只改变local state, 结束以后再更新store
   */
  public bindSeleEvents() {
    var me = this
    let onmove = function(dx, dy, x, y, e) {
      // console.log('onmove', arguments);
      // console.log('onmove', e.offsetY, e.offsetY);
      let dco = me._state.startMouseOffset
      this.attr({ x: e.offsetX - dco.x, y: e.offsetY - dco.y })
      // let w = this.attr('width') >> 0
      // let h = this.attr('height') >> 0
      // this.attr({x: e.offsetX - w / 2, y: e.offsetY - h / 2})
    }
    let onstart = function(x, y, e) {
      // console.log('onstart', arguments);
      let dsc = getSeleCoord(this)
      let startMouseOffset = {
        x: x - me.coord.gx * me.unitLen,
        y: y - me.coord.gy * me.unitLen
      }
      me.sele.addClass(BLOCK_DRAGGING_CLASS)

      // 确保正在 dragging 的元素一定在最上层
      const parent = me.sele.parent()
      parent.append(me.sele)

      // me.sele.attr({'z-index': BLOCK_ZINDEX_DRAGGING})
      assign(me._state, {
        dragging: true,
        dragStartCoord: dsc,
        startMouseOffset
      })
    }
    let onend = function(e) {
      // console.log('onend', arguments);
      let dsc = me._state.dragStartCoord
      let dragEndCoord = getSeleCoord(this)
      dragEndCoord.x += me._state.startMouseOffset.x
      dragEndCoord.y += me._state.startMouseOffset.y
      assign(me._state, {
        dragging: false,
        dragStartCoord: null,
        startMouseOffset: null
      })
      new Promise((resolve, reject) => {
        const fromCoord = alignToVcoord(dsc)
        const toCoord = alignToVcoord(dragEndCoord)

        me.store.dragBlockTo({
          sender: me,
          from: {
            eleCoord: dsc,
            coord: fromCoord,
          },
          to: {
            eleCoord: dragEndCoord,
            coord: toCoord,
          },
          defer: { resolve, reject }
        })
      }).then((info: any = {}) => {
        if (info.shouldRewind) {
          this.attr(dsc)
        }
        me.sele.removeClass(BLOCK_DRAGGING_CLASS)
        // me.sele.attr({'z-index': BLOCK_ZINDEX_NORMAL})
      })
    }
    this.sele.drag(onmove, onstart, onend)
  }
}
