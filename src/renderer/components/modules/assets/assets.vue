<template>

    <div class="assetGrid">

        <assetMiniature
                v-for="singleAssetFolder in composedList"
                :key="`singleAssetFolder-${singleAssetFolder.folderName}-${singleAssetFolder.status}`"

                :folder="singleAssetFolder.folderName"
                :status="singleAssetFolder.status"
                :postLoadAdded="singleAssetFolder.postLoadAdded"
                :config="singleAssetFolder.config"

        />

    </div>


</template>

<script>
   // Components
   import assetMiniature from './subparts/assetMiniature'

   // NPM packages
   const fs = require('fs-extra')
   const path = require('path')
   const chokidar = require('chokidar')

   export default {
      name: 'assets',
      components: {assetMiniature},
      mounted() {
         this.watchAssetsDirectory()
         this.watchAssetsDirectoryBackup()
      },
      beforeDestroy() {

         // Stop all watchers
         this.watcherAssetDirectory.close()
      },
      data: function () {
         return {
            userDataFolderPath: this.$store.getters.getUserDataFolder,
            assetsFolderPath: this.$store.getters.getAssetsFolder,
            assetsFolderPathMKBackup: this.$store.getters.getAssetsFolderBackup,
            watcherAssetDirectory: null,
            watcherAssetDirectoryMKBackup: null,
            firstTimeSort: true,
            folderList: [],
            folderListBackup: [],
            composedList: []
         }
      },
      methods: {
         // List manager
         refreshList() {

            // Start with active assets
            let composedList = []

            let activeAssets = this.folderList
            let backupAssets = this.folderListBackup


            // Stack overflow! Compares two arrays and returns difference
            /*
                var onlyInA = a.filter(comparer(b));
                var onlyInB = b.filter(comparer(a));
            */
            function comparer(otherArray) {
               return function (current) {
                  return otherArray.filter(function (other) {
                     return other.folderName === current.folderName
                  }).length === 0
               }
            }

            // Check which assets are extra in the backup
            let difBackupAssets = backupAssets.filter(comparer(activeAssets))

            // Add extra backup assets to the list
            composedList = activeAssets.concat(difBackupAssets)

            this.composedList = composedList

            // Update globals with config info
            this.$store.dispatch('updateAssetListData', composedList.map(asset => {
               let returnValue = asset.config
               if (asset.config !== false && asset.status !== undefined) {
                  asset.config.status = asset.status
               }
               return returnValue
            }))

            //console.log("Composed list")
            //console.log(this.composedList)


         },

         // Config file methods
         removeConfigFile(configFilePath, status) {
            const assetFolderName = path.dirname(configFilePath)


            const pairedAsset = this.composedList.filter(asset => (asset.folderName === assetFolderName))
            if (pairedAsset[0].status === status) {
               pairedAsset[0].config = false
            }


            this.refreshList()
         },
         appendConfigFile(configFilePath, status) {
            const assetFolderName = path.dirname(configFilePath)
            if (status === 'normal') configFilePath = this.assetsFolderPath + '/' + configFilePath
            if (status === 'backup') configFilePath = this.assetsFolderPathMKBackup + '/' + configFilePath

            let configFileContent

            if (fs.existsSync(configFilePath) && path.basename(configFilePath) === 'mythKeeperSettings.json') {

               setTimeout(() => {

                  try {
                     configFileContent = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
                  } catch(e) {
                     console.error(e)

                     this.$awn.alert(`Error at: ${configFilePath} <br> ${e}`)

                     return
                  }



                  if (status === 'normal') {
                     const pairedAsset = this.folderList.filter(asset => (asset.folderName === assetFolderName))
                     if (pairedAsset[0] !== undefined) {
                        pairedAsset[0].config = configFileContent
                        this.refreshList()
                     }
                  }
                  if (status === 'backup') {

                     const pairedAsset = this.folderListBackup.filter(asset => (asset.folderName === assetFolderName))
                     if (pairedAsset[0] !== undefined) {
                        pairedAsset[0].config = configFileContent
                        this.refreshList()
                     }
                  }


               }, 250)

            }


         },

         // Watcher methods
         watchAssetsDirectory() {
            const configPath = this.assetsFolderPath

            // Count starting folders
            const starterFoldersLength = [
               fs.readdirSync(configPath).length,

            ]
            let checkLength = 1

            const watcherOptions = {
               persistent: true,
               depth: 2,
               cwd: configPath,
               ignorePermissionErrors: true,
               ignored: [
                  '**/**/sprites',
                  '**/**/mountains',
                  '**/**/symbols',
                  '**/**/trees',

                  '**/**/textures',
                  '**/**/ground',
                  '**/**/boxes',
                  '**/**/frames',
                  '**/**/paths',
                  '**/**/water',

                  '**/**/fonts',

                  '**/**/names',

                  '**/**/metafiles',
                  '**/**/_mkDisabled',

                  '**/tempMKAsset',
                  '**/tempMKDownload'


               ],
            }
            this.watcherAssetDirectory = chokidar.watch(configPath, watcherOptions)

            this.watcherAssetDirectory.on('add', path => {
               //console.log(`File ${path} has been added`)
               this.appendConfigFile(path, 'normal')
            })
            this.watcherAssetDirectory.on('change', path => {
               this.appendConfigFile(path, 'normal')
               //console.log(`File ${path} has been changed`)
            })
            this.watcherAssetDirectory.on('unlink', path => {
               this.removeConfigFile(path, 'normal')
            })


            this.watcherAssetDirectory.on('addDir', path => {


               // Glitch while overwriting folders - reload the config file manually
               setTimeout(() => {
                  if (fs.existsSync(configPath + '/' + path + '/mythKeeperSettings.json')) {
                     this.appendConfigFile(path + '\\mythKeeperSettings.json', 'normal')
                  }
               }, 250)


               if (path !== '') {

                  if (checkLength > starterFoldersLength[0]) {
                     // Add items a first AFTER load
                     this.folderList.unshift(
                         {
                            folderName: path,
                            status: 'normal',
                            postLoadAdded: true,
                            config: false
                         }
                     )

                     const folderListPaths = this.folderList.map(function (item, index) {
                        return item.folderName
                     });

                     this.$store.dispatch('updateAssetList', this.folderListPaths)
                     this.refreshList()
                  } else {
                     // Add items on first load
                     checkLength++
                     this.folderList.push(
                         {
                            folderName: path,
                            status: 'normal',
                            postLoadAdded: false,
                            config: false

                         }
                     )
                     const folderListPaths = this.folderList.map(function (item, index) {
                        return item.folderName
                     })
                     this.$store.dispatch('updateAssetList', folderListPaths)
                     this.refreshList()
                  }
               }


            })
            this.watcherAssetDirectory.on('unlinkDir', path => {

               setTimeout(() => {
                  this.folderList = this.folderList.filter(item => item.folderName !== path)
                  //console.log(`Directory ${path} has been removed`)
                  const folderListPaths = this.folderList.map(function (item, index) {
                     return item.folderName
                  })
                  this.$store.dispatch('updateAssetList', folderListPaths)
                  this.refreshList()

               }, 250)
            })


         },
         watchAssetsDirectoryBackup() {
            const configPath = this.assetsFolderPathMKBackup

            // Count starting folders
            const starterFoldersLength = [
               fs.readdirSync(configPath).length,

            ]
            let checkLength = 1

            const watcherOptions = {
               persistent: true,
               depth: 2,
               cwd: configPath,
               ignorePermissionErrors: true,
               ignored: [
                  '**/**/sprites',
                  '**/**/mountains',
                  '**/**/symbols',
                  '**/**/trees',

                  '**/**/textures',
                  '**/**/ground',
                  '**/**/boxes',
                  '**/**/frames',
                  '**/**/paths',
                  '**/**/water',

                  '**/**/fonts',

                  '**/**/names',

                  '**/**/metafiles',
                  '**/**/_mkDisabled',

                  '**/tempMKAsset',
                  '**/tempMKDownload'



               ],
            }
            this.watcherAssetDirectoryMKBackup = chokidar.watch(configPath, watcherOptions)


            this.watcherAssetDirectoryMKBackup.on('add', path => {
               //console.log(`File ${path} has been added`)
               this.appendConfigFile(path, 'backup')
            })
            this.watcherAssetDirectoryMKBackup.on('change', path => {
               //console.log(`File ${path} has been changed`)
               this.appendConfigFile(path, 'backup')
            })
            this.watcherAssetDirectoryMKBackup.on('unlink', path => {
               //console.log(`File ${path} has been removed`)
               this.removeConfigFile(path, 'backup')
            })

            this.watcherAssetDirectoryMKBackup.on('addDir', path => {

               //console.log(`Directory ${path} has been added`)

               if (path !== '') {
                  if (checkLength > starterFoldersLength) {
                     // Add items a first AFTER load
                     this.folderListBackup.unshift(
                         {
                            folderName: path,
                            status: 'backup',
                            postLoadAdded: true,
                            config: false

                         }
                     )

                     const folderListPaths = this.folderListBackup.map(function (item, index) {
                        return item.folderName
                     });

                     this.$store.dispatch('updateAssetListBackup', folderListPaths)
                     this.refreshList()
                  } else {
                     // Add items on first load
                     checkLength++
                     this.folderListBackup.push(
                         {
                            folderName: path,
                            status: 'backup',
                            postLoadAdded: false,
                            config: false

                         }
                     )
                     const folderListPaths = this.folderListBackup.map(function (item, index) {
                        return item.folderName
                     });

                     this.$store.dispatch('updateAssetListBackup', folderListPaths)
                     this.refreshList()
                  }
               }


            })
            this.watcherAssetDirectoryMKBackup.on('unlinkDir', path => {

               setTimeout(() => {
                  //console.log(`Directory ${path} has been removed`)
                  this.folderListBackup = this.folderListBackup.filter(item => item.folderName !== path)

                  const folderListPaths = this.folderListBackup.map(function (item, index) {
                     return item.folderName
                  });

                  this.$store.dispatch('updateAssetListBackup', folderListPaths)
                  this.refreshList()
               }, 250)
            })


         },

      }

   }
</script>

<style lang="sass" scoped>
    .assetGrid
        display: flex
        flex-wrap: wrap
        justify-content: flex-start

</style>
