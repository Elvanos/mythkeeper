<template>

    <div class="assetGrid">

        <assetMiniature
                v-for="(singleAssetFolder) in folderList" :key="`singleAssetFolder-${singleAssetFolder}`"
                :folder="singleAssetFolder">

        </assetMiniature>

    </div>


</template>

<script>

   import assetMiniature from './subparts/assetMiniature'

   export default {
      name: 'assets',
      components: {assetMiniature},
      mounted: function () {
          this.refreshList()
      },
      data: function(){
         return{
         }
      },
      computed: {
         folderList(){
             return this.$store.getters.getAssetListCombined
         }
      },
      methods: {
         refreshList(){
            this.$store.dispatch('refreshAssetListCombined')
         }
      }

   }
</script>

<style lang="sass" scoped>
    .assetGrid
        display: flex
        flex-wrap: wrap
        justify-content: flex-start

</style>
