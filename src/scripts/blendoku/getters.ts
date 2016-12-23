export function blocks(state:any, getters?, rootState?, rootGatters?) {
  if (!state) {
    return
  }
  return state.blocks
}
export function data(state:any) {
  return {
    blocks: blocks(state)
  }
}

export function unitLen(state:any) {
  return state.config.unitLen
}
export function config(state:any) {
  return state.config
}
