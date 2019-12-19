<template lang="pug">
  .ModuleProfiles

    // Top bar
    ModuleTopBar(
      :profile-list='profileList'
      @trigger-ini-update='updateProfileIniWD')


    // Content
    .moduleWrapper
      .tempModule
        .moduleTitle
          | Profile module

        .moduleSubTitle
          | We are still working on this!

        .introText
          p Hello there! We very much appreciate you taking interest in our new WIP Profiles module!
          p We are still working hard on developing this module, so we don't have any fancy interface to show for yet.
          p But even as of now; you can already use the profiles feature to it's full potential!
          p Below, you will find a very simple input that will let you create new profiles for any of your needs!
          p Just input a name (a valid folder name), make a new one and go to town!

        .tempInputProfile
          q-card.bg-grey-9.q-mt-lg(

          )
            q-card-section
              q-input(
                filled
                v-model="newProfileName"
                label="New profile name")

            q-card-section.text-center
              .q-py-md
                q-btn(
                  class="q-ml-lg -bigButton"
                  color="primary"

                  label="Create new profile"
                  @click="createNewProfile"
                )


</template>

<script lang="ts">

// Libs
import fs from "fs-extra"

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
export default class ProfilesModule extends ModuleTemplate {

  newProfileName = ""

  createNewProfile(){

    if (this.newProfileName.length === 0) {
      //@ts-ignore
      this.$awn.warning("Please fill in the profile name.")
      return
    }

    if(!fs.existsSync(this.MKPaths.mkProfiles+"/"+this.newProfileName)){

      fs.mkdirpSync(this.MKPaths.mkProfiles+"/"+this.newProfileName)

      this.refreshModuleSources()

      //@ts-ignore
      this.$awn.success("New profile <b>"+this.newProfileName+"</b> successfully created!")
    }else{
      //@ts-ignore
      this.$awn.warning("Profile with this name already exists, please choose a different one.")
    }

  }

}
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
