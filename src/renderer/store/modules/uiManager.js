const state = {
   appBarOpened: true,
   currentModule: null,
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
   SET_SIDEBAR_OPEN_STATUS(state, value) {
      state.appBarOpened = value
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

   setAppStatusDisabled({commit}) {
      commit('APP_DISABLE')
   },

   setAppStatusEnabled({commit}) {
      commit('APP_ENABLE')
   },

   setSidebarStatus({commit}, value) {
      commit('SET_SIDEBAR_OPEN_STATUS',value)
   },

   setCurrentModule({commit, dispatch, state}, value) {

      const currentModule = state.currentModule
      const appBarOpened = state.appBarOpened

      if (currentModule === value || currentModule === null) {

         if (appBarOpened) {
            dispatch('setSidebarStatus', false)
         } else {
            //dispatch('setSidebarStatus', true)
         }

      } else {
         dispatch('setSidebarStatus', false)
      }

      commit('SET_CURRENT_MODULE',value)

   }
}

export default {
   state,
   mutations,
   actions,
   getters
}
