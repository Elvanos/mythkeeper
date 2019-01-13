<template>
    <div class="commandSidebar" :class="{ '-collapsed': !isOpened}">
        <actionButton title="Assets" action="assets"></actionButton>
        <actionButton title="Themes" action="themes"></actionButton>
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

        // Sizing & positioning
        width: $dimension-sidebarWidth
        padding: 50px 30px 80px

        // Background
        background-image: url('~@/assets/images/backgrounds/sidebarBackground.jpg')
        background-size: calc(#{$dimension-sidebarWidth} + 60px) 100%

        // Other
        transition: width .2s ease-out

        &.-collapsed
            width: 100px
            transition: width .4s ease-in

            .actionButton
                width: calc(100% - 60px)
                color: transparent
                text-indent: -200px
                text-shadow: none

</style>
