<template lang="pug">

  .Sidebar

    WindowButtons

    // Button - Return to starter screen
    .Sidebar__logo(
      :class="(storeGetTaskList.length !== 0)? 'disabled' : ''"
      @click='storeSetCurrentModule')

      q-tooltip(
        v-if='storeGetIsRichTooltipsAllowed'
        :delay="300"
        anchor="center right"
        self="center left"
        transition-show="jump-right"
        transition-hide="jump-left")

        | Return to the starting screen

      img(src='@/assets/images/MKlogo.png')

    // Button - Asset module
    SidebarButton(
      :title='`Assets`'
      :heading='`Assets`'
      modulename='assets')

    // Button - Themes module
    SidebarButton(
      :title='`Themes`'
      :heading='`Themes`'
      modulename='themes')

    // Button - Cartography Assets module
    //SidebarButton(
      :title='`CA Client`'
      :heading='`CA Client`'
      modulename='caclient')

    // Button - Profiles module
    SidebarButton(
      :title='`Profiles`'
      :heading='`Profiles`'
      modulename='profiles')

    .Sidebar__utilityActions

      // Button - Settings overlay
      .iconWrapper(@click='openSettings')
        .iconWrapper__icon.iconWrapper__icon--settings
        | Settings

      .Sidebar__utilityActions__extraActions

        // Button - Developer tools
        .iconWrapper(@click='toggleDevTools')

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")

            b Toggle Developer tools
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | Want to peek under the hood?
              br
              | Developer tools are at your disposal!

          .iconWrapper__icon.iconWrapper__icon--devTools

        // Button - Hard-refresh application
        .iconWrapper(@click='refreshApp')

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")

            b Reload Mythkeeper
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | Mythkeeper stopped working?
              br
              | Hard refresh it here!

          .iconWrapper__icon.iconWrapper__icon--forceRefresh

        // Button - Tutorials
        .iconWrapper(@click='openGuide')

          q-tooltip(
          :delay="300"
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down")

            b Show guides
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | Getting lost in the app?
              br
              | We wrote some newbie-friendly tutorials for you and put them right inside tha app itself!

          .iconWrapper__icon.iconWrapper__icon--tutorials
            q-icon(name="mdi-help-rhombus")

</template>

<script lang="ts">
//Libs
import {remote} from "electron"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import {Component, Vue} from "vue-property-decorator"
import { Action } from "vuex-class"

// Import components
import SidebarButton from "@/pageparts/layout/SidebarButton.vue"
import WindowButtons from "@/pageparts/layout/WindowButtons.vue"

@Component({
  components: {
    SidebarButton,
    WindowButtons
  }
})
export default class Sidebar extends BaseClass {

  @Action storeSetActiveModule !: (args: string) => void

  refreshApp() {
    remote.getCurrentWindow().reload()
  }

  toggleDevTools(){
    //@ts-ignore
    const devToolsOpened: boolean = remote.getCurrentWindow().isDevToolsOpened()

    if (devToolsOpened) {
      //@ts-ignore
      remote.getCurrentWindow().closeDevTools()

    } else {
      //@ts-ignore
      remote.getCurrentWindow().openDevTools()
      console.log(`%c--------------------\n\n%cWelcome to the %cMythkeeper%c DevTools!
      \nWe use %cElectron ${process.versions.electron} %cto handle the backend and %cVue ${Vue.version} %cto render the frontend.
      \nYou can find the code right here if you want to peer into the abyss: https://github.com/Elvanos/mythkeeper
      \nHappy mapping & digging through the code! All praise the Sploot!
      \n%c--------------------`,

      // Top dots
      "color: #670000; background-color: #fdda8b; font-size: 14px; font-weight: 900",

      // Normal text
      "color: #fdda8b; font-weight: 600; font-size: 13px",

      // Mythkeeper
      "color: #fff5c6; font-weight: 700; font-size: 13px;",

      // Normal text
      "color: #fdda8b; font-weight: 600; font-size: 13px",

      // Electron
      "color: #719fad; font-weight: 600; font-size: 13px",

      // Normal text
      "color: #fdda8b; font-weight: 600; font-size: 13px",

      // Vue
      "color: #42b983; font-weight: 600; font-size: 13px",

      // Normal text
      "color: #fdda8b; font-weight: 600; font-size: 13px",

      // Bottom dots
      "color: #670000; background-color: #fdda8b; font-size: 14px; font-weight: 900",
      )


    }
  }

  openGuide(){
    this.storeSetOverlayComponent("OverlayGuide")

    this.storeSetOverlayVisibility(true)
  }

  openSettings(){
    this.storeSetOverlayComponent("settings")

    this.storeSetOverlayVisibility(true)
  }

  storeSetCurrentModule(){
    this.storeSetActiveModule("welcome")

    this.storeSetOverlayVisibility(false)
  }
}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.Sidebar
  $padTop: 0
  $padBot: 15px
  $padSides: 15px

  $sidebarWidth: 150px

  position: relative
  height: 100vh
  width: $sidebarWidth
  padding: $padTop $padSides $padBot
  flex-shrink: 0

  display: flex
  flex-direction: column
  align-items: center
  box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)

  +MK_elementBackground('../../assets/images/MKbackgroundElements.png')

  >*
    position: relative
    z-index: 1

  &__logo
    margin: 0 5px 60px
    cursor: pointer
    width: 100px

    +Q_customMaxHeight(830px)
      width: 85px
      margin: 0 5px 30px

    &.disabled
      cursor: not-allowed
      pointer-events: none
      filter: grayscale(0.6)


  &__utilityActions
    margin-top: auto
    width: 100%
    z-index: inherit
    opacity: 1

    .iconWrapper
      cursor: pointer
      display: flex
      flex-direction: column
      align-items: center
      color: darken(#ffffff, 35)
      font-size: 16px
      font-weight: 700

      transition: filter 0.3s $transition-DefaultType, color 0.3s $transition-DefaultType

      &:hover
        filter: drop-shadow(0px 0px 10px rgba($themeCol-titlesGlow, 0.55))
        color: $themeCol-titlesGlow

        .iconWrapper
          &__icon
            background-color: $themeCol-iconGlow

      &__icon
        background-repeat: no-repeat
        background-size: contain
        background-position: center
        margin-bottom: 7px
        position: relative
        transition: background-color 0.3s $transition-DefaultType
        mask-repeat: no-repeat
        mask-size: contain
        mask-position: center
        background-color: darken(#ffffff, 35)
        width: 100%

        &--settings
          mask-image: url(../../assets/images/utilitySettings.png)
          height: 35px

          +Q_customMaxHeight(830px)
            height: 30px

        &--devTools
          mask-image: url(../../assets/images/utilityDevTools.png)
          width: 20px
          height: 19px

        &--tutorials
          background-color: transparent !important
          width: 20px
          height: 20px
          margin-top: -2px

          &:hover
            background-color: transparent !important

          .q-icon
            width: 20px
            height: 20px
            font-size: 20px

        &--forceRefresh
          mask-image: url(../../assets/images/utilityForceRefresh.png)
          width: 20px
          height: 19px

    &__settings
      display: flex
      flex-direction: column
      align-items: center

    &__extraActions
      margin-top: 35px
      display: flex
      justify-content: space-between
      z-index: 1000000
      position: relative

      +Q_customMaxHeight(830px)
        margin-top: 25px

</style>
