<template>
    <div class="appCommandLine" :class="{ '-collapsed': !isOpened}">

        <div class="settings -gear" title="Settings"></div>

    </div>
</template>

<script>
   export default {
      name: "appCommandLine",
      computed: {
         isOpened(){
            return this.$store.getters.getAppBarStatus
         }
      },
   }
</script>

<style lang="sass" scoped>
    .appCommandLine
        // Display
        display: flex
        position: absolute

        // Sizing & positioning
        height: 30px
        bottom: 0
        left: 0
        width: calc(#{$dimension-sidebarWidth} + 60px)
        align-items: center

        // Background
        background-color: #444342

        // Other
        transition: width .2s $transition-DefaultType

        &.-collapsed
            width: 100px + 60px
            transition: width .6s $transition-DefaultType


    .settings
        // Sizing & positioning
        width: 15px
        height: 15px
        cursor: pointer
        margin: 15px

        // Background
        background-size: contain

        &.-gear
            // Background
            background-image: url('~@/assets/images/icons/gear-wheel-in-black.svg')

</style>
