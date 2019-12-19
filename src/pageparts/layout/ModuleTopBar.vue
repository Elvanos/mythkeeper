<template lang="pug">
  transition
    .ModuleTopBar
      .ModuleTopBar__left
        // Profiles
        template(v-if='profilesAllowed && storeGetActiveModule !== "welcome"')

          // Button - Profile set
          span
            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              template(v-if='wdCurrentINIProfile !== activeProfile')
                b Set profile as active in Wonderdraft
                template(v-if='storeGetIsRichTooltipsAllowed')
                  br
                  br
                  | Modifies the Wonderdraft INI file to allow it to read from this profile.

              template(v-else)
                b This profile is already set as active
            q-btn(
              :disable='wdCurrentINIProfile === activeProfile || storeGetTaskList.length !== 0'
              @click='triggerIniUpdate'
              :class="[{'q-highlight-pass': wdCurrentINIProfile === activeProfile}]"

              icon="mdi-video-input-hdmi"
              outline
              class="q-ml-sm"
              color="primary")

          // Select - Profile select
          span.ModuleTopBar__left__profiles.q-ml-sm.q-mr-sm

            q-select(
              filled
              class="-dense"
              :disable='storeGetTaskList.length !== 0'
              v-model="activeProfile"
              :options="profileList"
              @input='setActiveProfile'
              label="Profile")

              template(v-slot:option='scope')
                q-item(
                  v-bind='scope.itemProps'
                  v-on='scope.itemEvents'
                  :class="{'q-highlight-pass': wdCurrentINIProfile === scope.opt}")

                  q-item-section
                    q-item-label {{ scope.opt }}

              template(v-slot:prepend)
                q-icon(name="mdi-folder-image")

              // :class="{'md-highlight-pass': wdCurrentINIProfile === profile}"



        // Variable part of the left part of the bar
        slot(name='leftSide')

      .ModuleTopBar__right

        // Variable part of the right part of the bar
        slot(name='rightSide')

</template>

<script lang="ts">
//Libs
import path from "path"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, Watch } from "vue-property-decorator"
import { Getter,Action } from "vuex-class"
import iniManager from "@/scripts/fileManagers/iniManager"


@Component
export default class ModuleTopBar extends BaseClass {

  activeProfile:string = "Default"
  wdCurrentINIProfile: string = ""

  @Getter storeGetActiveModule !: string

  @Prop() readonly profileList!: string[]

  @Getter storeGet_PATH_userFolder !: string

  @Getter storeGetIsProfilesModuleAllowed !: boolean

  get profilesAllowed(){
    if (this.storeGetIsProfilesModuleAllowed && this.storeGet_PATH_profileBasePath.length > 0){
      return true
    }
    else{
      return false
    }
  }

  created() {

    if (this.storeGetActiveModule !== "welcome") {
      this.checkIniWDActiveProfile()
      this.activeProfile = this.storeGetActiveProfile
    }


  }

  // Listen to store profile changes
  @Watch("storeGetActiveProfile")
  listenerActiveProfile(){

    if (!this.storeGetIsProfilesModuleAllowed){
      this.activeProfile = "Default"
    }
    else{
      this.activeProfile = this.storeGetActiveProfile
    }

  }

  checkIniWDActiveProfile(){
    const wdIni: any = iniManager.readIni(this.storeGet_PATH_userFolder+"/config.ini")
    if (wdIni.Preferences !== undefined && wdIni.Preferences.custom_assets_directory !== undefined){
      const profileName = path.basename(wdIni.Preferences.custom_assets_directory)
      let profileExists: any = false
      this.profileList.forEach((singleProfile) =>{

        if(profileName === singleProfile)
        {profileExists = singleProfile}
        else if(!wdIni.Preferences.custom_assets_directory.includes("profiles"))
        {profileExists =  "Default"}
      })

      this.wdCurrentINIProfile = profileExists
    }
  }

  triggerIniUpdate(){
    this.$emit("trigger-ini-update")
    this.checkIniWDActiveProfile()
  }

  setActiveProfile(){
    this.storeSetActiveProfile(this.activeProfile)
  }


}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.ModuleTopBar
  position: fixed
  right: 0
  top: 0
  z-index: 2

  display: flex
  justify-content: space-between
  align-items: center
  width: calc(100vw - 150px)
  height: 55px
  -webkit-app-region: drag

  +MK_elementBackground('../../assets/images/MKbackgroundElementsAlt.png')
  &:before
    box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
    background-color: rgba(#13151f, 0.85)
    background-blend-mode: overlay

  color: $themeCol-text
  padding: 0 50px 0 20px !important

  >*
    position: relative
    z-index: 2
    -webkit-app-region: no-drag

  &__left
    display: flex
    align-items: center
    >*
      flex-shrink: 0

  &__left
    &__profiles
      width: 185px


  &__right
    display: flex
    align-items: center
    >*
      flex-shrink: 0


</style>
