<template lang="pug">
  #desktop-page
    a#desktop-reset-link(@click="reset") reset
    window(v-for="w in windows", v-bind="w", :key="w.id" @bounds="bounds(w, $event)")
</template>

<script>
  import clone from '../vendor/clone'
  import { read, save } from '../vendor/storage'
  import windowComponent from '../components/window'

  const WINDOW_BOUNDS = 'window.bounds'
  const defaultBounds = [{
    id: 1,
    width: 300,
    height: 100,
    x: 50,
    y: 120
  }, {
    id: 2,
    width: 300,
    height: 100,
    x: 620,
    y: 190
  }, {
    id: 3,
    width: 300,
    height: 100,
    x: 360,
    y: 280
  }, {
    id: 4,
    width: 300,
    height: 100,
    x: 390,
    y: 130
  }, {
    id: 5,
    width: 300,
    height: 100,
    x: 770,
    y: 110
  }]

  export default {
    name: 'Desktop',
    components: { window: windowComponent },
    data: () => ({
      windows: JSON.parse(read(WINDOW_BOUNDS, null)) || clone(defaultBounds)
    }),
    methods: {
      bounds (windowData, newBounds) {
        Object.assign(windowData, newBounds) // merging object in "windows" array
        save(WINDOW_BOUNDS, JSON.stringify(this.windows))
      },
      reset () {
        clone(defaultBounds).forEach((v, k) => this.$set(this.windows, k, v))
        save(WINDOW_BOUNDS, JSON.stringify(this.windows))
      }
    }
  }
</script>

<style lang="sass">
  #desktop-reset-link
    position: absolute
    left: 115px
    top: 10px
    cursor: pointer
    user-select: none
</style>
