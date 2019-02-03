<template>

    <div class="app">

        <div class="overlays">
            <multiFileOverlay></multiFileOverlay>
            <imageZoom></imageZoom>
            <disableOverlay></disableOverlay>
            <caOverlay></caOverlay>
        </div>


        <landingHelpComponent v-if="isOpened"></landingHelpComponent>

        <div class="appGrid" :class="[{isDisabled: appStatus === false}]">
            <sidebar></sidebar>

            <topCommandLine></topCommandLine>

            <centerModuleWrapper></centerModuleWrapper>


        </div>


    </div>


</template>

<script>

   // Help page
   import landingHelpComponent from './landingHelpComponent/landingHelpComponent'

   // Overlays
   import imageZoom from './layout/overlays/imageZoom'
   import disableOverlay from './layout/overlays/disableOverlay'
   import caOverlay from './layout/overlays/caOverlay'
   import multiFileOverlay from './layout/overlays/multiFileOverlay'

   // Template parts
   import sidebar from './layout/sidebar'
   import topCommandLine from './layout/topCommandLine'
   import centerModuleWrapper from './layout/centerModuleWrapper'


   export default {
      name: 'appWrapper',
      data: function () {
         return {}
      },
      computed: {
         isOpened() {
            return this.$store.getters.getAppBarStatus
         },
         appStatus() {
            return this.$store.getters.getAppStatus
         }
      },
      components: {
         //SystemInformation,
         caOverlay,
         multiFileOverlay,
         landingHelpComponent,
         sidebar,
         topCommandLine,
         centerModuleWrapper,
         imageZoom,
         disableOverlay

      },
      methods: {},
      created() {
         if (process.env.NODE_ENV === 'development') {
            this.$store.dispatch('enableApp')
            this.$store.dispatch('overlayMultifileDisable')
            this.$store.dispatch('closeSidebar')
            this.$store.dispatch('resetMultifileTempData')
            this.$store.dispatch('setCurrentModule', 'assets')
            this.$store.dispatch('setCurrentModuleCA', false)
         }
         else {
            this.$store.dispatch('enableApp')
            this.$store.dispatch('overlayMultifileDisable')
            this.$store.dispatch('openSidebar')
            this.$store.dispatch('resetMultifileTempData')
            this.$store.dispatch('setCurrentModule', false)
            this.$store.dispatch('setCurrentModuleCA', false)
         }


         //this.$store.dispatch('overlayMultifileEnable')

         //this.$store.dispatch('openSidebar')
         //this.$store.dispatch('setCurrentModule', false)


      }
   }
</script>

<style lang="sass">
    @import "../assets/sass/spritemap"
    @import "../assets/sass/htmlElements"
    @import "../assets/sass/globalHelperClasses"
    @import "../assets/sass/tooltipPlugin"
    @import "../assets/sass/selectPlugin"
    @import "../assets/sass/togglePlugin"
    @import "../assets/sass/sliderPlugin"


</style>

<style lang="sass">
    .vue-lb-content
        background-image: url('~@/assets/images/backgrounds/assetMiniatureBackground.png')
        border: 30px solid
        border-radius: 10px
        margin: 0
        border-image: url('~@/assets/images/backgrounds/topBarBackground.jpg') 50 round
        transition: $transition-DefaultType all 0.5s !important

        .vue-lb-button-close,
        .vue-lb-footer,
        .vue-lb-header
            display: none !important

        .vue-lb-thumbnail-wrapper
            display: none !important

        .vue-lb-figure
            transition: $transition-DefaultType all 0.5s !important
            img
                transition: $transition-DefaultType all 0.5s !important


</style>

<style lang="sass" scoped>
    .appGrid
        position: relative
        display: flex
        overflow: hidden
        height: 100vh

        &:before,
        &:after
            content: ''
            pointer-events: none

        &.isDisabled
            &:before
                pointer-events: auto
                position: fixed
                height: 100vh
                width: 100vw
                z-index: 190000
                mix-blend-mode: hue
                background-color: black

            &:after
                pointer-events: auto
                position: fixed
                height: 100vh
                width: 100vw
                z-index: 190001
                mix-blend-mode: hue
                background-color: black


</style>
