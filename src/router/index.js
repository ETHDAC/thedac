import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TheDac from '@/components/TheDac'
import TheUser from '@/components/TheUser'
import TheTitleHolder from '@/components/TheTitleHolder'
import Home0x from '@/components/Home0x'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
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
    },
    {
      path: '/title-holder',
      name: 'TheTitleHolder',
      component: TheTitleHolder
    },
    {
      path: '/zero-x',
      name: 'Home0x',
      component: Home0x
    }
  ]
})
