<template>
    <div
            class="sidebarButton"
            :class="[
                { 'disabled': disabled},
                {'-active': activeButton}
            ]"
            v-on:click="clickAction"
            v-tooltip.right="title">

        <div class="icon" :class="[
            { '-collapsed': !isOpened},
            action
         ]"></div>

        {{title}}

    </div>
</template>

<script>
   export default {
      name: "sidebarButton",
      computed: {
         isOpened() {
            return this.$store.getters.getAppBarStatus
         },
         activeButton() {
            return this.$props.action === this.$store.getters.getCurrentModule && this.$store.getters.getAppBarStatus === false
         }

      },
      props: {
         title: String,
         disabled: {
            type: Boolean,
            default: false,
         },
         action: {
            type: String,
            default: 'disabled',
         }
      },
      methods: {
         clickAction: function (event) {

            // Dont trigger if disabled
            if (!event.target.classList.contains('disabled')) {

               this.$store.dispatch('setCurrentModule', this.$props.action)
               this.$store.dispatch('closeSidebar')
            }
         },

      }
   }
</script>

<style lang="sass">
    .sidebarButton

        // Display
        overflow: hidden

        // Text settings
        font-family: 'Elementary Gothic', sans-serif
        font-size: 18px
        font-weight: 600
        text-shadow: 0 0 10px #e4e4e4
        text-align: left
        color: #e4e4e4
        transition: $transition-DefaultType 0.6s all, $transition-DefaultType 0.3s color, $transition-DefaultType 0.3s margin, linear 0.3s width

        letter-spacing: 5px
        white-space: nowrap

        // Sizing & positioning
        position: relative
        padding: 20px 30px
        margin-top: 15px
        margin-bottom: 15px
        width: 240px
        margin-left: 0

        // Background
        background-image: url('~@/assets/images/backgrounds/buttonBackground.png')
        background-size: $dimension-sidebarWidth 83px

        // Border
        border: 1px solid rgba(45, 21, 5, 0.7)

        // Other
        cursor: pointer
        border-radius: 3px
        // box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75)
        filter: sepia(65%)

        &:hover:not(.disabled),
        &.-active
            // Text settings
            color: #ffffff

            // Sizing & positioning
            margin-left: 5px

            // Other
            filter: sepia(0%)

        &.disabled
            cursor: no-drop
            filter: grayscale(1) !important

        .icon
            // Sizing & positioning
            z-index: 1
            +M_VerticalCenterAbsolute
            right: 30px
            filter: invert(1) drop-shadow(0 0 5px rgba(197, 197, 197, 0.50))
            width: 40px
            height: 40px
            background-size: contain
            background-position: center
            background-repeat: no-repeat
            pointer-events: none

            // Other
            transition: $transition-DefaultType 0.6s all

            &.assets
                background-image: url('~@/assets/images/icons/moduleMini-Assets.png')

            &.themes
                background-image: url('~@/assets/images/icons/moduleMini-Themes.png')

            &.profiles
                background-image: url('~@/assets/images/icons/moduleMini-Profiles.png')

            &.caClient
                background-image: url('~@/assets/images/icons/moduleMini-caClient.png')

            &.-collapsed
                width: 40px
                height: 40px
                +M_CenterAbsolute
                transition: $transition-DefaultType 0.5s all


</style>
