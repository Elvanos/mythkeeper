<template lang="pug">
#app(:class="[\
    {'App--overlay': storeGetOverlayVisibility === true},\
    {'js-app--overlay': storeGetOverlayVisibility === true},\
    'App'\
  ]" @click='clickOutsideOverlay')

  Sidebar
  SupportUs

  .App__inner
    transition(name='slide-fade')
      component(
        :trigger-source-refresh="childTriggerSourceRefresh"
        :is='storeGetActiveModule'
        )
        | {{ storeGetActiveModule }}

  div(:class="[\
    'App__overlay',\
    storeGetOverlayComponent\
  ]")

    component(:is='storeGetOverlayComponent')
      | {{ storeGetOverlayComponent }}

  TaskList

</template>

<script lang="ts">

// Libraries
import fs from "fs-extra"
import {remote, ipcRenderer} from "electron"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"
import interfaceUnpackInstaller from "@/scripts/interfaces/_interfaceUnpackInstaller"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"

// Helper scripts
import pathChecker from "@/scripts/uncategorized/pathChecker"
import iniManager from "@/scripts/fileManagers/iniManager"

// Decorators & Vue base + VUEX Decorators
import {Component, Watch} from "vue-property-decorator"
import { Action, Getter } from "vuex-class"

// Layout
import TaskList from "@/pageparts/layout/TaskList.vue"
import Sidebar from "@/pageparts/layout/Sidebar.vue"
import SupportUs from "@/pageparts/layout/SupportUs.vue"

// Modules
import welcome from "@/pageparts/modules/welcome.vue"
import assets from "@/pageparts/modules/assets.vue"
import themes from "@/pageparts/modules/themes.vue"
import profiles from "@/pageparts/modules/profiles.vue"
//import caclient from "@/pageparts/modules/caclient.vue"

// Overlays
import settings from "@/pageparts/overlays/settings.vue"
import choiceDialog from "@/pageparts/overlays/choiceDialog.vue"
import gallerySlider from "@/pageparts/overlays/gallerySlider.vue"
import installDialog from "@/pageparts/overlays/installDialog.vue"
import downloadChoiceDialog from "@/pageparts/overlays/downloadChoiceDialog.vue"

// Guides (overlays)
import OverlayGuide from "@/pageparts/overlays/guide.vue"

// Define component
@Component({
  components: {
    // Components
    TaskList,
    Sidebar,
    SupportUs,

    // Modules
    assets,
    themes,
    profiles,
    welcome,
    //caclient,

    // Overlays
    settings,
    choiceDialog,
    downloadChoiceDialog,
    installDialog,
    gallerySlider,

    // Guides (overlays)
    OverlayGuide


  }
})

// Component code
export default class App extends BaseClass {

  @Getter storeGetActiveModule !: string

  @Action storeSetActiveModule !: (args: string) => void

  @Getter storeGetOverlayComponent !: string

  @Getter storeGetOverlayVisibility !: boolean

  @Getter storeGet_PATH_userFolder !: string

  @Getter storeGetOutsideOverLayClick !: boolean

  @Action storeResetUI !: () => void

  @Action storeResetTaskList !: () => void

  @Action storeResetComponentLocks !: () => void

  @Action storeSet_PATH_userFolder !: (pathInput: string) => void

  @Getter storeGetIsStartupTipsAllowed !: boolean

  @Action storeSet_PATH_customAssetFolder !: (path: string) => void

  @Action storeResetInstallationQueue !: () => void

  installerTimer:any = null



  /* ------------------------------------------------ */
  /* ------------VUEX: COMPONENT LOCKS-------------- */
  /* ------------------------------------------------ */


  /**
   * Gets a list of component locks from the store
   * @returns {string[]} Each lock is an absolute folder path bound to the absolute path of the particular asset
   */
  @Getter storeGetComponentLocks !: string[]

  /**
   * Adds a new folder path lock to the store
   * @param lockPath {string} - An absolute folder path
   */
  @Action storeAddComponentLock !: (lockPath: string) => void

  /**
   * Remove a folder path from the store
   * @param lockPath {string} - An absolute folder path
   */
  @Action storeRemoveComponentLock !: (lockPath: string|number) => void


  created () {
    // Run all needed resets
    this.storeResetUI()
    this.storeResetTaskList()
    this.storeResetComponentLocks()
    this.storeResetInstallationQueue()

    // TODO comment this out
    //this.storeSetActiveModule("caclient")

    // Check if necessary folders exist and set the settings accordingly
    if(pathChecker.existsWdUserFolder() && this.storeGet_PATH_userFolder.length === 0)
    {this.storeSet_PATH_userFolder(pathChecker.PATH_wdUserFolder)}

    // Add key listeners
    document.addEventListener("keyup", this.reactToKeystrokes)

    this.loadWdIniFile()

    this.startUpHint()

    // Set timer for installer popup
    this.installerTimer = setInterval(() => {
      this.checkInstallationQueue()
    }, 2000)

  }

  beforeDestroy(){
    clearInterval(this.installerTimer)
    document.removeEventListener("keyup", this.reactToKeystrokes)
  }


  // Listen to clicks outside the overlay element if it up
  @Watch("storeGetOutsideOverLayClick")
  listenerOverlayClick(){

    if (
      this.storeGetOutsideOverLayClick === true
        && this.storeGetIsCloseableOverlay
    ){
      this.storeSetOverlayVisibility(false)
      this.storeSetOutsideOverLayClick(false)
      this.storeSetOverlayComponent("")
    }
  }

  reactToKeystrokes (e:any) {
    if (e.key === "Escape" && this.storeGetIsCloseableOverlay) {this.closeModal()}
  }

  clickOutsideOverlay(e:any){
    if(e.target.classList.contains("js-app--overlay"))
    {this.storeSetOutsideOverLayClick(true)}
  }

  startUpHint(){

    if (this.storeGetIsStartupTipsAllowed) {
      const startUpHints: string[] = [
        "The font we use for titles is a bit broken.<br>So we have type \"X\" instead of \"Y\".",
        "Mythkeeper is actually a webpage engine running on your desktop/laptop.<br>Technology is crazy!",
        "We used a framework called Vue to code Mythkeeper.",
        "Megasploot has an adorable corgi!",
        "Most popup windows can be closed by clicking outside or by pressing \"ESC\" key.<br>If not, there is always a close button at the bottom.",
        "Mythkeeper was named before Legendkeeper became a thing.<br>Sorry Braden!",
        "You can use the \"TAB\" key to jump through the inputs or even just deselect them, just like on a website.<br>This is especially useful for the quick search in the top bar!",
        "We have a Github repository! Feel free to take a peak.",
        "We have a Patreon account!<br> If you like the app, feel free to drop us a buck or two.",
        "Wonderdraft has a really friendly Discord server. <br> We suggest checking it out!",
        "If you hate these startup tips popping over and over again.<br>Feel free to turn them off in the Settings menu.",
        "If you think Mythkeeper has too many long tooltips when hovering buttons.<br>Feel free to turn them off in the Settings menu."
      ]

      //@ts-ignore
      this.$awn.info(startUpHints[Math.floor(Math.random() * startUpHints.length)],{labels:{info: "Did xou know?"},durations:{info: 15000}})
    }


  }

  loadWdIniFile(){
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
      this.storeSet_PATH_customAssetFolder(this.storeGet_PATH_userFolder)
    }else{
      // Set custom assets folder from the ini file, otherwise just set it to default
      if (wdIni.Preferences !== undefined && wdIni.Preferences.custom_assets_directory !== undefined)
      {this.storeSet_PATH_customAssetFolder(wdIni.Preferences.custom_assets_directory)}
      else
      {this.storeSet_PATH_customAssetFolder(this.storeGet_PATH_userFolder)}
    }
  }

  /**
   * A slightly hacky-solution to trigger a method on a child.
   * Child only react to "true" state so this needs to get reset every time it gets triggered.
   */
  childTriggerSourceRefresh: boolean = false


  /**
   * Triggers backing up on all children
   * @see childTriggerBackup childTriggerBackup - Gets toggled on an off with 1 sec delay.
   */
  triggerSourceRefresh(){
    this.childTriggerSourceRefresh = true

    setTimeout(()=>{
      this.childTriggerSourceRefresh = false
    },1000)
  }



  /* ---------------------------------------------------- */
  /* ------------METHODS: INSTALLER METHODS------------ */
  /* ---------------------------------------------------- */


  checkInstallationQueue(){
    if (!this.storeGetOverlayVisibility && this.storeGetInstallationQueue.length > 0) {

      let overlayParameters = this.storeGetInstallationQueue[0]

      const scannedFolder = this.scanInstallDirectory(overlayParameters)
      const inConflict = scannedFolder.conflictExists
      overlayParameters = scannedFolder.extractionQueueData

      if((inConflict || scannedFolder.extractionQueueData.extractionQueue.length > 1) && overlayParameters.sourceComponentData.askForOverwrite !== false){
        // Overlay dialog contents
        const overlayContents: overlayActionsInterface = {
          componentID: this.getComponentID(),
          title: "Installation settings",
          contents: "You are about to install a package that is either in conflict with currently installed assets or contains more than one part. <br> Please chose all new parts you wish to install and which already existing parts to overwrite.",
          actions: [
            {
              title: "Cancel installation",
              classes: "q-btn--outline -noBG",
              action: "storeSetOverLayTriggerAction",
              param: {
                functionName: "cancelInstallation",
                data: overlayParameters.sourceComponentData
              }
            },
            {
              title: "Install",
              classes: "",
              action: "storeSetOverLayTriggerAction",
              param: {
                functionName: "continueInstallation",
                data: overlayParameters.sourceComponentData
              }
            }
          ]
        }
        this.triggerInstallationDialog(overlayContents, overlayParameters)
      }else{
        this.storeSetOverLayTriggerParameter(overlayParameters)
        this.continueInstallation(overlayParameters.sourceComponentData)
      }

    }
  }

  scanInstallDirectory(extractionQueueData){
    const directoryQueue = extractionQueueData.extractionQueue
    let conflictExists = false


    for(const [index,single] of directoryQueue.entries()) {

      // Check if the new installer has any version
      if (fs.existsSync(`${single.folderPath}\\mythKeeperSettings.json`)) {
        try {
          //@ts-ignore
          const mkConfig = JSON.parse(fs.readFileSync(`${single.folderPath}\\mythKeeperSettings.json`))

          if (mkConfig.basicInformation !== undefined && mkConfig.basicInformation.version !== undefined) {
            extractionQueueData.extractionQueue[index].newVersion = mkConfig.basicInformation.version
          }

        } catch(err) {
          //@ts-ignore
          this.$awn.alert(`
              <b>${single.name}</b> has a malformed Mythkepeer config file.
              <br>
              Check the developer Developer Tools for more details (button on bottom left)`,{durations: {alert: 0}})
          console.error(err)
        }
      }

      if (fs.existsSync(single.folderToCopyPath)) {
        conflictExists = true
        extractionQueueData.extractionQueue[index].alreadyExists = true

        // Check if the already existing installation has any version
        if (fs.existsSync(`${single.folderToCopyPath}\\mythKeeperSettings.json`)) {
          try {
            //@ts-ignore
            const mkConfig = JSON.parse(fs.readFileSync(`${single.folderToCopyPath}\\mythKeeperSettings.json`))

            if (mkConfig.basicInformation !== undefined && mkConfig.basicInformation.version !== undefined) {
              extractionQueueData.extractionQueue[index].installedVersion = mkConfig.basicInformation.version
            }

          } catch (err) {
            console.error(err)
          }
        }
      }
    }
    return {extractionQueueData,conflictExists}
  }

  cancelInstallation(input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){

    this.storeRemoveFromInstallationQueue(this.storeGetOverLayTriggerParameter)
    const deletePath = this.storeGetOverLayTriggerParameter.masterPath
    fs.removeSync(deletePath)

    // If this is passed from the downloader, delete the temp folder and unlock the miniature
    if (input.componentLock) {
      fs.removeSync(input.unpackPath)
      fs.removeSync(input.tempFolderPath)
      this.storeRemoveComponentLock(input.componentLock)
    }

  }

  async continueInstallation(input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){


    this.storeRemoveFromInstallationQueue(this.storeGetOverLayTriggerParameter)
    const deletePath = this.storeGetOverLayTriggerParameter.masterPath
    const extractionQueue = this.storeGetOverLayTriggerParameter.extractionQueue

    // Build a promise list
    const promiseList = []
    for(const single of extractionQueue){

      if (single.willInstall) {

        const singlePromise = new Promise(async (resolve, reject) => {
          await this.installNewItem(single,input)
          resolve()
        })

        //@ts-ignore
        promiseList.push(singlePromise)

      }
    }

    // Wait for all of the promises to finish
    await Promise.all(promiseList)

    // Clean up after the installation finishes
    fs.removeSync(deletePath)

    // Trigger the source refresh... if we are on module that has something
    this.triggerSourceRefresh()

    // If this is passed from the downloader, delete the temp folder and unlock the miniature
    if (input.componentLock) {
      fs.removeSync(input.unpackPath)
      fs.removeSync(input.tempFolderPath)
      this.storeRemoveComponentLock(input.componentLock)
    }

    //@ts-ignore
    this.$awn.success(`Successfully installed <b>${this.storeGetOverLayTriggerParameter.name}!</b><br>Happy mapping!`)


  }

  async installNewItem(newItem,input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){

    await new Promise((resolve) => {

      // Set new task for the store and also set it locally for updates and removal later
      const newTask = this.commitNewTask("Installing (2/2)", newItem.name)

      const command: interfaceBackgroundRenderWork = {
        command: "installFile-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          installationItem: newItem
        }
      }

      ipcRenderer.send("asynchronous-message", command)

      // Set timer for reporting
      const reportTimer = setInterval(() => {
        const workList = remote.getCurrentWindow()["workList"]

        let taskIndex: number = -1

        workList.forEach((singleTask: interfaceBackgroundRenderWork, index) => {
          if (singleTask.taskID === command.taskID) {
            taskIndex = index
          }
        })

        if (taskIndex !== -1) {

          this.updateTask(newTask, workList[taskIndex].progress)

        } else {

          // If we have CA data packed with this, pass them to generate/add to MK config file
          if (input.componentLock) {
            this.appendCAData(newItem, input)
          }

          // Cleanup and removal of the task from the tasklist
          clearInterval(reportTimer)
          this.updateTask(newTask, 100)
          this.removeTask(newTask)

          resolve()
        }
      }, 1000)

    })

  }


  appendCAData(newItem, input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){

    // Failsafe for malformed JSONs
    try {

      let settingsJSON:any = {}

      // If the config file already exists, read it (or at least try to in case it is busted)
      if (fs.existsSync(newItem.folderToCopyPath + "/mythKeeperSettings.json")) {
        settingsJSON = JSON.parse(fs.readFileSync(newItem.folderToCopyPath + "/mythKeeperSettings.json", "utf8"))
      }

      // Set the values
      settingsJSON.vendors = input.tempJSON.vendors

      // Write the config file and finish
      fs.writeFileSync(newItem.folderToCopyPath + "/mythKeeperSettings.json", JSON.stringify(settingsJSON,null, 4))

    } catch(err) {
      console.error(err)
    }

  }

}

</script>

<style scoped lang="sass">
  @import '/assets/sass/globals'

  // Vue animations
  .slide-fade-enter-active
    transition: all 0.4s ease
    transition-delay: 0.3s

  .slide-fade-leave-active
    transition: all 0.6s ease

  .slide-fade-enter, .slide-fade-leave-to
    opacity: 0
    +M_AbsoluteFullCover
    padding-top: 200px

  // App quasar
  .App
    position: relative
    width: 100vw
    height: 100vh
    display: flex

    overflow: hidden

    background-image: url("./assets/images/MKbackgroundIntroScreen.png")
    background-position: left top
    background-size: cover
    background-repeat: no-repeat

    &--overlay

      .App__overlay
        display: block

      &:before
        content: ''
        z-index: 3
        +M_AbsoluteFullCover
        position: absolute
        backdrop-filter: sepia(0.8) brightness(50%) grayscale(30%)

      &:after
        content: ''
        z-index: 3
        +M_AbsoluteFullCover
        position: absolute
        backdrop-filter: blur(3px)

    &__inner
      +M_AbsoluteFullCover
      margin-left: 150px

    &__overlay
      display: none

      +MK_elementBackground('./assets/images/MKbackgroundElements.png')
      +M_HorizontalCenterAbsolute
      position: fixed
      top: 225px


      // 50% - 1/2 of sidebar width
      right: calc(50% - 75px)
      z-index: 5
      color: #fff
      box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
      border-radius: 10px
      border: 2px solid $themeCol-elementBorder

      min-height: 250px
      min-width: 500px

      // Screen size - sidebar -  60 padding around it on each side
      max-width: calc(100vw - 150px - 120px)

      // Screen size - top title - 60 bottom padding
      max-height: calc(100vh - 225px - 60px)

      +Q_customMax(1366px)
        top: 150px
        max-height: calc(100vh - 150px - 60px)

      &.installDialog
        +M_CenterAbsolute
        top: inherit
        max-height: calc(100vh - 100px - 60px)

      &.OverlayGuide
        +M_CenterAbsolute
        max-width: calc(100vw - 150px - 165px)
        top: inherit
        max-height: calc(100vh - 100px - 60px)

      &:before
        border-radius: 10px

      >*
        position: relative
        z-index: 1
        max-width: 100%

</style>

<style lang="sass">
  @import '/assets/sass/globalsStyles'

  .App
    &__overlay
      &.gallerySlider
        top: 75px !important
        height: 100vh !important
        max-height: calc(100vh - 100px - 60px) !important

      > *
        overflow: auto
        max-height: calc(100vh - 340px)
        padding: 30px
        +M_scrollbars(5px, $themeCol-titles,rgba($themeCol-text, 0.5))

        +Q_customMax(1366px)
          max-height: calc(100vh - 215px)

      .GallerySlider
        max-height: calc(100vh - 165px)
        height: calc(100vh - 165px)

    &--overlay

      .App__inner
        >*
          >*:not(.ModuleTopBar)
            opacity: 0.2

  .slide-fade-enter-active
    .ModuleTopBar
      transition: all 0.6s ease

  .slide-fade-leave-active
    .ModuleTopBar
      transition: all 0.4s ease

  .slide-fade-enter, .slide-fade-leave-to
    .ModuleTopBar
      transform: translateY(-55px)

  .moduleWrapper
    margin-top: 55px
    height: calc(100vh - 55px)
</style>



