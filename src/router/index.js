import Vue from 'vue'
import VueRouter from 'vue-router'
import Company from '@/components/CompanyDetail.vue'
import Department from '@/components/DepartmentDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/companies',
    name: 'Company',
    component: Company,
    // beforeEnter: checkAuth,
  },
  {
    path: '/companies/:id',
    name: 'Department',
    component: Department,
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
})

export default router