<template>

    <div>

        <commandBarButton
                v-tooltip.bottom-end="`Add a new asset from local file`"
                :disabled=false
                commandIcon="general-add"
                :action="addAssetLocal"
        ></commandBarButton>

        <commandBarButton
                v-tooltip.bottom-end="`Backup all assets`"
                :disabled=false
                commandIcon="general-join"
                :confirmMessage="`
                This will overwrite backed up assets with the current active iteration*. Proceed?
                <br><br>
                * assets that are only backups with no active iteration will be left alone
                `"
                :action="backupAllAssets"
        ></commandBarButton>

        <commandBarButton
                v-tooltip.bottom-end="`Refresh asset list`"
                :disabled=false
                commandIcon="general-refresh"
                :action="refreshAssets"
        ></commandBarButton>

    </div>

</template>

<script>

   import {remote} from 'electron'

   const path = require("path")
   const {dialog} = require('electron').remote;
   const fs = require('fs-extra')
   const StreamZip = require('node-stream-zip')

   import commandBarButton from '../../layout/subparts/commandBarButton'


   export default {
      name: 'assetsCL',
      components: {commandBarButton},
      computed: {},
      methods: {
         backupAllAssets: function () {
            this.$store.dispatch('setAppStatusDisabled')
            setTimeout(() => {

               this.$store.dispatch('backupAllAssets').then(
                   () => {
                      this.$store.dispatch('setAppStatusEnabled')
                   }).then(
                   () => {
                      this.$awn.success("All assets successfully backed up")
                   })
            }, 50)
         },
         refreshAssets: function (event) {
            this.$store.dispatch('setAppStatusDisabled')
                .then(() => {
                   this.$store.dispatch('refreshAssetListCombined')
                       .then(() => {
                          this.$store.dispatch('setAppStatusEnabled')
                              .then(() => {
                                 this.$awn.success("Asset list reloaded")
                              })
                       })
                })
         },
         addAssetLocal: function (event) {
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


            this.$store.dispatch('setAppStatusDisabled')
                .then(() => {

                   const successFunction = (wasAdded) => {
                      this.$store.dispatch('setAppStatusEnabled')
                          .then(() => {
                             if (wasAdded) {
                                this.$awn.success("Asset successfully added")
                             }

                          })
                   }

                   const abortFunction = () => {
                      this.$store.dispatch('setAppStatusEnabled')
                          .then(() => {
                             this.$awn.warning("Asset adding aborted")

                          })
                   }

                   const errorFunction = () => {
                      this.$store.dispatch('setAppStatusEnabled')
                          .then(() => {
                             this.$awn.error("Error reading the file. Something is wrong with it.")
                          })
                   }

                   const unpackAsset = (assetFolder, zip) => {

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
                               this.$store.dispatch('setAppStatusDisabled')
                                   .then(() => {
                                      this.$store.dispatch('refreshAssetListCombined')
                                          .then(() => {
                                             this.$store.dispatch('setAppStatusEnabled')
                                          })
                                   })
                            }

                         })
                      }, 250);

                   }


                   const unpackAssetCheck = (assetName, zip) => {
                      const extension = path.extname(assetName)
                      assetName = path.basename(assetName, extension)

                      const assetFolder = userDataFolder + '/Wonderdraft/assets/' + assetName


                      if (fs.existsSync(assetFolder)) {
                         this.$dialog
                             .confirm('The assets seems to be already installed. Overwrite?',
                                 {
                                    okText: 'Install & overwrite',
                                    cancelText: 'Cancel'
                                 })
                             .then(() => {
                                fs.removeSync(assetFolder)
                                unpackAsset(assetFolder, zip)

                             })
                             .catch((err) => {
                                abortFunction(assetFolder, zip)
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


                         for (const entry of Object.values(zip.entries())) {

                            let filePath = entry.name

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
                            unpackAssetCheck(fileNames[0], zip)
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
                                   unpackAssetCheck(fileNames[0], zip)

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
