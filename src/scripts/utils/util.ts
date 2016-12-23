export function say() {
  return 'Hello'
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
    let val = obj[k]
    if (val && val.hasOwnProperty(k)) {
      val = val[k]
    } else {
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