<template>

    <div>

        <topCommandLineButton
                v-tooltip.bottom-end="`Restore deleted asset`"
                :disabled=false
                :icon="`general-trash`"
                :action="restoreAssetLocal"
        ></topCommandLineButton>

        <topCommandLineButton
                v-tooltip.bottom-end="`Add a new asset from local file`"
                :disabled=false
                :icon="`menu-articles-add2`"
                :action="addAssetLocal"
        ></topCommandLineButton>

        <topCommandLineButton
                v-tooltip.bottom-end="`Backup all assets`"
                :disabled=false
                :icon="`menu-media-archive`"
                :confirmMessage="`
                This will overwrite backed up assets with the current active iteration*. Proceed?
                <br><br>
                * assets that are only backups with no active iteration will be left alone
                `"
                :action="backupAllAssets"
        ></topCommandLineButton>

        <topCommandLineButton
                v-tooltip.bottom-end="`Refresh app. <br> Use only if the list of assets isnt properly syncing`"
                :disabled=false
                :icon="`general-refresh`"
                :action="refreshAssets"
        ></topCommandLineButton>

    </div>

</template>

<script>

   import {remote} from 'electron'


   const path = require("path")
   const {dialog} = require('electron').remote;
   const fs = require('fs-extra')
   const StreamZip = require('node-stream-zip')

   import topCommandLineButton from '../../layout/topCommandLine/topCommandLineButton'


   export default {
      name: 'assetsCL',
      components: {topCommandLineButton},
      methods: {
         scrollTopTop: function () {
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

            this.$scrollTo('#centerModuleWrapper', 500, options)
         },

         // TODO
         getCAList: function () {

            this.$http.get("https://www.cartographyassets.com/api/index.php?resources/").then((response) => {
               console.log(response.data)
            })


         },
         // TODO

         backupAllAssets: function () {
            this.$store.dispatch('disableApp')
            setTimeout(() => {

               this.$store.dispatch('backupAllAssets').then(
                   () => {
                      this.$store.dispatch('enableApp')
                   }).then(
                   () => {
                      this.$awn.success("All assets successfully backed up")
                   })
            }, 50)
         },
         refreshAssets: function () {
            remote.getCurrentWindow().reload()
         },
         restoreAssetLocal: function () {
            this.addAssetLocal(true)
         },

         addAssetLocal: function (isRetrieving) {
            let userDesktop = remote.app.getPath('desktop')
            const userDataFolder = remote.app.getPath('appData')

            // In case the asset is packed without a wrapping directory around it
            let isNested = false

            // In case the asset is packed with an extra directory over it (damn you Nex for making me do this! T_T)
            let isOverpacked = false

            if (isRetrieving === true) userDesktop = this.$store.getters.getAssetsFolderDeleted

            userDesktop = userDesktop.replace(/\//g, "\\")

            console.log(userDesktop)

            const fileOpenOptions = {
               title: 'Select packed asset to install',
               defaultPath: userDesktop,
               openFile: true,
               openDirectory: false,
               multiSelections: false,
               filters: [
                  {name: "Asset packages", extensions: ["zip"]},
               ],
            }

            const assetStructure = {
               hasMetaFile: false,
               corePath: '',

               hasFontsFolder: false,

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

            let firstCheck = 0

            const clearTempFolder = () => {
               setTimeout(() => {
                  if (fs.existsSync(this.$store.getters.getAssetsFolder + '/tempMKAsset')) {
                     fs.removeSync(this.$store.getters.getAssetsFolder + '/tempMKAsset')
                  }


               }, 250)
            }

            const successFunction = (wasAdded) => {
               this.$store.dispatch('enableApp')
                   .then(() => {
                      if (wasAdded) {
                         this.$awn.success("Asset successfully added")
                      }

                   })
            }

            const abortFunction = () => {
               this.$store.dispatch('enableApp')
                   .then(() => {
                      this.$awn.warning("Asset adding aborted")

                   })
            }

            const errorFunction = () => {
               this.$store.dispatch('enableApp')
                   .then(() => {
                      this.$awn.error("Error reading the file. Something is wrong with it.")
                   })
            }


            const cleanupAssert = (assetFolder) => {

               console.log(assetFolder)
               let innerFolder = false
               fs.readdirSync(assetFolder + '/assets').forEach(file => {

                  if (fs.lstatSync(assetFolder + '/assets/' + file).isDirectory()) {
                     innerFolder = file
                     console.log(innerFolder)
                  }
               })

               // If the folder is badly packed
               if (!innerFolder) {
                  errorFunction()
                  clearTempFolder()
                  return false
               }

               if (fs.existsSync(this.$store.getters.getAssetsFolder + '/' + innerFolder)) {

                  this.$dialog
                      .confirm('The assets seems to be already installed. Overwrite?',
                          {
                             okText: 'Install & overwrite',
                             cancelText: 'Cancel'
                          })
                      .then(() => {
                         setTimeout(() => {
                            try {
                               fs.copySync(this.$store.getters.getAssetsFolder + '/tempMKAsset/assets/' + innerFolder, this.$store.getters.getAssetsFolder + '/' + innerFolder)
                            } catch (err) {
                               console.error(err)
                            }
                         }, 250)
                         successFunction(true)
                         clearTempFolder()
                         this.scrollTopTop()
                         this.$store.dispatch('enableApp')
                      }).catch((err) => {
                     abortFunction()
                     clearTempFolder()
                  })


               } else {
                  setTimeout(() => {
                     try {
                        fs.copySync(this.$store.getters.getAssetsFolder + '/tempMKAsset/assets/' + innerFolder, this.$store.getters.getAssetsFolder + '/' + innerFolder)
                     } catch (err) {
                        console.error(err)
                     }
                  }, 250)
                  successFunction(true)
                  this.scrollTopTop()
                  this.$store.dispatch('enableApp')
                  clearTempFolder()
               }


            }

            const unpackAsset = (assetFolder, zip) => {

               if (isNested) {
                  assetFolder = userDataFolder + '/Wonderdraft/assets/'
               }
               if (!isNested && !isOverpacked) {
                  fs.mkdirSync(assetFolder)
               }

               if (isOverpacked) {

                  assetFolder = userDataFolder + '/Wonderdraft/assets/tempMKAsset'


                  if (fs.existsSync(userDataFolder + '/Wonderdraft/assets/tempMKAsset')) {
                     fs.removeSync(userDataFolder + '/Wonderdraft/assets/tempMKAsset')
                     setTimeout(() => {
                        fs.mkdirSync(userDataFolder + '/Wonderdraft/assets/tempMKAsset')
                        extractAsset(zip, assetFolder)
                     }, 250);
                     return false
                  } else {
                     fs.mkdirSync(userDataFolder + '/Wonderdraft/assets/tempMKAsset')
                     extractAsset(zip, assetFolder)
                     return false
                  }
               }
               extractAsset(zip, assetFolder)
            }

            const extractAsset = (zip, assetFolder) => {
               setTimeout(() => {


                  zip.extract(null, assetFolder, (err, count) => {

                     zip.close()

                     if (err) {
                        console.log(err)
                        errorFunction()
                     } else {
                        if (isOverpacked === false) {
                           successFunction(true)
                           this.scrollTopTop()
                           this.$store.dispatch('enableApp')
                        }

                        if (isOverpacked) {
                           cleanupAssert(assetFolder)
                        }

                     }

                  })


               }, 250);
            }


            const unpackAssetCheck = (assetName, zip) => {
               const extension = path.extname(assetName)
               assetName = path.basename(assetName, extension)

               const assetFolder = userDataFolder + '/Wonderdraft/assets/' + assetName

               assetStructure.corePath = assetStructure.corePath.slice(0, -1)
               const comparePath = path.dirname(assetFolder) + '/' + assetStructure.corePath

               let compareFolderExists = fs.existsSync(comparePath)
               let assetFolderExists = fs.existsSync(assetFolder)

               if (comparePath === assetFolder) compareFolderExists = false


               if (compareFolderExists || assetFolderExists) {
                  this.$dialog
                      .confirm('The assets seems to be already installed. Overwrite?',
                          {
                             okText: 'Install & overwrite',
                             cancelText: 'Cancel'
                          })
                      .then(() => {

                         if (compareFolderExists && isNested === true) {
                            fs.removeSync(comparePath)
                            setTimeout(() => {
                               unpackAsset(comparePath, zip)
                            }, 250)

                         }

                         if (assetFolderExists || isNested === false) {
                            fs.removeSync(assetFolder)
                            setTimeout(() => {
                               unpackAsset(assetFolder, zip)
                            }, 250)
                         }

                      })
                      .catch((err) => {
                         abortFunction(assetFolder, zip, assetFolderExists)
                         zip.close()
                      })

               }
               else {
                  unpackAsset(assetFolder, zip)
               }

            }

            this.$store.dispatch('disableApp')
                .then(() => {

                   dialog.showOpenDialog(fileOpenOptions, (fileNames) => {

                      // If no file gets select, silently close down
                      if (fileNames === undefined) {
                         successFunction(false)
                         return
                      }

                      // Open the file into stream
                      const zip = new StreamZip({
                         file: fileNames[0],
                         storeEntries: true
                      })

                      // Throw and error
                      zip.on('error', err => {
                         errorFunction()
                      })


                      // Run when the file is ready to be read
                      zip.on('ready', () => {

                         // Inspect the whole folder structure of the
                         for (const entry of Object.values(zip.entries())) {

                            // Run only on directories
                            if (entry.isDirectory) {
                               let filePath = entry.name

                               // Save core path of the zip file in order to check for bad folder structure later
                               if (firstCheck === 0) {
                                  firstCheck++
                                  assetStructure.corePath = entry.name
                               }

                               //if (filePath.includes('mythKeeperSettings.json')) assetStructure.hasMetaFile = true

                               if (filePath.includes('fonts/')) assetStructure.hasFontsFolder = true

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
                                  isOverpacked = true
                               }

                               if (filePath.includes('/fonts/')) {
                                  assetStructure.hasFontsFolder = true
                                  isNested = true
                               }

                               if (filePath.includes('/sprites/')) {
                                  assetStructure.hasSpritesFolder = true
                                  isNested = true
                               }
                               if (filePath.includes('/sprites/symbols/')) {
                                  assetStructure.hasSymbolsFolder = true
                                  isNested = true
                               }
                               if (filePath.includes('/sprites/mountains/')) {
                                  assetStructure.hasMountainsFolder = true
                                  isNested = true
                               }
                               if (filePath.includes('/sprites/trees/')) {
                                  assetStructure.hasTreesFolder = true
                                  isNested = true
                               }

                               if (filePath.includes('/textures/')) {
                                  assetStructure.hasTexturesFolder = true
                                  isNested = true
                               }
                               if (filePath.includes('/textures/ground')) {
                                  assetStructure.hasGround = true
                                  isNested = true
                               }
                               if (filePath.includes('/textures/boxes')) {
                                  assetStructure.hasBoxes = true
                                  isNested = true
                               }
                               if (filePath.includes('/textures/frames')) {
                                  assetStructure.hasFrames = true
                                  isNested = true
                               }
                               if (filePath.includes('/textures/paths')) {
                                  assetStructure.hasPaths = true
                                  isNested = true
                               }
                               if (filePath.includes('/textures/water')) {
                                  assetStructure.hasWater = true
                                  isNested = true
                               }
                            }


                         }

                         // Check if the folder even has right formatting
                         if (
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
                            unpackAssetCheck(fileNames[0], zip, assetStructure.corePath, isNested)
                         }
                         else {
                            // Ask user what to do if the structure DOESNT look alright
                            this.$dialog
                                .confirm('The file doesnt seem to have the right Wonderdraft folder structure. Install anyway?',
                                    {
                                       okText: 'Install anyway',
                                       cancelText: 'Cancel'
                                    })
                                .then(() => {
                                   isNested = false
                                   unpackAssetCheck(fileNames[0], zip, assetStructure.corePath, isNested)

                                })
                                .catch(() => {
                                   abortFunction()
                                   zip.close()
                                })
                         }

                      })

                   })


                })
         }

      }
   }
</script>

<style lang="sass" scoped>


</style>
