<template lang="pug">
  .ModuleWelcome

    ModuleTopBar

    .moduleWrapper
      .moduleContents
        .moduleTitle
          | Mythkeeper

        .moduleSubTitle
          | A community made asset manager for Wonderdraft.

        .moduleContent

          .introText

            p
              | Thank you for downloading Mythkeeper: A community made tool to help you manage your Wonderdraft assets! We hope you enjoy this software as much as we enjoyed making it, minus all the blood and tears poured into crafting it.
              br
              | May it aid you in creating even better and more beautiful maps!
            p
              | Since this is a beta version, we suggest backing up your whole Wonderdraft user folder manually before using this.
            p - Mythkeeper Team

          .introVideos

            q-tooltip(
              anchor="top middle"
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              b This WIP, we are working on this!
              br
              | As of now, we have no videos to show yet, sorry!


            .introVideos__title
              | Quick start tutorial

            VideoPreview

            .introVideos__duo

              div

                VideoPreview

                .introVideos__subTitle
                  | Creator Guide

              div

                VideoPreview

                .introVideos__subTitle
                  | Config Guide

</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"

// Components
import VideoPreview from "@/pageparts/components/VideoPreview.vue"
import ModuleTopBar from "@/pageparts/layout/ModuleTopBar.vue"

@Component({
  components: {
    VideoPreview,
    ModuleTopBar
  }
})
export default class WelcomeModule extends BaseClass {}


</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.ModuleWelcome

  .moduleContents
    width: 1300px
    max-width: calc(100vw - 300px)
    margin: auto
    height: 100%
    padding: 60px 0

    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    .moduleContent
      display: flex
      justify-content: space-between
      width: 100%

    .introText
      color: $themeCol-text
      text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.35)
      width: 390px
      text-align: justify
      margin-top: 25px

      p
        font-family: Friz Quadrata, sans-serif
        font-size: 20px
        line-height: 1.4

        +Q_customMax(1366px)
          font-size: 19px

    .introVideos
      width: 500px

      +Q_customMax(1366px)
        width: 375px

      &__title
        text-align: center
        text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.35)
        color: $themeCol-text
        font-family: Frozito, sans-serif
        font-size: 42px
        line-height: 1.2
        font-weight: 400

        +Q_customMax(1366px)
          font-size: 32px

      &__subTitle
        text-align: center
        text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.35)
        color: $themeCol-text
        font-family: Frozito, sans-serif
        font-size: 28px
        line-height: 1.2
        font-weight: 400
        margin-top: 7.5px

        +Q_customMax(1366px)
          font-size: 24px

      &__duo
        display: flex
        justify-content: space-between
        margin-top: 15px

        >*
          width: calc(50% - 7.5px)


</style>
