import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 10,
    host: 'http://127.0.0.1:8000',
    test_host: 'http://192.168.5.21:8000'
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store