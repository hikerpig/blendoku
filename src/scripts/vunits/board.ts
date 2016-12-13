import Vunit from './base'

export default class Board extends Vunit {
  public draw () {
    if (!this.sele) {
      let sele = this.formEle()
      console.log('draw board', sele)
      this.sele = sele
    } else {
      this.refresh()
    }
  }
  public formEle(): Snap.Element {
    let s = this.getSnap()
    let rect = s.rect(0, 0, 300, 300)
    return rect
  }
}
