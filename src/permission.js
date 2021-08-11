import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'

// 免登录白名单
// const whiteList = ['']

// 路由跳转前
router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    // 获取用户信息
    store.dispatch('getInfo').then(r => {})
    next()
  } else {
    next()
  }
})

// 路由跳转后
router.afterEach(() => {
})
