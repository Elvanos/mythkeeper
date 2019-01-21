const fs = require('fs-extra')

import {remote} from 'electron'

const userDataFolder = remote.app.getPath('appData')

const assetsFolder = userDataFolder + '/Wonderdraft/assets'
const assetsFolderBackup = userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets'
const assetsFolderDeleted = userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets'


const state = {
   userDataFolder: userDataFolder,
   assetsFolder: assetsFolder,
   assetsFolderBackup: assetsFolderBackup,
   assetsFolderDeleted: assetsFolderDeleted,
   listAssetsFolders: [],
   listAssetsFoldersBackup: []

}

const getters = {
   getUserDataFolder: (state) => {
      return state.userDataFolder
   },
   getAssetsFolder: (state) => {
      return state.assetsFolder
   },
   getAssetsFolderBackup: (state) => {
      return state.assetsFolderBackup
   },
   getAssetsFolderDeleted: (state) => {
      return state.assetsFolderDeleted
   },

   getListAssetsFolders: (state) => {
      return state.listAssetsFolders
   },
   getListAssetsFolderBackup: (state) => {
      return state.listAssetsFoldersBackup
   }
}

const mutations = {
   UPDATE_ASSET_LIST(state, value) {
      state.listAssetsFolders = value
   },
   UPDATE_ASSET_LIST_BACKUP(state, value) {
      state.listAssetsFoldersBackup = value
   },

}

const actions = {


   updateAssetList({commit},list) {

      commit('UPDATE_ASSET_LIST', list)
   },

   updateAssetListBackup({commit},list) {

     commit('UPDATE_ASSET_LIST_BACKUP', list)
   },

   // Delete asset
   deleteAsset({commit, state, dispatch}, assetDir) {

      const assetPath = assetsFolder +'/'+ assetDir
      const assetDeletedPath = userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets/' + assetDir

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
      if (fs.existsSync(assetDeletedPath)) {
         fs.removeSync(assetDeletedPath)
      }


      // Copy the new backup
      try {
         fs.copySync(assetPath, assetDeletedPath)
      } catch (err) {
         console.error(err)
      }

      // Delete the folder
      fs.removeSync(assetPath)


   },

   // Backup functions Functions
   backupAsset({commit, state}, assetDir) {
      const assetPath = assetsFolder +'/'+ assetDir
      const assetBackupPath = assetsFolderBackup +'/'+ assetDir

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
      for (i = 0; i < state.listAssetsFolders.length; i++) {
         const assetDir = state.listAssetsFolders[i]

         dispatch('backupAsset', assetDir);
      }

   },
   restoreBackupAsset({commit, state}, assetDir) {

      const assetPath = assetsFolder +'/'+ assetDir
      const assetBackupPath = assetsFolderBackup +'/'+ assetDir

      // Copy the new backup
      try {
         fs.copySync(assetBackupPath, assetPath)
      } catch (err) {
         console.error(err)
      }
   },
   deleteAssetBackup({commit, state, dispatch}, assetDir) {

      const assetBackupPath = assetsFolderBackup +'/'+ assetDir
      const assetPathDeleted = assetsFolderDeleted +'/'+ assetDir

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

      // Delete already existing deleted backup if it exists
      if (fs.existsSync(assetPathDeleted)) {
         fs.removeSync(assetPathDeleted)
      }

      // Copy the new deleted backup
      try {
         fs.copySync(assetBackupPath, assetPathDeleted)
      } catch (err) {
         console.error(err)
      }

      // Delete the folder
      fs.removeSync(assetBackupPath)

   },

}

export default {
   state,
   mutations,
   actions,
   getters
}
