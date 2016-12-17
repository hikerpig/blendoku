import Vunit from './base'

export default class Board extends Vunit {
  public formEle(): Snap.Element {
    let s = this.getSnap()
    let size = this.size || {width: 100, height: 100}
    let rect = s.rect(0, 0, size.width, size.height)
    return rect
  }
}
