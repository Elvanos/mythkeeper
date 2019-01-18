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

        <div class="appGrid" :class="[{isDisabled: appStatus === false}]">
            <commandSidebar></commandSidebar>

            <appCommandLine></appCommandLine>

            <moduleCommandBar></moduleCommandBar>

            <moduleWrapper></moduleWrapper>


        </div>


    </div>


</template>

<script>
   // Default
   //import SystemInformation from './LandingPage/SystemInformation'

   // Packages


   // Template parts
   import commandSidebar from './layout/commandSidebar'
   import appCommandLine from './layout/appCommandLine'
   import moduleCommandBar from './layout/moduleCommandBar'
   import moduleWrapper from './layout/moduleWrapper'


   export default {
      name: 'appWrapper',
      data: function () {
         return {}
      },
      computed: {
         appStatus() {
            return this.$store.getters.getAppStatus
         }
      },
      components: {
         //SystemInformation,

         commandSidebar,
         appCommandLine,
         moduleCommandBar,
         moduleWrapper

      },
      methods: {},
      created() {
         this.$store.dispatch('setAppStatusEnabled')

      }
   }
</script>

<style lang="sass">
    @import "../assets/sass/spritemap"
    @import "../assets/sass/htmlElements"
    @import "../assets/sass/globalHelperClasses"
    @import "../assets/sass/tooltipPlugin"

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
                >div
                    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))
                    color: #dcdcdc
                    width: 75px
                    height: 75px



</style>
