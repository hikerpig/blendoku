import DataVue, {watchCoord} from './data-vue'
import {hslToHex} from '../blendoku/colors'

const BlockVue = DataVue.extend({
  methods: {
    initWatchers() {
      watchCoord(this)
      watchColor(this)
    }
  }
})

export function watchColor(vm) {
  function handler() {
    this.emitUpdate({path: 'color', data: this.data})
  }
  vm.$watch(function(){
    let {data} = this
    return hslToHex(data.color)
  }, handler)
}

export default BlockVue