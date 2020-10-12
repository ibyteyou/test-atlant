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
      component: () => import('./pages/main'),
      children: [{
        path: '/desktop',
        component: () => import('./pages/desktop')
      }, {
        path: '/sockets',
        component: () => import('./pages/sockets')
      }]
    }]
  })
}).$mount('#app')
