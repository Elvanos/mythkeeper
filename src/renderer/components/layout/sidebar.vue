<template>
    <div class="sidebar" :class="{ '-collapsed': isOpened}">
        <sidebarButton
                :title="`Assets`"
                :heading="`Assets`"
                action="assets">
        </sidebarButton>

        <sidebarButton
                :title="`Themes - Not available yet`"
                :heading="`Themes`"
                action="themes"
                :disabled="true">
        </sidebarButton>

        <sidebarButton
                :title="`Profiles - Not available yet`"
                :heading="`Profiles`"
                action="profiles"
                :disabled=true>
        </sidebarButton>

        <sidebarButton
                :title="`CA Client - Not available yet`"
                :heading="`CA Client`"
                action="caClient"
                :disabled=true>
        </sidebarButton>

        <donateButton></donateButton>


        <appFunctionalityBar></appFunctionalityBar>

    </div>


</template>

<script>
   import sidebarButton from './sidebar/sidebarButton'
   import appFunctionalityBar from './sidebar/appFunctionalityBar'
   import donateButton from './sidebar/donateButton'



   export default {
      name: "sidebar",
      computed: {
         isOpened(){
            return !this.$store.getters.getAppBarStatus
         }
      },
      components: {
         sidebarButton,
         appFunctionalityBar,
         donateButton
      },

   }
</script>

<style lang="sass" scoped>
    .sidebar

        // Display
        display: flex
        flex-direction: column
        flex-shrink: 0

        // Sizing & positioning
        width: $dimension-sidebarWidth
        padding: 80px 30px 80px
        position: relative
        z-index: 2

        // Background
        background-image: url('~@/assets/images/backgrounds/sidebarBackground.jpg')
        background-size: calc(#{$dimension-sidebarWidth} + 60px)

        // Border
        border-right: 1px solid rgba(45, 21, 5, 0.7)


        // Other
        transition: width .2s ease-out
        box-shadow: 5px 0 30px 0px rgba(0, 0, 0, 0.5)

        &.-collapsed
            width: 100px
            transition: width .4s ease-in

            .sidebarButton
                width: calc(100% - 60px)
                color: transparent
                text-indent: -200px
                text-shadow: none



</style>
