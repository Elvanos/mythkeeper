<template>

    <div>

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
         }

      }
   }
</script>

<style lang="sass" scoped>


</style>
