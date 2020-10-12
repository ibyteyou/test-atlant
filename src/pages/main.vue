<template lang="pug">
  #main-page
    router-link.to-main-link(v-if="!main" to="/") ← main
    svg.atlant-logo(:class="{ 'mini': !main }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 52")
      path(d="M28.366.734c3.192 1.687 4.461 5.74 2.835 9.05L12.268 48.325c-1.627 3.31-5.534 4.627-8.725 2.94C.352 49.578-.918 45.526.708 42.216L19.642 3.675c1.626-3.31 5.533-4.627 8.724-2.94zm13.508 26.348l-7.315 14.72 3.185 6.484c1.625 3.308 5.527 4.624 8.716 2.937 3.19-1.687 4.458-5.734 2.831-9.041l-7.418-15.1z" fill="currentColor" fill-rule="nonzero")
    div.links(v-if="main")
      router-link(to="/desktop") desktop
      router-link(to="/sockets") sockets
    router-view
</template>

<script>
  export default {
    name: 'Main',
    computed: {
      main: ({ $route }) => $route.path === '/'
    }
  }
</script>

<style lang="sass">
  #main-page
    .atlant-logo
      width: 100px
      &:not(.mini)
        margin-top: 60px
      &.mini
        width: 25px
        position: absolute
        top: 10px
        left: 10px
    .to-main-link
      position: absolute
      top: 10px
      left: 50px
    .links
      margin-top: 25vh
      width: 100%
      display: flex
      justify-content: space-around
    .to-main-link, .links a
      color: #2c3e50
      text-decoration: none
      user-select: none
</style>
