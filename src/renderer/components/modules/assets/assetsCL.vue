<template>

    <div>

        <!--<topCommandLineButton
                v-tooltip.bottom-end="`Add a new asset from CA`"
                :disabled=false
                :icon="`general-basket`"
                :action="getCAList"
        ></topCommandLineButton>-->


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
                v-tooltip.bottom-end="`Restore deleted asset`"
                :disabled=false
                :icon="`general-trash`"
                :action="restoreAssetLocal"
        ></topCommandLineButton>


    </div>

</template>

<script>


   import topCommandLineButton from '../../layout/topCommandLine/topCommandLineButton'


   export default {
      name: 'assetsCL',
      components: {topCommandLineButton},
      methods: {


         // TODO
         getCAList: function () {

            const CAIDlist = {

               // Wonderdraft
               themes: [48],

               // Mapforge
               mapforge: [63],

               // Photoshop
               photoshop: [6],

               // Battlemaps
               battlemaps: [69,70,71]


            }

            this.$http.get("https://www.cartographyassets.com/api/index.php?resources&limit=100000").then((response) => {

               let assetList = response.data.resources

               // Filter out themes
               assetList = assetList.filter(singleAsset => (

                   !CAIDlist.themes.includes(singleAsset.resource_category_id)
                   &&
                   !CAIDlist.battlemaps.includes(singleAsset.resource_category_id)
                   &&
                   !CAIDlist.mapforge.includes(singleAsset.resource_category_id)
                   &&
                   !CAIDlist.photoshop.includes(singleAsset.resource_category_id)

               ))


               console.log(assetList)


               assetList.forEach(singleAsset => {
                  console.log(singleAsset.resource_title + ', v: ' + singleAsset.resource_version)
                  console.log(singleAsset.creator_username)

                  console.log(' ')

               })

            })


            // Category function for the future, if needed
            /*this.$http.get(" https://www.cartographyassets.com/api/index.php?resource-categories/").then((response) => {
            })*/




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
         restoreAssetLocal: function () {
            this.$store.dispatch('retrieveDeletedAsset')
                     },

         addAssetLocal: function (){
            this.$store.dispatch('installNewAssetLocal')
         }

      }
   }
</script>

<style lang="sass" scoped>


</style>
