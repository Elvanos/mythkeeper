<template>

    <div
            :class="['commandBarButton', { 'disabled': disabled}]"
            :title="title"
            v-on:click="action"
    >

        <div class="commandIcon sprite"
             :class="[commandIcon]">
        </div>

    </div>
</template>

<script>
   export default {
      name: "commandBarButton",
      computed: {},
      props: {
         title: String,
         action: null,
         disabled: {
            type: Boolean,
            default: false,
         },
         commandIcon: {
            type: String,
            default: 'alert-error',
         },

      },
      methods: {
      }
   }
</script>

<style lang="sass">
    .commandBarButton

        // Display
        overflow: hidden
        display: flex
        justify-content: center
        align-items: center

        // Sizing & positioning
        position: relative
        height: 40px
        width: 40px

        // Background
        background-image: url('~@/assets/images/backgrounds/buttonBackground.png')
        background-size: 105px
        background-position-y: -6px

        // Border
        //border: 1px solid rgba(45, 21, 5, 0.7)
        border: 1px solid rgba(45, 21, 5, 0.7)

        // Other
        cursor: pointer
        border-radius: 3px

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

        .commandIcon
            // Sizing & positioning
            filter:  drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))

            pointer-events: none
            transition: $transition-DefaultType 0.5s all




</style>
