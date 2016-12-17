import Game from './blendoku/game'

export interface IGlobalStorage {
  game: Game
}

export default {
  game: null
}