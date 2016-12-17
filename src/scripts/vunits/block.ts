import Vunit, {VunitOptions} from './base'
import {HSLColor, hslToHex} from '../blendoku/colors'

interface VBlockOptions extends VunitOptions{
  color: HSLColor
}

export default class Block extends Vunit {
  public color: HSLColor
  constructor(options: VBlockOptions) {
    super(options)
    this.color = options.color
  }
  public formEle(): Snap.Element {
    let s = this.getSnap()
    let rect = s.rect(0, 0, 0, 0)
    if (this.color) {
      rect.attr({fill: hslToHex(this.color)})
    }
    return rect
  }
  public redraw() {
    let rect = <Snap.Element>this.sele
    let sw = 1
    let c = this.coord
    let vCoord = {x: c.gx * this.unitLen, y: c.gy * this.unitLen, width: this.unitLen-2*sw, height: this.unitLen-2*sw}
    rect
      .attr(vCoord)
      .attr({stroke: 'transparent', strokeWidth: sw})
      .addClass('vu-block')
  }
}
