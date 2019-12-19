<template lang="pug">
  .OverlayGuide.overlayContainer

    q-tabs.text-primary(
      v-model='tab'
      align="justify"
      inline-label
      )
      q-tab(name='module' icon='mdi-puzzle' label='Module Guide')
      q-tab(name='user' icon='mdi-account' label='User Guide')
      q-tab(name='author' icon='brush' label='Author Guide')
      q-tab(name='mkConfig' icon='mdi-file-document-box-search' label='Mythkeeper Config File Reference')

    q-tab-panels(v-model='tab' animated transition-prev='jump-left' transition-next='jump-right')

      // Module guide
      q-tab-panel(name='module')
        .guideWrapper.pictureGuide
          h1
            | {{ moduleNames[slide] }}
          q-carousel(
            animated
            arrows
            infinite

            v-model='slide'
            :ripple="false"
            :fullscreen.sync="fullscreen"
            )

            q-carousel-slide(
              imageList
              v-for='(image,index) in moduleGuides'
              :key=index
              :name='index'
              )
              img(:src="image")

            template(v-slot:control)
              q-carousel-control(position='bottom-right' :offset='[18, 18]')
                q-btn(
                  round
                  glossy
                  outline
                  color="secondary"
                  text-color='primary'
                  :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click='fullscreen = !fullscreen')

                  q-tooltip(
                    :delay="300"
                    anchor="center left"
                    self="center right"
                    transition-show="jump-left"
                    transition-hide="jump-right")

                    template(v-if="fullscreen")
                      | Exit fullscreen mode

                    template(v-else)
                      | Enter fullscreen mode

      // User guide
      q-tab-panel(name='user')
        .guideWrapper
          UserGuide

      // Author guide
      q-tab-panel(name='author')
        .guideWrapper
          AuthorGuide

      // Config guide
      q-tab-panel(name='mkConfig')
        .guideWrapper
          ConfigFileGuide


</template>

<script lang="ts">


/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


//Libs

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"
import { Getter,Action } from "vuex-class"


//@ts-ignore
import module_assets from "../../assets/moduleGuides/module_assets.png"
//@ts-ignore
import module_caclient from "../../assets/moduleGuides/module_caclient.png"
//@ts-ignore
import module_profiles from "../../assets/moduleGuides/module_profiles.png"
//@ts-ignore
import module_themes from "../../assets/moduleGuides/module_themes.png"
//@ts-ignore
import module_welcome from "../../assets/moduleGuides/module_welcome.png"

import UserGuide from "@/pageparts/guides/UserGuide.vue"
import ConfigFileGuide from "@/pageparts/guides/ConfigFileGuide.vue"
import AuthorGuide from "@/pageparts/guides/AuthorGuide.vue"

/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component({
  components: {
    UserGuide,
    ConfigFileGuide,
    AuthorGuide
  }
})
export default class OverlayGuide extends BaseClass {

  @Getter storeGetActiveModule !: string


  created() {
    this.storeSetIsCloseableOverlay(true)

    if (this.storeGetActiveModule === "welcome") {
      this.slide = 0
    }

    if (this.storeGetActiveModule === "assets") {
      this.slide = 1
    }

    if (this.storeGetActiveModule === "themes") {
      this.slide = 2
    }

    if (this.storeGetActiveModule === "caclient") {
      this.slide = 3
    }

    if (this.storeGetActiveModule === "profiles") {
      this.slide = 4
    }

  }

  slide:number = 0
  fullscreen:boolean = false

  guides: any = {
    user: "",
    author: "",
    mkConfig: ""
  }

  moduleNames: string[] = [
    "Welcome Screen",
    "Assets Module",
    "Themes Module",
    "Cartography Assets Client Module",
    "Profiles Module",

  ]

  moduleGuides: string[] = [
    module_welcome,
    module_assets,
    module_themes,
    module_caclient,
    module_profiles,
  ]

  tab = "module"

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
.OverlayGuide
  width: 1920px
  height: 100vh
  padding: 0
  max-height: calc(100vh - 162px)

  .q-tabs
    margin-bottom: 3px !important
    background-color: rgba(#444444, 0.5)
    border-radius: 8px 8px 0 0

  .q-tab-panels
    border-radius: 0 0 8px 8px

    *
      user-select: text !important

      &::selection
        background-color: $themeCol-ElementHightlightSecondary
        color: #fff

    .q-tab-panel
      max-height: calc(100vh - 213px)

  .guideWrapper

    &.pictureGuide
      text-align: center

      *
        user-select: none !important

      img
        max-height: calc(100vh - 315px)

      h1
        margin: 0 0 15px

    h1
      font-size: 35px
      font-weight: 600
      line-height: inherit
      letter-spacing: inherit
      color: $themeCol-titles

</style>

<style lang="sass">

  .q-tabs__content
    overflow: inherit !important

  .q-tab__indicator
    height: 3px !important
    bottom: -3px !important

  .q-tab__label
    font-weight: 600 !important

  .q-carousel
    max-height: calc(100vh - 315px) !important
    height: calc(100vh - 315px) !important

    &.fullscreen
      max-height: 100vh !important
      height: 100vh !important

      background-image: none !important
      background-color: rgba(68, 68, 68, 1) !important
      z-index: 55555555

  .q-tab-panels.q-panel-parent
    *
      backface-visibility: inherit

  .q-carousel__slide
    display: flex !important
    justify-content: center
    align-items: flex-start
    padding: 0 !important

  .OverlayGuide
    .q-carousel
      .q-carousel__control.q-btn
        background-color: transparent !important

        &:hover
          background-color: transparent !important

</style>
