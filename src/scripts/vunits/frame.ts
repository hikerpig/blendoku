import Vunit, { getSeleCoord } from "./base"
import store from "scripts/stores/store"
// import {observable, reaction} from 'mobx'

export default class Frame extends Vunit {
  public formEle(): Snap.Element {
    let s = this.getGroup("frame")
    let rect = s.rect(0, 0, 0, 0).addClass("vu-frame")
    return rect
  }
  public redraw() {
    this._rePosition()
  }

  protected _rePosition() {
    // console.log('frame _rePosition', this.uid);
    let rect = this.sele as Snap.Element
    let sw = this.blockStrokeWidth
    let c = this.coord
    let vCoord = {
      x: c.gx * this.unitLen,
      y: c.gy * this.unitLen,
      width: this.unitLen,
      height: this.unitLen,
    }
    rect
      .attr(vCoord)
      .attr({
        stroke: store.config.frameColor,
        strokeWidth: sw,
        rx: this.blockRadius,
        fill: "transparent"
      })
  }
}
