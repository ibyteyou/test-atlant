<template lang="pug">
  div.window-component(:class="{ active, [cursor]: cursor }", :style="style" @mousedown="mousedown")
    div.window-component--header(v-if="!removed")
      div.window-component--close-icon(@mousedown.stop @click="setActive(), remove()")
      span {{ `Tile ${this.id || this._uid}` }}
    div.window-component--body
      a.window-component--revert-link(v-if="removed" @click="revert") + Return tile to trading desk
      slot(v-else)
</template>

<script>
  import clone from '../vendor/clone'
  import WindowState from '../vendor/window-state'

  const GRID = 10 // please change this value to edit global grid window movement
  function getPosition (event) {
    return event.touches && event.touches.length > 0
      ? event.touches[0]
      : event
  }

  export default {
    name: 'windowComponent',
    data: () => ({
      cursor: null,
      cursorSide: null,
      moveable: false,
      removed: false,
      resizable: false,
      bounds: {
        height: 100,
        width: 100,
        x: 0,
        y: 0
      },
      zIndex: null
    }),
    props: {
      id: Number,
      width: Number,
      height: Number,
      x: Number,
      y: Number
    },
    watch: {
      width (v) {
        if (this.bounds.width === v) return
        this.bounds.width = v
      },
      height (v) {
        if (this.bounds.height === v) return
        this.bounds.height = v
      },
      x (v) {
        if (this.bounds.x === v) return
        this.bounds.x = v
      },
      y (v) {
        if (this.bounds.y === v) return
        this.bounds.y = v
      }
    },
    computed: {
      active: ({ id }) => id === WindowState.active,
      style ({ bounds, zIndex }) {
        return {
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          top: `${bounds.y}px`,
          left: `${bounds.x}px`,
          zIndex
        }
      }
    },
    methods: {
      changecursor () {
        if (this.moveable) return

        let { clientX, clientY } = getPosition(event)
        let { top, left } = this.$el.getBoundingClientRect()
        let { offsetWidth, offsetHeight } = this.$el
        let radius = 5
        let xDiff = clientX - left
        let yDiff = clientY - top
        let cursor, cursorSide
        switch (true) {
          case (xDiff < radius && yDiff < radius):
          case (xDiff > offsetWidth - radius && yDiff > offsetHeight - radius):
            cursor = 'nwse'
            cursorSide = (xDiff < radius && yDiff < radius) ? 'left/top' : 'right/bottom'
            break
          case (xDiff < radius && yDiff > offsetHeight - radius):
          case (yDiff < radius && xDiff > offsetWidth - radius):
            cursor = 'nesw'
            cursorSide = (xDiff < radius && yDiff > offsetHeight - radius) ? 'left/bottom' : 'right/top'
            break
          case (yDiff < radius || yDiff > offsetHeight - radius):
            cursor = 'ns'
            cursorSide = (yDiff < radius) ? 'top' : 'bottom'
            break
          case (xDiff < radius || xDiff > offsetWidth - radius):
            cursor = 'ew'
            cursorSide = (xDiff < radius) ? 'left' : 'right'
            break
          default:
            cursor = cursorSide = false
        }
        this.cursor = (cursor) ? `cursor-${cursor}-resize` : cursor
        this.cursorSide = cursorSide
      },
      mouseup () {
        this.moveable = false
        this.resizable = false
        this._bounds = null
        this._offsetX = null
        this._offsetY = null
        this.$el.addEventListener('mousemove', this.changecursor)
        this.$el.addEventListener('mouseleave', this.nocursor)
        this.$emit('bounds', this.bounds)
      },
      mousedown (event) {
        this.setActive()

        let { offsetX, offsetY } = getPosition(event)
        this._offsetX = offsetX
        this._offsetY = offsetY
        this.moveable = event.path[0].classList.contains('window-component--header')
          || event.path[1].classList.contains('window-component--header') // "parentsHasClass" mixin required (fast fix span conflict)
        this.resizable = !!this.cursor
        if (this.resizable) {
          this._bounds = clone(this.bounds)
        }

        document.addEventListener('mousemove', this.mousemove)
        document.addEventListener('mouseup', this.mouseup)
        this.$el.removeEventListener('mousemove', this.changecursor)
        this.$el.removeEventListener('mouseleave', this.nocursor)
      },
      mousemove (event) {
        let { clientX, clientY } = getPosition(event)

        if (this.moveable) {
          this.setX(clientX - this._offsetX)
          this.setY(clientY - this._offsetY)
        } else if (this.resizable) {
          const side = this.cursorSide
          const { top: parentTop, left: parentLeft } = this.$parent.$el.getBoundingClientRect()
          const vertical = () => {
            switch (true) {
              case side.includes('top'):
                if (this.setHeight(this._bounds.height + (this._bounds.y - clientY))) {
                  this.setY(clientY)
                }
                break
              case side.includes('bottom'):
                this.setHeight(clientY - parentTop - this._bounds.y)
                break
            }
          }
          switch (true) {
            case side.includes('left'):
              if (this.setWidth(this._bounds.width + (this._bounds.x - clientX))) {
                this.setX(clientX)
              }
              vertical()
              break
            case side.includes('right'):
              this.setWidth(clientX - parentLeft - this._bounds.x)
              vertical()
              break
            default:
              vertical()
          }
        }
      },
      nocursor () {
        if (this.moveable || this.resizable) return

        this.cursor = null
        this.cursorSide = null
      },
      remove () {
        this.removed = true
      },
      revert () {
        this.removed = false
      },
      setActive () {
        if (this.active) return
        WindowState.active = this.id
        this.setzIndex()
      },
      setHeight (v) {
        if (v < 50) return
        if (v % GRID) return

        return (this.bounds.height = v)
      },
      setWidth (v) {
        if (v < 50) return
        if (v % GRID) return

        return (this.bounds.width = v)
      },
      setX (v) {
        if (v < 0) return
        if ((v + this.bounds.width) > window.innerWidth) return
        if (v % GRID) return

        this.bounds.x = v
      },
      setY (v) {
        if (v < 0) return
        if ((v + this.bounds.height) > window.innerHeight) return
        if (v % GRID) return

        this.bounds.y = v
      },
      setzIndex () {
        this.zIndex = ++WindowState.zIndex
      }
    },
    mounted () {
      this.setzIndex()
      this.bounds.height = this.height
      this.bounds.width = this.width
      this.bounds.x = this.x
      this.bounds.y = this.y
      this.$el.addEventListener('mousemove', this.changecursor)
      this.$el.addEventListener('mouseleave', this.nocursor)
    }
  }
</script>

<style lang="sass">
  @import "../assets/sass/var-maps"

  // cursors
  @each $cursor in $cursors
    .cursor-#{$cursor}
      cursor: $cursor !important
  .window-component
    position: absolute
    border: 1px solid #000
    min-width: 50px
    min-height: 50px
    background-color: #fff
    &.active
      border: 1px solid #919fc3
      .window-component--header
        background-color: #d1e5fb
        border-bottom: 1px solid #919fc3
    .window-component--header,
    .window-component--revert-link
      user-select: none
    .window-component--header
      position: relative
      font-weight: 600
      border-bottom: 1px solid #000
      cursor: move
      .window-component--close-icon
        position: absolute
        top: 4px
        left: 4px
        border: 1px solid #888
        width: 10px
        height: 10px
        border-radius: 2px
        cursor: pointer
        &::before
          position: absolute
          content: "–"
          top: -6px
          left: 0
          right: 0
          margin: auto
          font-weight: 600
    .window-component--body
      .window-component--revert-link
        font-size: 12px
        cursor: pointer
        text-decoration: underline
        white-space: nowrap
        text-overflow: ellipsis
        position: absolute
        top: 0
        bottom: 0
        left: 0
        margin: auto
        right: 0
        height: 18px
        width: auto
</style>
