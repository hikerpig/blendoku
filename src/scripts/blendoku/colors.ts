import VunitCoord from '../vunits/base'
import {reduce, range, clone} from 'lodash'

export interface HSLColor {
  h?: number,
  s?: number,
  l?: number
}

export function makeHsl(h: number, s: number, l:number): HSLColor {
  return {h, s, l}
}

export function hslToHex(): String {
  return ''
}

export interface ColorRange {
  start: HSLColor,
  end: HSLColor
}

export function makeColorRange(sa: number[], ea: number[]): ColorRange {
  return {
    start: makeHsl.apply(null, sa),
    end: makeHsl.apply(null, ea),
  }
}

export function makeColorStops(cr: ColorRange, split: number = 0):Array<HSLColor> {
  let sc = cr.start
  let ec = cr.end
  split = Math.max(0,  split)
  let out = [clone(sc)]
  if (split) {
    let gaps = split + 1
    let cdiffs:HSLColor = {}, csteps:HSLColor = {}
    // TODO: 太蠢了... 怎么做才能更概括呢...
    cdiffs.h = ec.h - sc.h
    cdiffs.s = ec.s - sc.s
    cdiffs.l = ec.l - sc.l
    csteps.h = cdiffs.h / gaps
    csteps.s = cdiffs.s / gaps
    csteps.l = cdiffs.l / gaps
    range(1, gaps).map(function (st) {
      let c: HSLColor = {
        h: Math.round(sc.h + (st * csteps.h)),
        s: Math.round(sc.s + (st * csteps.s)),
        l: Math.round(sc.l + (st * csteps.l)),
      }
      out.push(c)
    })
  }
  out.push(clone(ec))
  return out
}
