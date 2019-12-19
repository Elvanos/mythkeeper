<template lang="pug">
  .OverlaySettings.overlayContainer

    .overlayContainer__title
      | Settings

    .row.q-col-gutter-x-md.q-col-gutter-y-lg

      // Block - Core settings
      .col-12
        h3
          | Core settings

      // Core settings - WD core path input
      .col

        q-input(
          filled
          v-model="wdFolderPath"
          label="Wonderdraft user folder path")

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              | This is the root folder of your Wonderdraft settings.
              br
              | Mythkeeper will attempt to find this folder on its own,
              br
              | but in some cases it might need your help finding the folder.
              br
              br
              b Default folder paths on different systems:
              br
              br
              b Windows:&nbsp;
              span(v-html='escapeHtml(`C:\\Users\\<username>\\AppData\\Roaming\\Wonderdraft`)')
              br
              br
              b MacOS:&nbsp;
              span(v-html='escapeHtml(`/Users/<username>/Library/Application Support/Wonderdraft`)')
              br
              br
              b Linux:&nbsp;
              span(v-html='escapeHtml(`/home/<username>/.local/share/Wonderdraft`)')

      // Core settings - WD core path dialog button
      .col-auto

        q-btn(
          icon="folder"
          outline
          round
          :ripple="false"
          class="-roundMenuIcon"
          color="primary"

          @click='openDialogWdFolder')

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")
            | Select the Wonderdraft user folder manually directly through Mythkeeper!

    // Block - Module settings
    .row.q-col-gutter-x-md.q-col-gutter-y-lg
      .col-12
        h3
          | Module settings

      // Module settings - Switch for showing disabled modules
      .col-6

        q-toggle.full-width(
          :class="{'-active': showDisabledModules}"
          :ripple="false"
          v-model="showDisabledModules"
          label="Show disabled modules"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              | If you chose to not use certain modules, you can turn this on to hide them from the view.

      // Module settings - Switch for allowance of profiles module
      .col-6

        q-toggle.full-width(
          :class="{'-active': profilesAllowed}"
          :ripple="false"
          v-model="profilesAllowed"
          label="Profiles Module"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              b Profiles module allows for the use of multiple asset and theme setups.
              br
              b This module will modify your Wonderdraft INI file in order to work
              | (naturally, we back the file up).
              br
              br
              b In essence this means the following:
              br
              br
              b Advantages:
              br
              | + Lesser load time for Wonderdraft since less assets get loaded
              br
              | + Smaller asset list to scroll/search through
              br
              | + Possible performance boost for weaker computers
              br
              | + Ability to make profiles following a certain theme (sci-fi, steampunk, etc.)
              br
              br
              b Disadvantages:
              br
              | - A need to create and micromanage profiles
              br
              | &nbsp;&nbsp;(each profile has its own set of assets and themes; meaning there can be duplicated assets/themes)
              br
              | - Possible errors when loading maps if user loses a track which map uses which profile
              br
              | - Takes more space on HDD/SSD as each profile is essentially a duplicate with all the data

      template(v-if='profilesAllowed')

        // Module settings - Profiles path input
        .col

          q-input(
            filled
            :disable="storeGetActiveProfile !== 'Default' || iniCheckProfilesActive !== false"
            v-model="mkProfileFolder"
            label="Mythkeeper profile folder path")

            q-icon(name="help")

              q-tooltip(
                :delay="300"
                transition-show="jump-down"
                transition-hide="jump-up")

                template(v-if="storeGetActiveProfile === 'Default' && iniCheckProfilesActive === false")
                  b What is this?
                  br
                  | This setting is a snapshot of your custom assets user folder from your INI Wonderdraft settings file.
                  br
                  | If you never used this option - don't worry. Mythkeeper will fill this automatically for you if you click the
                  b "Import Wonderdraft INI config" button.
                  br
                  | If you used this option, then MK will set your custom asset folder path as the main path for the profile module.
                  br
                  br
                  b Why do I need to set another folder?
                  br
                  | Because Mythkeeper needs to modify the Wonderdraft INI file to make a use of the Profile module.
                  br
                  | For that reason, we need to copy the path from the original file before making any further adjustments to it.

                template(v-else='')
                  b This setting is disabled as long as non-default profile is selected.

            label

        // Module settings - Profiles INI reading trigger button
        .col-auto
          q-btn(
            icon="insert_drive_file"
            outline
            round
            :ripple="false"
            class="-roundMenuIcon"
            color="primary"
            :disable="storeGetActiveProfile !== 'Default' || iniCheckProfilesActive !== false"

            @click='loadIniCustomPath')

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              b Import Wonderdraft INI config
              br
              br
              | Allow Mythkeeper to try reading Wonderdraft INI config file and auto-filling the field.


    // Block - App usage settings
    .row.q-col-gutter-x-md.q-col-gutter-y-lg

      .col-12
        h3
          | Application usage settings

      // App usage settings - Safe delete mode switch
      .col-6

        q-toggle.full-width(
          :class="{'-active': safeDelete}"
          :ripple="false"
          v-model="safeDelete"
          label="Safe delete mode"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              b This setting is mostly meant only for users who struggle with enough space on their HDD/SSD!
              br
              br
              | By default, Mythkeeper never truly deletes any of your files.
              br
              | Instead they get packed into a convenient ZIP file and saved for possible later recovery.
              br
              br
              | Ticking this setting off allows the user to disable this behavior and make Mythkeeper
              br
              b delete the files for good without a possibility of recovery.
              br
              br
              | Turning this off also MARGINALLY speeds up deleting in general since there is no need to zip anything.

      // App usage settings - Expert mode switch
      .col-6

        q-toggle.full-width(
          :class="{'-active': expertMode}"
          :ripple="false"
          v-model="expertMode"
          label="Expert mode"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              | Expert mode is meant for the advanced user who already knows his way around Mythkeeper.
              br
              | Allowing expert mode disabled all kinds of confirmation and warning dialogs across the app.
              br
              br
              b Ticking this assumes that you understand the risks connected to wrong clicks and possible mistakes!
              br
              b There will be no safety net!

      // App usage settings - Rich tooltips switch
      .col-6

        q-toggle.full-width(
          :class="{'-active': richTooltips}"
          :ripple="false"
          v-model="richTooltips"
          label="Rich Tooltips"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              | In case you feel like Mythkeeper has too descriptive tooltips.
              br
              | And you just want the basic descriptions of what each button does.
              br
              | Just un-tick this - it will disable the rich tooltips across the whole app
              br
              | Except for here, in the settings menu; for obvious reasons. :)

      // App usage settings - Startup tips switch
      .col-6

        q-toggle.full-width(
          :class="{'-active': startupTips}"
          :ripple="false"
          v-model="startupTips"
          label="Startup tips"
        )

          q-icon(name="help")

            q-tooltip(
              :delay="300"
              transition-show="jump-down"
              transition-hide="jump-up")

              | In case you feel like Mythkeeper has too descriptive tooltips.
              br
              | And you just want the basic descriptions of what each button does.
              br
              | Just un-tick this - it will disable the rich tooltips across the whole app
              br
              | Except for here, in the settings menu; for obvious reasons. :)

    // Button line
    .row.full-width.justify-end.q-mt-xl

      // Close button withot saving
      .col-auto
        q-btn(
          class="q-ml-lg"
          color="primary"
          :class='"q-btn--outline -noBG -bigButton"'

          label="Close"
          @click='closeModal'
        )


      // Close button with saving
      .col-auto
        q-btn(
          class="q-ml-lg"
          color="primary"
          :class='"-bigButton"'

          label="Save"
          @click='checkSettingsBeforeSave'
        )


</template>

<script lang="ts">


/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


//Libs
import iniManager from "@/scripts/fileManagers/iniManager"
import {remote} from "electron"
import fs from "fs-extra"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"
import { Getter,Action } from "vuex-class"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component
export default class OverlaySettings extends BaseClass {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */


  /**
   * Setting if the INI is current set to any of the active profiles.
   */
  iniCheckProfilesActive: boolean = false

  /**
   * This setting is used to check if the "Allow profiles" slider moved.
   * This setting exists, because otherwise we have to update the INI file with a backup every time the settings are saved, if the profile are allowed.
   */
  profileChangeChecker:boolean = false


  /* ------------------------------ */
  /* ------------VUEX-------------- */
  /* ------------------------------ */


  /**
   * Setting groups
   * Each group for one setting in the GUI
   */

  wdFolderPath: string = ""
  @Getter storeGet_PATH_userFolder !: string
  @Action storeSet_PATH_userFolder !: (args: string) => void

  profilesAllowed: boolean = false
  @Getter storeGetIsProfilesModuleAllowed !: boolean
  @Action storeSetIsProfilesModuleAllowed !: (args: boolean) => void

  showDisabledModules: boolean = true
  @Getter storeGetAreDisabledModulesShowing !: boolean
  @Action storeSetAreDisabledModulesShowing !: (args: boolean) => void

  safeDelete: boolean = true
  // Getter in base class since we need this everywhere
  @Action storeSetIsSafeDeleteAllowed !: (args: boolean) => void

  expertMode: boolean = false
  // Getter in base class since we need this everywhere
  @Action storeSetIsExpertModeAllowed !: (args: boolean) => void

  richTooltips: boolean = true
  // Getter in base class since we need this everywhere
  @Action storeSetIsRichTooltipsAllowed !: (args: boolean) => void

  startupTips: boolean = true
  @Getter storeGetIsStartupTipsAllowed !: boolean
  @Action storeSetIsStartupTipsAllowed !: (args: boolean) => void

  @Getter storeGet_PATH_customAssetFolder !: string
  @Action storeSet_PATH_customAssetFolder !: (args: string) => void

  mkProfileFolder: string = ""
  // Getter in base class since we need this everywhere
  @Action storeSet_PATH_profileBasePath !: (args: string) => void


  /* ----------------------------------- */
  /* ------------VUE NATIVE------------ */
  /* ----------------------------------- */


  /**
   * Checks ini file for profiles setup.
   * Loads all values from the store for settings form.
   *
   * Sets "profileChangeChecker" to "true" as a preparation for possible change in the profile slider if Profiles are NOT allowed.
   * If the profiles are already allowed, leave it at "false" to prevent overwriting of the INI file by current profile contents.
   *
   * Vue native Created lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   * @see profileChangeChecker
   */
  created() {
    this.storeSetIsCloseableOverlay(false)

    // Load WD ini file to check which profile is active right now
    this.checkIniWDActiveProfile()

    /* Load all the current values from store */
    this.wdFolderPath = this.storeGet_PATH_userFolder
    this.profilesAllowed = this.storeGetIsProfilesModuleAllowed
    this.mkProfileFolder = this.storeGet_PATH_profileBasePath
    this.safeDelete = this.storeGetIsSafeDeleteAllowed
    this.showDisabledModules = this.storeGetAreDisabledModulesShowing
    this.expertMode = this.storeGetIsExpertModeAllowed
    this.richTooltips = this.storeGetIsRichTooltipsAllowed
    this.startupTips = this.storeGetIsStartupTipsAllowed

    // If profiles are not allowed, set "profileChangeChecker" to "true" as a preparation for possible backup of the INI file
    if (!this.profilesAllowed) {
      this.profileChangeChecker = true
    }

  }


  /* ------------------------------- */
  /* ------------METHODS------------ */
  /* ------------------------------- */


  /**
   * Checks if the WD ini file contains parameter "custom_assets_directory"
   * If it does, check the parameter value for the word "profiles"
   * If it finds it, sets local "iniCheckProfilesActive"   *
   * @see iniCheckProfilesActive
   */
  checkIniWDActiveProfile(){
    const wdIni: any = iniManager.readIni(this.storeGet_PATH_userFolder+"/config.ini")
    if (wdIni.Preferences !== undefined && wdIni.Preferences.custom_assets_directory !== undefined){
      if(wdIni.Preferences.custom_assets_directory.includes("profiles"))
      {
        this.iniCheckProfilesActive = true
      }
    }
  }

  /**
   * Checks the path of WD base folder, if it doesn't exist, stops saving and throws an error.
   * Checks the path of MK profile folder if they are allowed, if it doesn't exist, stops saving and throws an error.
   * If both checks pass, save settings.
   */
  checkSettingsBeforeSave(){
    if (fs.existsSync(this.wdFolderPath)
        && (fs.existsSync(this.mkProfileFolder) || !this.profilesAllowed))
    {
      this.saveSettings()
    }
    else{
      if (!fs.existsSync(this.wdFolderPath)) {
        //@ts-ignore
        this.$awn.warning("The Wonderdraft user folder path does not seem to be valid.<br>Please re-check the value.",{durations:{warning: 10000}})
      }

      if (!fs.existsSync(this.mkProfileFolder)) {
        //@ts-ignore
        this.$awn.warning("The Mythkeeper profile folder path does not seem to be valid.<br>Please re-check the value.",{durations:{warning: 10000}})
      }
    }
  }

  /**
   * Saves settings into the store.
   * If profiles are allowed and the "profileChangeChecker" is true, creates a copy INI file since the original will be edited later.
   * If profiles are not allowed, resets the store value.
   */
  saveSettings(){

    // Set all values in the store
    this.storeSet_PATH_userFolder(this.wdFolderPath)
    this.storeSetIsProfilesModuleAllowed(this.profilesAllowed)
    this.storeSet_PATH_profileBasePath(this.mkProfileFolder)
    this.storeSetAreDisabledModulesShowing(this.showDisabledModules)
    this.storeSetIsSafeDeleteAllowed(this.safeDelete)
    this.storeSetIsExpertModeAllowed(this.expertMode)
    this.storeSetIsRichTooltipsAllowed(this.richTooltips)
    this.storeSetIsStartupTipsAllowed(this.startupTips)

    // If profiles are disallowed, reset them
    if (!this.profilesAllowed){
      this.storeResetProfiles()
    }

    // Otherwise make a copy of the config file since we dont want to ruin WD config for people
    else if(this.profileChangeChecker){

      fs.copySync(this.storeGet_PATH_userFolder+"/config.ini", this.storeGet_PATH_userFolder+"/_MKbackup_config.ini")

      //@ts-ignore
      this.$awn.info(`
        A backup INI configuration was created at:
        <br>
        <b>${this.storeGet_PATH_userFolder}\_MKbackup_config.ini</b>
        `,{durations:{info: 10000}})
    }

    //@ts-ignore
    this.$awn.success("Settings saved")
    this.closeModal()

  }

  /**
   * Loads "custom_assets_directory" property value from WD ini file if the file and the property exist.
   * If the config file doesn't exist set "mkProfileFolder" the same as default path for WD.
   * If the config file exists, check if the "custom_assets_directory" exists, if it does, set "mkProfileFolder" to it.
   * Otherwise set "mkProfileFolder" to default WD path.
   */
  loadIniCustomPath(){

    const wdIniPath: string = this.storeGet_PATH_userFolder+"/config.ini"
    const wdIni: any = iniManager.readIni(wdIniPath)

    if (wdIni === false) {
      //@ts-ignore
      this.$awn.warning(
        `<strong>Mythkeeper could not load the Wonderdraft configuration file (config.ini):</strong>
          <br>
          1. Please check settings if the Wonderdraft user folder path is set properly.
          <br>
          2. If your path is set properly, then please check if the config file exists in the directory.
          <br>
          3. If it doesn't, start Wonderdraft once to generate it.`
        ,{durations:{warning: 20000}})

      // Set custom asset folder same as the default one if config doesnt exist
      this.mkProfileFolder = this.storeGet_PATH_userFolder

    }else{

      // Set custom assets folder from the ini file, otherwise just set it to default
      if (wdIni.Preferences.custom_assets_directory !== undefined){
        this.mkProfileFolder = wdIni.Preferences.custom_assets_directory
      }
      else{
        this.mkProfileFolder = this.storeGet_PATH_userFolder
      }
    }

  }

  /**
   * Opens native Electron dialog for folder selection.
   */
  openDialogWdFolder(){

    // Set the options
    let dialogOptions: any = (() => {
      let defaultPath = remote.app.getPath("desktop").replace(/\//g, "\\")

      return {
        title: "Select Wonderdraft user folder directory",
        defaultPath: defaultPath,
        properties: ["openDirectory", "showHiddenFiles"]
      }
    })()

    // Open Electron dialog
    remote.dialog.showOpenDialog( dialogOptions, (folderName ?: string[]) => {

      // If no file gets select, silently close down and re-enable the app
      if (folderName === undefined) {
        console.warn("Problem with directory selection.")
        return
      }

      // Set the value if we have a valid folder
      this.wdFolderPath = folderName[0]
    })
  }

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
.OverlaySettings
  width: 800px
.overlayContainer
  &__title


</style>
