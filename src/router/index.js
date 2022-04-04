import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/dashboard/Dashboard'
import autenticationService from "../services/autenticationService.js";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard, 
    children: [
     {
      path:'/',
      component: () => import('@/views/dashboard/CreateBill'),
     },
     {
      path: '/list',
      component: () => import('@/views/dashboard/List'),
     },
     {
       path: '/bill/:id',
       component: () => import('@/views/dashboard/Bill'),
     }
    ],
  
  },

  //////
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/autentication/Login'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/autentication/Register'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
