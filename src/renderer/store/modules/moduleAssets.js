const fs = require('fs-extra')
const zipFolder = require('zip-folder')

const path = require("path")
const StreamZip = require('node-stream-zip')

import {remote} from 'electron'

const {dialog} = require('electron').remote;

let userDataFolder = remote.app.getPath('appData')

let assetsFolder = userDataFolder + '/Wonderdraft/assets'

// Linux fix for different pathing
if (process.platform === 'linux' && !fs.existsSync(assetsFolder)) {
   userDataFolder = '~/.local/share'
   assetsFolder = userDataFolder + '/Wonderdraft/assets'
}

const assetsFolderBackup = userDataFolder + '/Wonderdraft/_mythKeeper/backup/assets'
const assetsFolderDeleted = userDataFolder + '/Wonderdraft/_mythKeeper/deleted/assets'


const state = {
   userDataFolder: userDataFolder,
   assetsFolder: assetsFolder,
   assetsFolderBackup: assetsFolderBackup,
   assetsFolderDeleted: assetsFolderDeleted,
   listAssetsFolders: [],
   listAssetsFoldersBackup: [],
   listAssetsData: [],
   recentlyInstalledCAAsset: 0,
   tempMultifileData: {
      id: 0,
      downloadPath: ''
   },
   tempAssetData: {
      vendors: {
         cartographyassetsID: 0,
         cartographyassetsVersion: 0
      },
      newData: false
   }

}

const getters = {
   getAssetTempData: (state) => {
      return state.tempAssetData
   },

   getRecentlyInstalledCAAsset: (state) => {
      return state.recentlyInstalledCAAsset
   },

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
   },

   getListAssetsData: (state) => {
      return state.listAssetsData
   },

   getMultiFileTempData: (state) => {
      return state.tempMultifileData
   },

}

const mutations = {

   UPDATE_RECENT_CA_ASSET(state, value) {
      state.recentlyInstalledCAAsset = value
   },
   UPDATE_TEMP_DATA(state, value) {
      if (value.vendors !== undefined) {
         state.tempAssetData.vendors.cartographyassetsID = value.vendors.cartographyassetsID
         state.tempAssetData.vendors.cartographyassetsVersion = value.vendors.cartographyassetsVersion
      }
      state.tempAssetData.newData = value.newData

   },
   UPDATE_MULTIFLE_DATA(state, value) {
      state.tempMultifileData = value

      console.log(state.tempMultifileData)
   },

   UPDATE_ASSET_LIST(state, value) {
      state.listAssetsFolders = value
   },
   UPDATE_ASSET_LIST_BACKUP(state, value) {
      state.listAssetsFoldersBackup = value
   },

   UPDATE_ASSET_LIST_DATA(state, value) {
      state.listAssetsData = value
   },

}

const actions = {

   updateRecentCAAsset({commit}, update) {
      commit('UPDATE_RECENT_CA_ASSET', update)
   },

   updateAssetTempData({commit}, update) {

      commit('UPDATE_TEMP_DATA', update)
   },

   updateMultifileTempData({commit}, update) {

      commit('UPDATE_MULTIFLE_DATA', update)
   },

   resetMultifileTempData({commit}) {
      const update = {
         id: 0,
         downloadPath: ''
      }
      commit('UPDATE_MULTIFLE_DATA', update)
   },

   resetAssetTempData({commit}) {
      const update = {
         newData: false
      }
      commit('UPDATE_TEMP_DATA', update)
   },

   updateAssetList({commit}, list) {

      commit('UPDATE_ASSET_LIST', list)
   },

   updateAssetListBackup({commit}, list) {

      commit('UPDATE_ASSET_LIST_BACKUP', list)
   },

   updateAssetListData({commit}, list) {

      commit('UPDATE_ASSET_LIST_DATA', list)
   },

   // Retrieve a deleted asset
   retrieveDeletedAsset({commit, state, dispatch}) {

      // Run this with "isRetrieving" value as true
      dispatch('installNewAssetLocal', true)

   },
   // Add new asset from local file
   installNewAssetLocal({commit, state, dispatch}, isRetrieving) {

      // Set dialog options
      const dialogOptions = () => {
         let defaultPath = remote.app.getPath('desktop').replace(/\//g, "\\")

         if (isRetrieving === true) defaultPath = assetsFolderDeleted.replace(/\//g, "\\")


         return {
            title: 'Select packed asset to install',
            defaultPath: defaultPath,
            openFile: true,
            openDirectory: false,
            multiSelections: false,
            filters: [
               {name: "Asset packages", extensions: ["zip"]},
            ],
         }
      }


      dispatch('disableApp')
          .then(() => {

             dialog.showOpenDialog(dialogOptions(), (fileNames) => {

                // If no file gets select, silently close down and re-enable the app
                if (fileNames === undefined) {
                   dispatch('enableApp')
                   return
                }

                // Unpack the selected asset
                dispatch('unpackNewAsset', fileNames[0])


             })


          })


   },

   // Unzipping of a file
   unpackNewAsset({commit, state, dispatch}, filePath) {

      // Prepare local variable for the zip stream
      let zip

      // Set an asset internal structure checker
      const assetStructure = {

         assetZipName: filePath,
         assetFolderName: null,

         // In case the asset is packed without a wrapping directory around it
         isNested: false,

         // In case the asset is packed with an extra directory over it (damn you Nex for making me do this! T_T)
         isOverpacked: false,

         // First path inside the asset. By default we expect the asset to be packed intelligently, so it is empty
         corePath: '',

         hasMetaFile: false,

         hasFontsFolder: false,

         hasNamesFolder: false,

         hasSpritesFolder: false,
         hasSymbolsFolder: false,
         hasMountainsFolder: false,
         hasTreesFolder: false,

         hasTexturesFolder: false,
         hasGround: false,
         hasBoxes: false,
         hasFrames: false,
         hasPaths: false,
         hasWater: false
      }

      const utils = {
         deleteCATempFolder: () => {
            setTimeout(() => {
               if (fs.existsSync(assetsFolder + '/tempMKDownload')) {
                  fs.removeSync(assetsFolder + '/tempMKDownload')
               }

            }, 250)
         },
         deleteTempFolder: () => {
            setTimeout(() => {
               if (fs.existsSync(assetsFolder + '/tempMKAsset')) {
                  fs.removeSync(assetsFolder + '/tempMKAsset')
               }


            }, 250)
         },
         clearSuccess: () => {
            dispatch('resetAssetTempData')
            dispatch('enableApp')
                .then(() => {
                   utils.scrollToTop()
                   this._vm.$awn.success("Asset successfully added")
                })
         },
         clearAbort: () => {
            dispatch('resetAssetTempData')
            dispatch('enableApp')
                .then(() => {
                   this._vm.$awn.warning("Asset adding aborted")

                })
         },
         clearError: () => {
            dispatch('resetAssetTempData')
            dispatch('enableApp')
                .then(() => {
                   this._vm.$awn.alert("Error reading the file. Something is wrong with it.")
                })
         },
         structureCheckCondition: (filePath) => {

            // An occasional glitch when the input is undefined when unpacking Method 3
            if (filePath !== undefined) {
               if (filePath.includes('mythKeeperSettings.json')) assetStructure.hasMetaFile = true

               if (filePath.includes('fonts/')) assetStructure.hasFontsFolder = true

               if (filePath.includes('names/')) assetStructure.hasNamesFolder = true

               if (filePath.includes('sprites/')) assetStructure.hasSpritesFolder = true
               if (filePath.includes('sprites/symbols/')) assetStructure.hasSymbolsFolder = true
               if (filePath.includes('sprites/mountains/')) assetStructure.hasMountainsFolder = true
               if (filePath.includes('sprites/trees/')) assetStructure.hasTreesFolder = true

               if (filePath.includes('textures/')) assetStructure.hasTexturesFolder = true
               if (filePath.includes('textures/ground')) assetStructure.hasGround = true
               if (filePath.includes('textures/boxes')) assetStructure.hasBoxes = true
               if (filePath.includes('textures/frames')) assetStructure.hasFrames = true
               if (filePath.includes('textures/paths')) assetStructure.hasPaths = true
               if (filePath.includes('textures/water')) assetStructure.hasWater = true


               if (filePath.includes('assets/')) {
                  assetStructure.isOverpacked = true
               }


               if (filePath.includes('/names/')) {
                  assetStructure.hasNamesFolder = true
                  assetStructure.isNested = true
               }

               if (filePath.includes('/fonts/')) {
                  assetStructure.hasFontsFolder = true
                  assetStructure.isNested = true
               }

               if (filePath.includes('/sprites/')) {
                  assetStructure.hasSpritesFolder = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/sprites/symbols/')) {
                  assetStructure.hasSymbolsFolder = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/sprites/mountains/')) {
                  assetStructure.hasMountainsFolder = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/sprites/trees/')) {
                  assetStructure.hasTreesFolder = true
                  assetStructure.isNested = true
               }

               if (filePath.includes('/textures/')) {
                  assetStructure.hasTexturesFolder = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/textures/ground')) {
                  assetStructure.hasGround = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/textures/boxes')) {
                  assetStructure.hasBoxes = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/textures/frames')) {
                  assetStructure.hasFrames = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/textures/paths')) {
                  assetStructure.hasPaths = true
                  assetStructure.isNested = true
               }
               if (filePath.includes('/textures/water')) {
                  assetStructure.hasWater = true
                  assetStructure.isNested = true
               }
            }


         },
         scrollToTop: () => {
            const options = {
               container: '#centerModuleWrapper',
               easing: 'ease-in',
               offset: -60,
               force: true,
               cancelable: true,
               onStart: function (element) {
                  // scrolling started
               },
               onDone: function (element) {
                  // scrolling is done
               },
               onCancel: function () {
                  // scrolling has been interrupted
               },
               x: false,
               y: true
            }

            this._vm.$scrollTo('#centerModuleWrapper', 500, options)
         },
      }


      const unpacking = {

         // 1 Read file and determine its details
         readZip: (filePath) => {


            // Open the file into stream
            zip = new StreamZip({
               file: filePath,
               storeEntries: true
            })

            // Throw and error
            zip.on('error', err => {
               console.log(err)
               utils.clearError()
            })

            // Run when the file is ready to be read
            zip.on('ready', () => {

               // This is used to assign only the first found
               let firstCheck = true

               // Inspect the whole folder structure of the package
               for (const entry of Object.values(zip.entries())) {

                  // Run only on directories
                  if (entry.isDirectory) {

                     // Save core path of the zip file in order to check for bad folder structure later
                     if (firstCheck === true) {
                        firstCheck = false

                        // Cut off the last "/" from the string
                        assetStructure.corePath = entry.name.slice(0, -1)
                     }

                     // Run each file path through conditions
                     utils.structureCheckCondition(entry.name)
                  }
               }

               // Check if the folder even has right formatting
               if (
                   assetStructure.hasNamesFolder
                   ||
                   assetStructure.hasFontsFolder
                   ||
                   (
                       assetStructure.hasSpritesFolder
                       &&
                       (
                           assetStructure.hasSymbolsFolder
                           ||
                           assetStructure.hasMountainsFolder
                           ||
                           assetStructure.hasTreesFolder
                       )
                   )
                   ||
                   (
                       assetStructure.hasTexturesFolder
                       &&
                       (
                           assetStructure.hasGround
                           ||
                           assetStructure.hasBoxes
                           ||
                           assetStructure.hasFrames
                           ||
                           assetStructure.hasPaths
                           ||
                           assetStructure.hasWater
                       )
                   )

               ) {

                  // Run normally if the structure looks fine
                  unpacking.unpackAssetCheck()

               }
               else {

                  // Ask user what to do if the structure DOESNT look alright
                  this._vm.$dialog
                      .confirm('The file doesnt seem to have the right Wonderdraft folder structure. Install anyway?',
                          {
                             okText: 'Install anyway',
                             cancelText: 'Cancel'
                          })
                      .then(() => {
                         // Make dead sure we dont unpack this directly to WD/assets... whatever this is
                         assetStructure.isNested = false
                         unpacking.unpackAssetCheck()

                      })
                      .catch(() => {
                         utils.clearAbort()
                         zip.close()
                      })
               }
            })
         },

         // 2 Check if it exists already
         unpackAssetCheck: () => {

            // Process the asset folder name from a zip
            const extension = path.extname(assetStructure.assetZipName)
            assetStructure.assetFolderName = path.basename(assetStructure.assetZipName, extension)

            // Create normal path and check if it already exists
            const assetFolderPath = assetsFolder + '/' + assetStructure.assetFolderName
            const assetFolderPathCore = assetsFolder + '/' + assetStructure.corePath
            let assetFolderPathExists = fs.existsSync(assetFolderPath)
            let assetFolderPathCoreExists = fs.existsSync(assetFolderPathCore)


            // If the asset exists, ask user what to do
            if (assetFolderPathExists || assetFolderPathCoreExists) {
               this._vm.$dialog
                   .confirm('The assets seems to be already installed. Overwrite?',
                       {
                          okText: 'Install & overwrite',
                          cancelText: 'Cancel'
                       })
                   .then(() => {

                      fs.removeSync(assetFolderPath)
                      setTimeout(() => {
                         unpacking.determinePackageMethod()
                      }, 250)

                   })
                   .catch((err) => {
                      utils.clearAbort()
                      zip.close()
                   })
            }
            else {
               // If it is a new file, proceed
               unpacking.determinePackageMethod()
            }

         },

         // 3 Check which out of the three package methods the asset uses
         determinePackageMethod: () => {

            // Method 1 package
            if (assetStructure.isNested && !assetStructure.isOverpacked) {
               unpacking.extractAsset('method1')
            }


            // Method 2 package
            if (!assetStructure.isNested && !assetStructure.isOverpacked) {
               fs.mkdirSync(assetsFolder + '/' + assetStructure.assetFolderName)
               unpacking.extractAsset('method2')
            }


            // Method 3 package
            if (assetStructure.isOverpacked) {
               const tempExtractFolder = assetsFolder + '/tempMKAsset'

               // If by some miracle the temp folder should exist, delete it first
               if (fs.existsSync(tempExtractFolder)) {
                  fs.removeSync(tempExtractFolder)

                  setTimeout(() => {
                     fs.mkdirSync(tempExtractFolder)
                     unpacking.extractAsset('method3')
                  }, 250)

               } else {
                  fs.mkdirSync(tempExtractFolder)
                  unpacking.extractAsset('method3')
               }
            }


         },

         // 4 Extract the actual asset
         extractAsset: (packageMethod) => {
            setTimeout(() => {

               let extractFolder = assetsFolder

               if (packageMethod === 'method1') extractFolder = assetsFolder

               if (packageMethod === 'method2') extractFolder = assetsFolder + '/' + assetStructure.assetFolderName

               if (packageMethod === 'method3') extractFolder = assetsFolder + '/tempMKAsset'

               zip.extract(null, extractFolder, (err, count) => {

                  zip.close()

                  if (err) {
                     console.log(err)
                     utils.clearError()
                  } else {

                     // Exit if method 1 or 2
                     if (assetStructure.isOverpacked === false) {

                        // If the asset was downloaded from CA, run merge
                        if (state.tempAssetData.newData && packageMethod === 'method1') unpacking.mergeCA(extractFolder + '/' + assetStructure.corePath)
                        if (state.tempAssetData.newData && packageMethod === 'method2') unpacking.mergeCA(extractFolder)


                        utils.clearSuccess()
                        ////TODO
                        //this.scrollTopTop()

                        // Refresh app
                        dispatch('enableApp')
                     }

                     // If method 3, proceed to cleanup
                     if (assetStructure.isOverpacked) {
                        unpacking.cleanupAssert()
                     }

                  }

               })


            }, 250);
         },

         // 4.1 Cleanup after 4 if using method 3
         cleanupAssert: () => {

            let innerFolder = false
            fs.readdirSync(assetsFolder + '/tempMKAsset/assets').forEach(checkedFile => {

               if (fs.lstatSync(assetsFolder + '/tempMKAsset/assets/' + checkedFile).isDirectory()) {
                  innerFolder = checkedFile
               }
            })

            // If the folder is badly packed and doesn't contain any directories inside
            if (!innerFolder) {
               utils.clearError()
               utils.deleteTempFolder()
               return false
            }

            // Check if the folder already exists
            if (fs.existsSync(assetsFolder + '/' + innerFolder)) {

               this._vm.$dialog
                   .confirm('The assets seems to be already installed. Overwrite?',
                       {
                          okText: 'Install & overwrite',
                          cancelText: 'Cancel'
                       })
                   .then(() => {

                      // Overwrite
                      fs.removeSync(assetsFolder + '/' + innerFolder)
                      setTimeout(() => {
                         try {
                            fs.copySync(
                                assetsFolder + '/tempMKAsset/assets/' + innerFolder,
                                assetsFolder + '/' + innerFolder)

                            // If the asset was downloaded from CA, run merge
                            if (state.tempAssetData.newData) unpacking.mergeCA()

                            utils.clearSuccess()
                            utils.deleteTempFolder()
                            //TODO
                            //this.scrollTopTop()

                            dispatch('enableApp')

                         } catch (err) {
                            utils.clearError()
                            utils.deleteTempFolder()
                            console.error(err)
                         }
                      }, 250)


                   }).catch(
                   (err) => {

                      // If user aborts
                      utils.clearAbort()
                      utils.deleteCATempFolder()
                      utils.deleteTempFolder()
                   })


            } else {
               setTimeout(() => {
                  try {
                     fs.copySync(
                         assetsFolder + '/tempMKAsset/assets/' + innerFolder,
                         assetsFolder + '/' + innerFolder)

                     utils.deleteTempFolder()
                     utils.structureCheckCondition()

                     // If the asset was downloaded from CA, run merge
                     if (state.tempAssetData.newData) unpacking.mergeCA(assetsFolder + '/' + innerFolder)

                     dispatch('enableApp')

                     //TODO
                     //this.scrollTopTop()

                  } catch (err) {
                     utils.clearError()
                     utils.deleteTempFolder()
                     utils.deleteCATempFolder()
                     console.error(err)
                  }
               }, 250)

            }


         },

         // 4.2 Cleanup CA temp folder and append data
         mergeCA: (assetFolderUnpack) => {

            let settingsJSON = {}
            if (fs.existsSync(assetFolderUnpack + '/mythKeeperSettings.json')) {

               settingsJSON = JSON.parse(fs.readFileSync(assetFolderUnpack + '/mythKeeperSettings.json', 'utf8'))

            }

            if (settingsJSON.vendors === undefined) settingsJSON.vendors = {}
            settingsJSON.vendors.cartographyassetsID = state.tempAssetData.vendors.cartographyassetsID
            settingsJSON.vendors.cartographyassetsVersion = state.tempAssetData.vendors.cartographyassetsVersion

            fs.writeFileSync(assetFolderUnpack + '/mythKeeperSettings.json', JSON.stringify(settingsJSON,null, 4))
            dispatch('updateRecentCAAsset', settingsJSON.vendors.cartographyassetsID)

            utils.deleteCATempFolder()

         },


      }


      // Start the function chain
      unpacking.readZip(filePath)


   },


   // Delete asset
   deleteAsset({commit, state, dispatch}, assetDir) {

      const assetPath = assetsFolder + '/' + assetDir
      const assetDeletedPath = assetsFolderDeleted + '/' + assetDir

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

      // Copy the new deleted backup
      try {
         fs.copySync(assetPath, assetDeletedPath + '/' + assetDir)
      } catch (err) {
         console.error(err)
      }

      // Copy the new backup
      zipFolder(assetDeletedPath, assetDeletedPath + '.zip', function (err) {
         if (err) {
            //console.log(err)
         } else {

            // Delete the folder
            fs.removeSync(assetPath)
            fs.removeSync(assetDeletedPath)

         }
      })
   }
   ,


// Backup functions Functions
   backupAsset({commit, state}, assetDir) {
      const assetPath = assetsFolder + '/' + assetDir
      const assetBackupPath = assetsFolderBackup + '/' + assetDir

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

      setTimeout(function () {
         // Copy the new backup
         try {
            fs.copySync(assetPath, assetBackupPath)
         } catch (err) {
            console.error(err)
         }
      }, 250)


   }
   ,
   backupAllAssets({commit, state, dispatch}) {

      // Backup all assets
      let i;
      for (i = 0; i < state.listAssetsFolders.length; i++) {
         const assetDir = state.listAssetsFolders[i]

         dispatch('backupAsset', assetDir);
      }

   }
   ,
   restoreBackupAsset({commit, state}, assetDir) {

      const assetPath = assetsFolder + '/' + assetDir
      const assetBackupPath = assetsFolderBackup + '/' + assetDir

      // Copy the new backup
      try {
         fs.copySync(assetBackupPath, assetPath)
      } catch (err) {
         console.error(err)
      }
   }
   ,
   deleteAssetBackup({commit, state, dispatch}, assetDir) {

      const assetBackupPath = assetsFolderBackup + '/' + assetDir
      const assetPathDeleted = assetsFolderDeleted + '/' + assetDir

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
         fs.copySync(assetBackupPath, assetPathDeleted + '/' + assetDir)
      } catch (err) {
         console.error(err)
      }

      zipFolder(assetPathDeleted, assetPathDeleted + '.zip', function (err) {
         if (err) {
            //console.log(err)
         } else {

            // Delete the folder
            fs.removeSync(assetBackupPath)
            fs.removeSync(assetPathDeleted)
         }
      })


   }
   ,

}

export default {
   state,
   mutations,
   actions,
   getters
}
