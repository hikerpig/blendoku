export function say() {
  return 'Hello'
}

export function replaceArray(arr:Array<any>, newarray:Array<any>):void {
  if (!(arr && newarray)) return
  arr.splice(0, arr.length)
  newarray.forEach((v:any) => arr.push(v))
}
