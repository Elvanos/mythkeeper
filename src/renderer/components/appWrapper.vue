<template>

    <div class="app">

        <div class="masterOverlay" v-if="appStatus === false">
            <div class="overlayContentWrapper">
                <div class="spinnerWrapper">
                    <Spinner name="circle"/>
                </div>
                <div class="overlayMessage">Processing request</div>
            </div>

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
         landingHelpComponent,
         sidebar,
         topCommandLine,
         centerModuleWrapper

      },
      methods: {},
      created() {
         if (process.env.NODE_ENV === 'development') {
            this.$store.dispatch('enableApp')
            this.$store.dispatch('closeSidebar')
            this.$store.dispatch('setCurrentModule', 'assets')
         }
         else {
            this.$store.dispatch('enableApp')
            this.$store.dispatch('openSidebar')
            this.$store.dispatch('setCurrentModule', false)
         }

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
    .masterOverlay
        position: fixed
        height: 100vh
        width: 100vw
        z-index: 200000
        display: flex
        justify-content: center
        align-items: center

        .overlayContentWrapper
            background-image: url('~@/assets/images/backgrounds/topBarBackground.jpg')
            background-size: cover
            padding: 50px
            border-radius: 5px
            display: flex
            flex-direction: column
            align-items: center
            border: 2px solid rgba(0, 0, 0, 0.5)

            .overlayMessage
                font-family: "Elementary Gothic", sans-serif
                font-size: 18px
                font-weight: 600
                color: #fff
                letter-spacing: 3px
                filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7))

            .spinnerWrapper
                margin-bottom: 20px
                > div
                    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))
                    color: #dcdcdc
                    width: 75px
                    height: 75px


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
