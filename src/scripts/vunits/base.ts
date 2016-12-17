/// <reference path="../../../typings/custom/snapsvg-cjs/index.d.ts" />
import * as SnapSvg from 'snapsvg-cjs'
import {assign} from 'lodash'

export class VunitCoord {
  gx: number = 0
  gy: number = 0
  gw: number = 1
  gh: number = 1

  constructor(options:any={}) {
    this.gx = options.gx || 0
    this.gy = options.gy || 0
    this.gw = options.gw || 1
    this.gh = options.gh || 1
  }

  static isSameStart(a: VunitCoord, b:VunitCoord):boolean {
    return (a.gx === b.gx) && (a.gy === b.gy)
  }
}

export interface VunitSize {
  width?: number,
  height?: number
}

export interface VunitOptions {
  coord?: VunitCoord,
  size?: VunitSize,
  paper?: Paper
}

export default class Vunit {
  public sele: Snap.Element | void
  static Snap = SnapSvg
  public coord: VunitCoord
  public size: VunitSize
  public unitLen: number = 40
  public paper: Paper

  constructor(options: VunitOptions={}) {
    this.coord = options.coord || new VunitCoord()
    this.paper = options.paper
  }

  public draw () {
    if (!this.sele) {
      let sele = this.formEle()
      this.sele = sele
    }
    this.redraw()
  }
  public redraw() {}
  public formEle(): Snap.Element | void {return null}
  public getSnap(): Paper {
    if (!this.paper) {
      this.paper = SnapSvg()
    }
    return this.paper
  }

  public setSize(size: VunitSize) {
    if (!this.size) this.size = {}
    if (!this.sele) {
      return
    }
    assign(this.size, size)
    // console.log('assign size', this.size)
    this.sele.attr({width: this.size.width, height: this.size.height})
  }
}
