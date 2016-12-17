import Vue from 'vue'

const DataVue = Vue.extend({
  props: {
    data: Object
  },
  created() {
    this.initWatchers()
  },
  methods: {
    initWatchers() {
      watchCoord(this)
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  }
})

export function watchCoord(vm) {
  function handler() {
    this.emitUpdate({path: 'coord', data: this.data})
  }
  vm.$watch(function(){
    let data = this.data
    return (data.coord.gy + data.coord.gx) * (data.coord.gy - data.coord.gx)
  }, handler)
}

export default DataVue