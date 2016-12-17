/// <reference path="../../../typings/custom/snapsvg-cjs/index.d.ts" />
import * as SnapSvg from 'snapsvg-cjs'
import {assign, uniqueId} from 'lodash'
import store from 'scripts/stores/store'
import * as getters from '../blendoku/getters'

export interface IVunitCoord {
  gx: number
  gy: number
  gw?: number
  gh?: number
}

export interface IEleCoord {
  x: number
  y: number
  width?: number
  height?: number
}

export class VunitCoord implements IVunitCoord{
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
  public sele: Snap.Element
  static Snap = SnapSvg
  public coord: VunitCoord
  public uid: string
  public size: VunitSize
  public get unitLen() {
    return getters.unitLen(store.state)
  }
  public paper: Paper
  public vue: Object
  protected _state: any

  constructor(options: VunitOptions={}) {
    this.uid = uniqueId()
    this.coord = options.coord || new VunitCoord()
    this.paper = options.paper
    this._state = {}
  }

  public draw () {
    if (!this.sele) {
      let sele = this.formEle()
      this.sele = sele
      this.bindSeleEvents()
    }
    this.redraw()
  }
  public redraw() {}
  public formEle(): Snap.Element {return null}
  public bindSeleEvents():void {}
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

  public dispatch() {
    store.commit.apply(store, arguments)
  }

  public refreshBy(args: Object):Vunit {
    return this
  }
}

export function getSeleCoord(sele: Snap.Element): Object {
  return {x: sele.attr('x')>>0, y: sele.attr('y')>>0}
}

export function alignToVcoord(c: IEleCoord):IVunitCoord {
  let unitLen = getters.unitLen(store.state)
  return {
    gx: (c.x / unitLen) >> 0,
    gy: (c.y / unitLen) >> 0,
  }
}
