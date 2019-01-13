<template>

    <div class="app">

        <div class="appGrid">
            <commandSidebar></commandSidebar>


            <appCommandLine></appCommandLine>

        </div>
    </div>


</template>

<script>
   import SystemInformation from './LandingPage/SystemInformation'
   import commandSidebar from './layout/commandSidebar'
   import appCommandLine from './layout/appCommandLine'


   export default {
      name: 'landing-page',
      components: {
         SystemInformation,
         commandSidebar,
         appCommandLine
      },
      methods: {
         open(link) {
            this.$electron.shell.openExternal(link)
         }
      }
   }
</script>

<style lang="sass">
    @import "../assets/sass/htmlElements"
</style>

<style lang="sass" scoped>
    .appGrid
        position: relative
        display: flex
        overflow: hidden
        height: 100vh

</style>
