const fs = require('fs-extra')

import {remote} from 'electron'

const userDataFolder = remote.app.getPath('appData')

const state = {
   assetList: false,
   assetListBackup: false,
   assetListCombined: false,
   userDataFolder: userDataFolder
}

const getters = {
   getAssetList: (state) => {
      return state.assetList
   },
   getAssetListBackup: (state) => {
      return state.assetListBackup
   },
   getAssetListCombined: (state) => {
      return state.assetListCombined
   },
   getUserDataFolder: (state) => {
      return state.userDataFolder
   }
}

const mutations = {
   UPDATE_ASSET_LIST(state, value) {
      state.assetList = value
   },
   UPDATE_ASSET_LIST_BACKUP(state, value) {
      state.assetListBackup = value
   },
   UPDATE_ASSET_LIST_COMBINED(state, value) {
      state.assetListCombined = value
   }
}

const actions = {
   refreshAssetListCombined({commit, state, dispatch}) {

      dispatch('refreshAssetList').then(() => {
         let assetList = state.assetList
         let value = assetList.slice()

         dispatch('refreshAssetListBackup').then(() => {
            let assetListBackup = state.assetListBackup
            let valueBackup = assetListBackup.slice()

            let i;
            for (i = 0; i < valueBackup.length; i++) {

               if (!value.includes(valueBackup[i])) {
                  valueBackup[i] = valueBackup[i] + 'mythkeeperBackup'
                  value.push(valueBackup[i])
               }
            }

            value.sort()

            commit('UPDATE_ASSET_LIST_COMBINED', value)
         })
      })

   },
   refreshAssetListBackup({commit}) {

      // Fix paths
      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets')
      }

      const value = fs.readdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets', 'utf8', function (err, data) {
         if (err) {
            console.log(err)

         } else {
            console.log(data)

            return data

         }
      })



      commit('UPDATE_ASSET_LIST_BACKUP', value)
   },
   refreshAssetList({commit}) {

      // Exports for debug for Zalkenai
      //remote.getCurrentWindow().toggleDevTools();

      const value = fs.readdirSync(userDataFolder + '/Wonderdraft/assets', 'utf8', function (err, data) {
         if (err) {
            //console.log(err)

         } else {
            //console.log(data)

            return data

         }
      })


      commit('UPDATE_ASSET_LIST', value)
   },


   restoreBackupAsset({commit, state}, assetDir) {

      const assetPath = userDataFolder + '/Wonderdraft/assets/' + assetDir
      const assetBackupPath = userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets/' + assetDir

      // Copy the new backup
      try {
         fs.copySync(assetBackupPath, assetPath)
      } catch (err) {
         console.error(err)
      }
   },
   deleteAssetBackup({commit, state, dispatch}, assetDir) {

      const assetPath = userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets/' + assetDir
      const assetBackupPath = userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets/' + assetDir

      // Fix paths
      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets')
      }

      // Delete already existing backup if it exists
      if (fs.existsSync(assetBackupPath)) {
         fs.removeSync(assetBackupPath)
      }

      // Copy the new backup
      try {
         fs.copySync(assetPath, assetBackupPath)
      } catch (err) {
         console.error(err)
      }

      // Delete the folder
      fs.removeSync(assetPath)

   },

   deleteAsset({commit, state, dispatch}, assetDir) {

      const assetPath = userDataFolder + '/Wonderdraft/assets/' + assetDir
      const assetBackupPath = userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets/' + assetDir

      // Fix paths
      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets')
      }

      // Delete already existing backup if it exists
      if (fs.existsSync(assetBackupPath)) {
         fs.removeSync(assetBackupPath)
      }


      // Copy the new backup
      try {
         fs.copySync(assetPath, assetBackupPath)
      } catch (err) {
         console.error(err)
      }

      // Delete the folder
      fs.removeSync(assetPath)


   },
   backupAsset({commit, state}, assetDir) {

      const assetPath = userDataFolder + '/Wonderdraft/assets/' + assetDir
      const assetBackupPath = userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets/' + assetDir

      // Fix paths
      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup')
      }

      if (!fs.existsSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets')) {
         fs.mkdirSync(userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets')
      }

      // Delete already existing backup if it exists
      if (fs.existsSync(assetBackupPath)) {
         fs.removeSync(assetBackupPath)
      }


      // Copy the new backup
      try {
         fs.copySync(assetPath, assetBackupPath)
      } catch (err) {
         console.error(err)
      }


   },
   backupAllAssets({commit, state, dispatch}) {

      // Backup all assets
      let i;
      for (i = 0; i < state.assetList.length; i++) {
         const assetDir = state.assetList[i]

         dispatch('backupAsset', assetDir);
      }

   },

}

export default {
   state,
   mutations,
   actions,
   getters
}
