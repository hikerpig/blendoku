<template>
<div id="app">
  <div>DEBUG</div>
  <div class="blocks-wrap">
    <div v-for="item in blocks" class="block">
      {{JSON.stringify(item)}}
    </div>
  </div>
</div>
</template>

<script>
import util from 'scripts/utils/util'
import getters from 'scripts/blendoku/getters'
import {mapGetters} from 'vuex'

export default {
  name: 'app',
  mounted() {
    console.log('app mounted')
  },
  // data() {
  //   return {
  //     blocks: []
  //   }
  // },
  computed: mapGetters(['blocks', 'config']),
  components: {
  }
}
</script>