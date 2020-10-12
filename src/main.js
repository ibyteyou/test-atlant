import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router: new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: () => import(/* webpackChunkName: "main-page" */'./pages/main'),
      children: [{
        path: '/desktop',
        component: () => import(/* webpackChunkName: "desktop-page" */'./pages/desktop')
      }, {
        path: '/sockets',
        component: () => import(/* webpackChunkName: "sockets-page" */'./pages/sockets')
      }]
    }]
  })
}).$mount('#app')
