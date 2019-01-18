<template>

    <div>
        <slot v-if="!this.$props.confirmMessage">
            <div
                    :class="['commandBarButton', { 'disabled': disabled}]"
                    :title="title"
                    v-on:click="nonConfirmAction">

                <div class="commandIcon sprite"
                     :class="[commandIcon]">
                </div>

            </div>
        </slot>

        <slot v-if="this.$props.confirmMessage">
            <div
                    :class="['commandBarButton', { 'disabled': disabled}]"
                    :title="title"
                    v-on:click="confirmAction">

                <div class="commandIcon sprite"
                     :class="[commandIcon]">
                </div>

            </div>
        </slot>

    </div>


</template>

<script>
   export default {
      name: "commandBarButton",
      computed: {},
      data: function () {
         return {}
      },
      methods: {

         nonConfirmAction(event) {
            if (!event.target.classList.contains('disabled')) {
               this.$props.action()
            }
         },
         confirmAction(event) {

            // Dont trigger if disabled
            if (!event.target.classList.contains('disabled')) {
               this.$dialog
                   .confirm(this.$props.confirmMessage)
                   .then(() => {

                      this.$props.action()
                   })
                   .catch(() => {
                   })
            }

         }
      },
      props: {
         title: String,
         action: false,
         confirmMessage: false,
         disabled: {
            type: Boolean,
            default: false,
         },
         commandIcon: {
            type: String,
            default: 'alert-error',
         },

      },

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
        margin-left: 10px

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

            // Other
            filter: sepia(0%)

        &.disabled
            cursor: no-drop
            filter: grayscale(1) !important

        .commandIcon
            // Sizing & positioning
            filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))

            pointer-events: none
            transition: $transition-DefaultType 0.5s all


</style>
