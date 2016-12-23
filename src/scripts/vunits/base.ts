/// <reference path="../../../typings/custom/snapsvg-cjs/index.d.ts" />
import * as SnapSvg from 'snapsvg-cjs'
import {assign, uniqueId} from 'lodash'
import store from 'scripts/stores/store'
import * as getters from '../blendoku/getters'
import {observable, reaction, computed} from 'mobx'
import util from 'scripts/utils/util'

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
  @observable gx: number = 0
  @observable gy: number = 0
  @observable gw: number = 1
  @observable gh: number = 1

  constructor(options:any={}) {
    this.gx = options.gx || 0
    this.gy = options.gy || 0
    this.gw = options.gw || 1
    this.gh = options.gh || 1
  }

  @computed get posSig() {
    let xp = Math.pow(this.gx, 2)
    let yp = Math.pow(this.gy, 2)
    return xp*xp - yp*yp
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
    return getters.unitLen(store)
  }
  public paper: Paper
  public vue: Object
  protected _state: any

  constructor(options: VunitOptions={}) {
    this.uid = uniqueId()
    this.coord = options.coord || new VunitCoord()
    this.paper = options.paper
    this._state = {}
    this.initReactions()
  }

  public initReactions():void {
    this.makeReaction('coord.posSig', 'coord')
  }

  protected makeReaction(p:string|Function, rPath: string) {
    let getFn
    getFn = p
    if (typeof getFn === 'function') {
      getFn = function() {return util.getVal(this, p)}
    }
    return reaction(
      getFn,
      () => {
        // console.log('posSig changed');
        this.refreshBy({path: rPath})
      },
    )
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
    console.log('dispatch', arguments);

    // store.commit.apply(store, arguments)
  }

  public refreshBy(args: Object):Vunit {
    return this
  }
}

export function getSeleCoord(sele: Snap.Element): Object {
  return {x: sele.attr('x')>>0, y: sele.attr('y')>>0}
}

export function alignToVcoord(c: IEleCoord):IVunitCoord {
  let unitLen = getters.unitLen(store)
  return {
    gx: (c.x / unitLen) >> 0,
    gy: (c.y / unitLen) >> 0,
  }
}
