<template>
    <div class="commandSidebar" :class="{ '-collapsed': !isOpened}">
        <actionButton title="Assets" action="assets"></actionButton>
        <actionButton title="Themes" action="themes" :disabled="true"></actionButton>
        <actionButton title="Profiles" action="profiles" :disabled=true></actionButton>
        <actionButton title="CA Client" action="caClient" :disabled=true></actionButton>



    </div>

</template>

<script>
   import actionButton from './subparts/actionButton'

   export default {
      name: "commandSidebar",
      computed: {
         isOpened(){
            return this.$store.getters.getAppBarStatus
         }
      },
      components: {actionButton},

   }
</script>

<style lang="sass" scoped>
    .commandSidebar

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

            .actionButton
                width: calc(100% - 60px)
                color: transparent
                text-indent: -200px
                text-shadow: none

</style>
