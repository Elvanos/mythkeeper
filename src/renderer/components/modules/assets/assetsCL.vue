<template>

    <div>

        <!--<topCommandLineButton
                v-tooltip.bottom-end="`Get CA List`"
                :disabled=false
                :icon="`general-add`"
                :action="getCAList"
        ></topCommandLineButton>-->

        <topCommandLineButton
                v-tooltip.bottom-end="`Add a new asset from local file`"
                :disabled=false
                :icon="`general-add`"
                :action="addAssetLocal"
        ></topCommandLineButton>

        <topCommandLineButton
                v-tooltip.bottom-end="`Backup all assets`"
                :disabled=false
                :icon="`general-join`"
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
         getCAList: function () {

            this.$http.get("https://www.cartographyassets.com/api/index.php?resources/").then((response) => {
               console.log(response.data)
            })


         },
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
         addAssetLocal: function () {
            const userDesktop = remote.app.getPath('desktop')
            const userDataFolder = remote.app.getPath('appData')
            let isNested = false

            const fileOpenOptions = {
               defaultPath: userDesktop,
               openFile: true,
               openDirectory: false,
               multiSelections: false,
               filters: [
                  {name: "Asset packages", extensions: ["zip"]},
               ],
            }


            this.$store.dispatch('disableApp')
                .then(() => {

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

                   const unpackAsset = (assetFolder, zip, unpackPath) => {

                      setTimeout(() => {

                         if (isNested) {
                            assetFolder = userDataFolder + '/Wonderdraft/assets/'
                         } else {
                            fs.mkdirSync(assetFolder)
                         }


                         zip.extract(null, assetFolder, (err, count) => {

                            zip.close()

                            if (err) {
                               console.log(err)
                               errorFunction()
                            } else {
                               successFunction(true)
                               this.scrollTopTop()
                               this.$store.dispatch('enableApp')
                            }

                         })
                      }, 250);

                   }


                   const unpackAssetCheck = (assetName, zip, corePath, isNested) => {
                      const extension = path.extname(assetName)
                      assetName = path.basename(assetName, extension)

                      const assetFolder = userDataFolder + '/Wonderdraft/assets/' + assetName

                      corePath = corePath.slice(0, -1)
                      const comparePath = path.dirname(assetFolder) + '/' + corePath

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
                                      unpackAsset(comparePath, zip, 'core')
                                   }, 250)

                                }

                                if (assetFolderExists || isNested === false) {
                                   fs.removeSync(assetFolder)
                                   setTimeout(() => {
                                      unpackAsset(assetFolder, zip, 'assets')
                                   }, 250)
                                }

                             })
                             .catch((err) => {
                                abortFunction(assetFolder, zip, assetFolderExists, 'assets')
                                zip.close()
                             })

                      }
                      else {
                         unpackAsset(assetFolder, zip)
                      }

                   }

                   dialog.showOpenDialog(fileOpenOptions, (fileNames) => {
                      if (fileNames === undefined) {
                         successFunction(false)
                         return
                      }

                      const zip = new StreamZip({
                         file: fileNames[0],
                         storeEntries: true
                      })

                      zip.on('error', err => {
                         errorFunction()
                      })


                      zip.on('ready', () => {

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

                         for (const entry of Object.values(zip.entries())) {

                            let filePath = entry.name

                            if (firstCheck === 0) {
                               firstCheck++
                               assetStructure.corePath = entry.name
                            }


                            //if (filePath.includes('mythKeeperSettings.json')) assetStructure.hasMetaFile = true

                            if (filePath.includes('font')) assetStructure.hasFontsFolder = true

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


                            if (filePath.includes('/font/')) {
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

                            /*const desc = entry.isDirectory ? ' directory' : ` file`
                            console.log(`Entry ${entry.name}: ${desc}`)*/
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
                            unpackAssetCheck(fileNames[0], zip, assetStructure.corePath, isNested)
                         }
                         else {
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
