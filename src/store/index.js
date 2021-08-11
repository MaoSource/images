import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      username: null
    }
  },
  mutations: {
    SET_USER_INFO: (state) => {
      state.userInfo.username = localStorage.getItem('username')
    }
  },
  actions: {
    // 获取用户信息
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const username = localStorage.getItem('username')
        commit('SET_USER_INFO', username)
      })
    }
  },
  modules: {
  }
})
