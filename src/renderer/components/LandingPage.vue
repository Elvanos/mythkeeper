<template>

    <div class="app">

        <div class="appGrid">
            <commandSidebar></commandSidebar>

            <appCommandLine></appCommandLine>

            <moduleCommandBar></moduleCommandBar>

            <moduleWrapper></moduleWrapper>


        </div>
    </div>


</template>

<script>
   import SystemInformation from './LandingPage/SystemInformation'
   import commandSidebar from './layout/commandSidebar'
   import appCommandLine from './layout/appCommandLine'
   import moduleCommandBar from './layout/moduleCommandBar'
   import moduleWrapper from './layout/moduleWrapper'


   export default {
      name: 'landing-page',
      components: {
         SystemInformation,
         commandSidebar,
         appCommandLine,
         moduleCommandBar,
         moduleWrapper

      },
      methods: {

      },
      created(){
         this.$store.dispatch('refreshAssetList')
         this.$store.dispatch('refreshAssetListBackup')
      }
   }
</script>

<style lang="sass">
    @import "../assets/sass/spritemap"
    @import "../assets/sass/htmlElements"
    @import "../assets/sass/tooltipPlugin"

</style>

<style lang="sass" scoped>
    .appGrid
        position: relative
        display: flex
        overflow: hidden
        height: 100vh

</style>
