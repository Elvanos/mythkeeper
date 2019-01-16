const state = {
   appBarOpened: true,
   currentModule: null
}

const getters ={
   getAppBarStatus: (state) => {
      return state.appBarOpened
   },
   getCurrentModule: (state) => {
      return state.currentModule
   }
}

const mutations = {
   SET_SIDEBAR_OPEN_STATUS(state, value) {
      state.appBarOpened = value
   },
   SET_CURRENT_MODULE(state, value) {
      state.currentModule = value
   }
}

const actions = {

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
