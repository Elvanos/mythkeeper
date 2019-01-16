const fs = require('fs')
import { remote } from 'electron'
const userDataFolder = remote.app.getPath('appData')

const state = {
   assetList: false,
   userDataFolder: userDataFolder
}

const getters ={
   getAssetList: (state) => {
      return state.assetList
   },
   getUserDataFolder: (state) => {
      return state.userDataFolder
   }
}

const mutations = {
   UPDATE_ASSET_LIST(state, value) {
      state.assetList = value
   }
}

const actions = {

   refreshAssetList({commit}) {

      console.log('getting new list')

      // Exports for debug for Zalkenai
      //remote.getCurrentWindow().toggleDevTools();


      const value = fs.readdirSync(userDataFolder+'/Wonderdraft/assets', 'utf8', function (err, data) {
         if (err) {
            console.log(err)

         } else {
            console.log(data)

            return data

         }
      })


      commit('UPDATE_ASSET_LIST',value)
   },

}

export default {
   state,
   mutations,
   actions,
   getters
}
