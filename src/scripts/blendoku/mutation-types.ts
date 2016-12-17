import 'vuex'
// function makeMutations(arr: Array<string>):Object {
//   let mts:Object = {}
//   arr.forEach((k: string) => {mts[k] = k})
//   return mts
// }
// function keyMirror(obj: any):Object {
//   for(var k in obj) {
//     obj[k] = k
//   }
//   return obj
// }
// var mts = makeMutations([
//   'ADD_BLOCKS'
// ])
var mts = {
  ADD_BLOCKS: null,
  DRAG_BLOCK_TO: null
}
for(var k in mts) {
  mts[k] = k
}

export default mts
// export default keyMirror({
//   ADD_BLOCKS: null,
// })
