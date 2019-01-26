const state = {
   appBarOpened: true,
   currentModule: false,
   isAppEnabled: true,
   uiHelpEnabled: true,
   overlayZoomIsZoomed: false,
   overlayZoomSRC: null
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
   },
   getUIhelpStatus: (state) => {
      return state.uiHelpEnabled
   },
   getOverlayZoomState: (state) => {
      return state.overlayZoomIsZoomed
   },
   getOverlayZoomSRC: (state) => {
      return state.overlayZoomSRC
   },
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
   },
   UIHELP_DISABLE(state) {
      state.uiHelpEnabled = false
   },
   UIHELP_ENABLE(state) {
      state.uiHelpEnabled = true
   },
   OVERLAY_ZOOM_ENABLE(state) {
      state.overlayZoomIsZoomed = true
   },
   OVERLAY_ZOOM_DISABLE(state) {
      state.overlayZoomIsZoomed = false
   },
   OVERLAY_ZOOM_SET_SRC(state, value) {
      state.overlayZoomSRC = value
   }
}

const actions = {

   enableUIhelp({commit}) {
      commit('UIHELP_ENABLE')
   },

   disableUIhelp({commit}) {
      commit('UIHELP_DISABLE')
   },




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
   },



   overlayEnableZoom({commit}) {
      commit('OVERLAY_ZOOM_ENABLE')
   },

   overlayDisableZoom({commit}) {
      commit('OVERLAY_ZOOM_DISABLE')
   },

   overlayZoomSetSRC({commit, dispatch, state}, value) {
      commit('OVERLAY_ZOOM_SET_SRC',value)
   },

}

export default {
   state,
   mutations,
   actions,
   getters
}
