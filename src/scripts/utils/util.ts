import {
  isObject,
  each
} from 'lodash'

export function clearArray(arr) {
  return arr.splice(0, arr.length)
}

export function replaceArray(arr:Array<any>, newarray:Array<any>):void {
  if (!(arr && newarray)) return
  arr.splice(0, arr.length)
  newarray.forEach((v:any) => arr.push(v))
}

export function getVal (obj, key) {
  if (!obj) return obj
  let keyAttr = key.split('.')
  let val = obj

  for (let i = 0; i < keyAttr.length; i++) {
    let k = keyAttr[i];
    if (val && isObject(val)) {
      val = val[k]
    } else if (val !== undefined){
      return val
    } else {
      // console.log('not hit', k, val)
      return undefined
    }
  }
  return val
}

export function makeGetter(obj, p) {
  let fn = function() {return getVal(obj, p)}
  // console.log(fn, obj, p);
  return fn
}

export function shallowCopy<T>(o: T, ctor: {new(): T}): T {
  let c: T = new ctor()
  for (let k in o) {
    if (o.hasOwnProperty(k)) {
      c[k] = o[k]
    }
  }
  return c
}