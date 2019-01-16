<template>

    <div class="assetGrid">

        <assetMiniature
                v-for="(singleAssetFolder, index) in folderList" :key="`singleAssetFolder-${index}`"

                :folder="singleAssetFolder">
        </assetMiniature>

    </div>


</template>

<script>

   import assetMiniature from './subparts/assetMiniature'

   export default {
      name: 'assets',
      components: {assetMiniature},
      computed: {
         folderList() {
            return this.$store.getters.getAssetList
         }
      },
      methods: {}

   }
</script>

<style lang="sass" scoped>
    .assetGrid
        display: flex
        flex-wrap: wrap
        justify-content: flex-start

</style>
