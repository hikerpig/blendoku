import Vuex from 'vuex'

// var getters:Vuex.GetterTree<any, {}> = {
//   blocks(state:any) {
//     if (!state) {
//       return
//     }
//     return state.game.blocks
//   },
//   data(state:any, getters) {
//     return {
//       blocks: getters.blocks(state)
//     }
//   },
//   unitLen(state:any) {
//     return state.game.config.unitLen
//   },
//   config(state:any) {
//     return state.game.config
//   }
// }
// export default getters
export function blocks(state:any, getters?, rootState?, rootGatters?) {
  if (!state) {
    return
  }
  return state.game.blocks
}
export function data(state:any) {
  return {
    blocks: blocks(state)
  }
}

export function unitLen(state:any) {
  return state.game.config.unitLen
}
export function config(state:any) {
  return state.game.config
}
