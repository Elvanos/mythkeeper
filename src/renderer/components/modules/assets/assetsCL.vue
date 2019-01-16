<template>

    <div>

        <commandBarButton
                title="Refresh asset list"
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
         refreshAssets: function (event) {

            console.log('fetching')
            // Dont trigger if disabled
            if (!event.target.classList.contains('disabled')) {

               this.$store.dispatch('refreshAssetList')


            }
         }

      }
   }
</script>

<style lang="sass" scoped>


</style>
