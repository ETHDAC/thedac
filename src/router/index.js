import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TheDac from '@/components/TheDac'
import TheUser from '@/components/TheUser'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/dac',
      name: 'TheDac',
      component: TheDac
    },
    {
      path: '/user',
      name: 'TheUser',
      component: TheUser
    }
  ]
})
