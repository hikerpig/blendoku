/// <reference path="../../../typings/custom/snapsvg-cjs/index.d.ts" />
import * as SnapSvg from 'snapsvg-cjs'
import {assign} from 'lodash'


// interface VunitCoord {
//   gx: Number,
//   gy: Number,
//   gw: Number,
//   gh: Number,
// }

export class VunitCoord {
  gx: Number = 0
  gy: Number = 0
  gw: Number = 1
  gh: Number = 1

  constructor(options:any={}) {
    this.gx = options.gx || 0
    this.gy = options.gy || 0
    this.gw = options.gw || 1
    this.gh = options.gh || 1
  }
}


interface VunitSize {
  width?: Number,
  height?: Number
}

interface VunitOptions extends Object {
  coord?: VunitCoord,
  size?: VunitSize
}

// export VunitCoord
// export interface VunitOptions

export default class Vunit {
  public sele: Snap.Element
  static Snap = SnapSvg
  public coord: VunitCoord
  public size: VunitSize
  public unitLen: Number = 40

  constructor(options: VunitOptions={}) {
    this.coord = options.coord || new VunitCoord()
  }

  public draw () {}
  public refresh() {}
  public formEle() {}
  public getSnap(): Paper {
    return SnapSvg()
  }

  public setSize(size: VunitSize) {
    if (!this.size) this.size = {}
    if (!this.sele) {
      return
    }
    assign(this.size, size)
    this.sele.attr({width: this.size.width, height: this.size.height})
  }
}
