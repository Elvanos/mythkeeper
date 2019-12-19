<template lang="pug">
  .WindowButtons#WindowButtons

    // Close button
    q-btn(
      outline
      round
      :ripple="false"
      class="q-ml-sm"
      color="primary"
      @click="closeApp"
      :class="[{'close': osSystem === 'darwin'}]"
    )

      q-icon(
        name="mdi-window-close"
      )

      q-tooltip(
        :delay="300"
        transition-show="jump-down"
        transition-hide="jump-up")

        b Close down Mythkeeper

    // Minimize button
    q-btn(
      outline
      round
      :ripple="false"
      class="q-ml-sm"
      :class="{'minimize': osSystem === 'darwin'}"
      color="primary"
      @click="minimize"
    )
      q-icon(
        name="mdi-window-minimize"
      )

      q-tooltip(
        :delay="300"
        transition-show="jump-down"
        transition-hide="jump-up")

        b Minimize Mythkeeper

    // MixMax button
    q-btn(
      outline
      round
      :ripple="false"
      class="q-ml-sm"
      :class="{'minMax': osSystem === 'darwin'}"
      color="primary"
      @click="maximize"
    )
      q-icon(
        :name="(isMaximized)? 'mdi-window-restore' : 'mdi-window-maximize'"
      )

      q-tooltip(
        :delay="300"
        transition-show="jump-down"
        transition-hide="jump-up")

        template(v-if="!isMaximized")
          b Restore Mythkeeper to maximized window

        template(v-if="isMaximized")
          b Downscale Mythkeeper window


</template>

<script lang="ts">
//Libs
import fs from "fs-extra"
const isValidPath = require("is-valid-path")

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, PropSync } from "vue-property-decorator"
import { Getter,Action } from "vuex-class"
import {remote} from "electron"


@Component
export default class WindowButtons extends BaseClass {

  isMaximized:boolean = false

  osSystem = remote.process.platform

  mounted(){
    window.addEventListener("resize", this.checkMaximized)
    this.checkMaximized()
  }

  checkMaximized(){
    return this.isMaximized = (remote.getCurrentWindow().isMaximized())? true : false
  }

  minimize () {
    remote.getCurrentWindow().minimize()
  }

  maximize () {
    const win = remote.getCurrentWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    }
    else {
      win.maximize()
    }
  }

  closeApp () {
    remote.getCurrentWindow().close()
  }
}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
#WindowButtons
  z-index: 99999999
  height: 55px
  width: calc(100% + 30px)
  margin-bottom: 20px
  display: flex
  flex-shrink: 0
  justify-content: center
  align-items: center
  -webkit-app-region: drag

  *
    color: $themeCol-titlesGlow
    -webkit-app-region: no-drag

  .q-btn
    font-size: 9px !important
    border-color: rgba($themeCol-titlesGlow, 0.4) !important
    opacity: 0.6

    margin: 5px

    &:hover
      opacity: 1

    &.minimize
      background-color: rgba($themeCol-titles, 0.4) !important

    &.minMax
      background-color: rgba($themeCol-ElementSuccessHightlight, 0.4) !important

    &.close

  .q-icon
    font-size: 15px
    margin-left: 1px


</style>
