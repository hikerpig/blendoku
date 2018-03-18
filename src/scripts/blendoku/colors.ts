import VunitCoord from '../vunits/base'
import {reduce, range, clone, pick} from 'lodash'
import {observable, computed} from 'mobx'

export type CSSHslString = string

export interface IHSLColor {
  h?: number,
  s?: number,
  l?: number
}
export class HSLColor implements IHSLColor {
  @observable h?: number
  @observable s?: number
  @observable l?: number
  @computed get hex():string { return hslToHex(this) }
  constructor(c?: IHSLColor) {
    if (c) {
      this.h = c.h
      this.s = c.s
      this.l = c.l
    }
  }
  static fromCssHslString(str: CSSHslString) {
    const colorStr = /hsl\((.*)\)/i.exec(str)[1]
    if (!colorStr) return null
    const pcs = colorStr.split(',').map(s => parseInt(s))
    return new HSLColor({
      h: pcs[0],
      s: pcs[1],
      l: pcs[2]
    })
  }

  public shallowCopy():IHSLColor {
    return pick(this, ['h', 's', 'l'])
  }
}

export interface RGBColor {
  r?: number,
  g?: number,
  b?: number
}

export function makeHsl(h: number, s: number, l:number): HSLColor {
  let hsl = new HSLColor
  hsl.h = h
  hsl.s = s
  hsl.l = l
  return hsl
}

type ColorDesc = number[] | CSSHslString

function parseToHsl(input: ColorDesc): HSLColor {
  let output: HSLColor
  if (typeof input === 'string') {
    output = HSLColor.fromCssHslString(input)
  } else {
    output = makeHsl.apply(null, input)
  }
  console.log('output color', output);

  return output
}

export function hslToHex(c: HSLColor): string {
  return rgbToHex(hslToRgb(c))
}

export interface ColorRange {
  start: HSLColor,
  end: HSLColor
}

export function makeColorRange(sa: ColorDesc, ea: ColorDesc): ColorRange {
  return {
    start: parseToHsl(sa),
    end: parseToHsl(ea),
  }
}

export function nToHex(n: number):string {
  return n.toString(16)
}

function padLeft(input, minLen, padChar = '0') {
  const inputStr = input.toString()
  if (inputStr.length < minLen) {
    const padStr = new Array(minLen - inputStr.length).fill(padChar).join('')
    return padStr + inputStr
  }
  return inputStr
}

export function rgbToHex(c: RGBColor):string {
  const hex = [c.r, c.g, c.b].map((num) => {
    return padLeft(nToHex(num), 2)
  }).join('')
  return `#${hex}`
}

export function hslToRgb(c: HSLColor): RGBColor {
  let _h = c.h / 360
  let _s = c.s / 100
  let _l = c.l / 100
  let _r:number, _g:number, _b:number
  let q:number, p:number;
  if (_s === 0) {
    _r = _g = _b = 1
  } else {
    q = _l < 0.5 ? _l*(1+_s) : _l + _s - (_l * _s)
    p = 2 * _l - q
    _r = hueToRgb(p, q, _h + 1/3)
    _g = hueToRgb(p, q, _h)
    _b = hueToRgb(p, q, _h - 1/3)
  }
  return {
    r: Math.round(_r * 255),
    g: Math.round(_g * 255),
    b: Math.round(_b * 255),
  }
}

export function hueToRgb (p:number, q:number, t:number):number {
  if (t < 0) { t += 1; }
  if (t > 1) { t -= 1; }
  if (t < 1 / 6) { return p + (q - p) * 6 * t; }
  if (t < 1 / 2) { return q; }
  if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
  return p;
};

export function makeColorStops(cr: ColorRange, split: number = 0):Array<HSLColor> {
  let sc = cr.start
  let ec = cr.end
  split = Math.max(0,  split)
  let out = [clone(sc)]
  if (split) {
    let gaps = split + 1
    let cdiffs:IHSLColor = {}, csteps:IHSLColor = {}
    // TODO: 太蠢了... 怎么做才能更概括呢...
    cdiffs.h = ec.h - sc.h
    cdiffs.s = ec.s - sc.s
    cdiffs.l = ec.l - sc.l
    csteps.h = cdiffs.h / gaps
    csteps.s = cdiffs.s / gaps
    csteps.l = cdiffs.l / gaps
    range(1, gaps).map(function (st) {
      let c = new HSLColor
      Object.assign(c,{
        h: Math.round(sc.h + (st * csteps.h)),
        s: Math.round(sc.s + (st * csteps.s)),
        l: Math.round(sc.l + (st * csteps.l)),
      })
      out.push(c)
    })
  }
  out.push(clone(ec))
  return out
}
