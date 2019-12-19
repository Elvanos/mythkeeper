<template lang="pug">

  transition(name="popup")
    .DragonSpinner
      .DragonSpinner__inner
        q-tooltip(
          :delay="300"
          transition-show="jump-down"
          transition-hide="jump-up")

          | Mythkeeper is processing this item.
          br
          | It will stay locked until the task is finished.

</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component} from "vue-property-decorator"


@Component
export default class DragonSpinner extends BaseClass {
}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.DragonSpinner
  +M_AbsoluteFullCover
  z-index: 2
  display: flex
  justify-content: center
  align-items: center

  &__inner
    width: 125px
    height: 125px
    background-image: url(../../assets/images/mkDragonIcon.png)
    background-size: contain
    background-repeat: no-repeat
    background-position: center
    animation: rotate 1.5s $transition-DefaultType infinite


// Animations
.popup-enter-active, .popup-leave-active
  transition: opacity 0.7s, transform 1s
  transform: scale(1)

.popup-enter, .popup-leave-to
  opacity: 0
  transform: scale(0)

@keyframes rotate
  from
    transform: rotate(360deg)
  to
    transform: rotate(0deg)


</style>
