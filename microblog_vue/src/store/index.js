import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 实现登录后其他模块也可以获取当前用户的信息，例如权限
    token: '',
    userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
  },
  getters: {
    // 想当于java的get
    getUser: state => {
      return state.userInfo
    }
  },
  mutations: {
    // 相当于java的set
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("userInfo", JSON.stringify(''))
    }


  },
  actions: {
  },
  modules: {
  }
})
