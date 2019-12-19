<template lang="pug">
  .SupportUs(@click='openDonationURL')


    q-tooltip(
      v-if='storeGetIsRichTooltipsAllowed'
      :delay="300"
      anchor="top middle"
      self="bottom middle"
      transition-show="jump-up"
      transition-hide="jump-down")

      | Enjoying the app?
      br
      | Consider dropping us a penny or two on Patreon!

    .SupportUs__text
      | Support us!

</template>

<script lang="ts">
//Libs
import {shell} from "electron"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, PropSync } from "vue-property-decorator"


@Component
export default class SidebarButton extends BaseClass {

  openDonationURL() {
    shell.openExternal("https://www.patreon.com/elvanos")
  }

}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.SupportUs
  position: fixed
  right: 25px
  z-index: 5
  bottom: -40px
  text-align: center
  padding: 7px 15px
  cursor: pointer
  box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
  border-radius: 10px 10px 0 0
  height: 75px

  transition: transform 0.6s $transition-DefaultType, filter 0.6s $transition-DefaultType

  &:before
    border-radius: 10px 10px 0 0

  &:hover
    filter: drop-shadow(0px 0px 10px rgba($themeCol-iconActive, 0.4))
    transform: translateY(-10px)

  &__text
    color: $themeCol-text
    font-size: 16px
    font-weight: 700
    position: relative
    z-index: 1

  +MK_elementBackground('../../assets/images/MKbackgroundElements.png')


</style>
