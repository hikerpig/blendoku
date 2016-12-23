import store from '../stores/store'
import mts from './mutation-types'
import {alignToVcoord, IVunitCoord} from '../vunits/base'

export default {
  dragBlock(payload) {
    // console.log('dragBlock', payload);
    let {from, to} = payload
    let fromCoord:IVunitCoord = alignToVcoord(from.eleCoord)
    let toCoord:IVunitCoord = alignToVcoord(to.eleCoord)
    from.coord = fromCoord
    to.coord = toCoord
    store.dragBlockTo(payload)
  }
}
