<template>

    <div class="donateButton"
         :class="[{ '-collapsed': !isOpened}]"
         v-on:click="openDonationURL"
         v-tooltip.right="`Enjoying the manager? <br> Consider dropping a buck or two to fuel my coffee addiction! <br> More coffee = more features, more speed!`">

        Donate
        <div class="icon" >
            <div class="sprite general-donate"></div>
        </div>

    </div>

</template>

<script>
   export default {
      name: "donateButton",
      computed:{
         isOpened() {
            return this.$store.getters.getAppBarStatus
         },
      },
      methods: {
         openDonationURL() {
            this.$electron.shell.openExternal('https://www.patreon.com/elvanos')
         },
      }
   }
</script>

<style lang="sass" scoped>

    .donateButton

        // Display
        z-index: 9999999
        display: flex
        position: absolute
        bottom: 50px
        left: 30px

        // Display
        overflow: hidden

        // Text settings
        font-family: 'Elementary Gothic', sans-serif
        font-size: 12px
        font-weight: 500
        text-shadow: 0 0 10px rgba(228, 228, 228, 0.75)
        text-align: left
        color: #e4e4e4
        transition: $transition-DefaultType 0.6s all, $transition-DefaultType 0.3s color, $transition-DefaultType 0.3s margin, linear 0.3s width

        letter-spacing: 5px
        white-space: nowrap

        // Sizing & positioning
        padding: 5px 40px 5px 15px
        //width: 240px
        margin-left: 0

        // Background
        background-image: url('~@/assets/images/backgrounds/buttonBackground.png')
        background-size: 250px 45px

        // Border
        border: 1px solid rgba(45, 21, 5, 0.7)

        // Other
        cursor: pointer
        border-radius: 3px
        // box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75)
        filter: sepia(65%)

        &.-collapsed
            left: 8px

        &:hover
            // Text settings
            color: #ffffff

            // Other
            filter: sepia(0%)

        .icon
            z-index: 3
            +M_VerticalCenterAbsolute
            right: 15px
            filter: drop-shadow(0 0 5px rgba(197, 197, 197, 0.50))
            //width: 40px
            //height: 40px
            background-size: contain
            background-position: center
            background-repeat: no-repeat
            pointer-events: none

            // Other
            transition: $transition-DefaultType 0.6s all



</style>
