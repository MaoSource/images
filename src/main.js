import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import request from './utils/request'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import VueClipboard from 'vue-clipboard2'
import '@/permission' // permission control

Vue.config.productionTip = false

Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$upload = request.upload
Vue.prototype.$uploads = request.uploads
Vue.prototype.$putFile = request.putFile

Vue.use(Vant)
Vue.use(ElementUI)
Vue.use(VueClipboard)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
