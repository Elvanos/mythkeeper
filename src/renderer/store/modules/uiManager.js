const state = {
   appBarOpened: true,
   currentModule: false,
   isAppEnabled: true
}

const getters ={
   getAppBarStatus: (state) => {
      return state.appBarOpened
   },
   getCurrentModule: (state) => {
      return state.currentModule
   },
   getAppStatus: (state) => {
      return state.isAppEnabled
   }
}

const mutations = {
   SET_SIDEBAR_OPENED(state) {
      state.appBarOpened = true
   },
   SET_SIDEBAR_CLOSED(state) {
      state.appBarOpened = false
   },
   SET_CURRENT_MODULE(state, value) {
      state.currentModule = value
   },
   APP_DISABLE(state) {
      state.isAppEnabled = false
   },
   APP_ENABLE(state) {
      state.isAppEnabled = true
   }
}

const actions = {

   enableApp({commit}) {
      commit('APP_ENABLE')
   },

   disableApp({commit}) {
      commit('APP_DISABLE')
   },

   openSidebar({commit}) {
      commit('SET_SIDEBAR_OPENED')
   },

   closeSidebar({commit}) {
      commit('SET_SIDEBAR_CLOSED')
   },

   setCurrentModule({commit, dispatch, state}, value) {

      commit('SET_CURRENT_MODULE',value)

   }
}

export default {
   state,
   mutations,
   actions,
   getters
}
