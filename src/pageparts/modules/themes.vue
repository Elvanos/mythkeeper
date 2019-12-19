<template lang="pug">
  .ModuleThemes

    // Top bar
    ModuleTopBar(
      :profile-list='profileList'
      @trigger-ini-update='updateProfileIniWD')

      // Left slot of the bar
      template(v-slot:leftSide)

        // Button - Restore deleted asset
        q-btn(

          @click="openDialogInstallerFile('restoreTheme')"
          icon="mdi-delete-restore"
          outline
          :ripple="false"
          class="q-ml-sm"
          color="primary")

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Restore a previously deleted theme
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | This does exactly the same thing as the button next to it that install a new theme.
              br
              | Except it automatically open the Mythkeeper deleted directory; for convenience purposes!


        // Button - Add new theme
        q-btn(
          icon="mdi-bank-plus"
          outline
          :ripple="false"
          class="q-ml-sm"
          @click="openDialogInstallerFile"
          color="primary")

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Install from local file
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | This will open a dialog to allow installation from a local file.
              br
              | And since we reworked the installation system:
              br
              |<b> You can now install assets, themes, brushes and even whole combined packs using this super-button!</b>



    // Content
    .moduleWrapper
      .tempModule
        .moduleTitle
          | Themes module

        .moduleSubTitle
          | We are still working on this!

        .introText
          p Hello there! We very much appreciate you taking interest in our new WIP Themes module!
          p We are still working hard on developing this module, so we don't have any fancy interface to show for yet.
          p But even as of now; you can already use some of the theme features to their full potential!
          p In the top bar, you will find an installation button that will allow you to install any of your favorite themes!



</template>

<script lang="ts">

// Module template
import ModuleTemplate from "@/scripts/classes/moduleTemplate"

// Decorators & Vue base + VUEX Decorators
import { Component, Watch } from "vue-property-decorator"

// Layout
import ModuleTopBar from "@/pageparts/layout/ModuleTopBar.vue"

@Component({
  components: {
    // Layout
    ModuleTopBar
  }
})
export default class ThemesModule extends ModuleTemplate {}


</script>

<style scoped lang="sass">
  @import '../../assets/sass/globals'


  .tempModule
    width: 1300px
    margin: auto
    height: 100%
    padding: 60px 0

    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    +Q_customMax(1366px)
      padding: 30px 0

    .moduleContent
      display: flex
      justify-content: space-between
      width: 100%

    .introText
      text-align: center
      color: $themeCol-text
      text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.35)
      width: 1000px
      margin-top: 25px

      p
        font-family: Friz Quadrata, sans-serif
        font-size: 18px
        line-height: 1.4

        +Q_customMax(1366px)
          font-size: 16px
          line-height: 1.2

    .tempInputProfile
      width: 500px

</style>
