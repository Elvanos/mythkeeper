<template>

    <div>
        <div class="subGrid">
            <div class="left">
                <topCommandLineButton
                        v-tooltip.bottom-end="`Add a new asset from CA`"
                        :disabled=false
                        :icon="`general-ca`"
                        :action="getCAList"
                        :text="`Cartography Assets client`"
                ></topCommandLineButton>
            </div>

            <div class="right">
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
        </div>


    </div>

</template>

<script>


   import topCommandLineButton from '../../layout/topCommandLine/topCommandLineButton'


   export default {
      name: 'assetsCL',
      components: {topCommandLineButton},
      methods: {

         getCAList: function () {
            this.$store.dispatch('setCurrentModuleCA', 'assetsCA')

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
         }
         ,
         restoreAssetLocal: function () {
            this.$store.dispatch('retrieveDeletedAsset')
         }
         ,

         addAssetLocal: function () {
            this.$store.dispatch('installNewAssetLocal')
         }

      }
   }
</script>

<style lang="sass" scoped>
    .subGrid
        display: flex
        justify-content: space-between
        width: calc(100% - 165px)
        align-content: center

        .left
            display: flex

            >*:first-child
                margin-left: -15px

        .right
            display: flex


</style>
