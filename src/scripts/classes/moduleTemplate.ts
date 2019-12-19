/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */

//Libs
import fs from "fs-extra"
import {remote, ipcRenderer} from "electron"

// Base Class
import BaseClass from "@/scripts/classes/classBase"

// Interfaces
import interfaceMKPaths from "@/scripts/interfaces/_interfaceMKPaths"
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"
import interfaceInstallerQueueMember from "@/scripts/interfaces/_interfaceInstallerQueueMember"
import interfaceUnpackInstaller from "@/scripts/interfaces/_interfaceUnpackInstaller"

// Helper scripts
import pathChecker from "@/scripts/uncategorized/pathChecker"
import iniManager from "@/scripts/fileManagers/iniManager"
import InstallManagerMK from "@/scripts/fileManagers/installManagerMK"

// Decorators & Vue base + VUEX Decorators
import { Watch, Component, Prop } from "vue-property-decorator"
import { Getter } from "vuex-class"
import interfaceInstaller from "@/scripts/interfaces/_interfaceInstaller"
import installManagerMK from "@/scripts/fileManagers/installManagerMK"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component
export default class ModuleTemplate extends BaseClass {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */

  /**
   * Wondedraft base folder path.
   * Works a placeholder that gets filled with proper data from getters on the asset getting created.
   */
  wdBaseFolder: string = ""

  /**
   * List of profiles with "Default" as the starting one.
   */
  profileList: string[] = ["Default"]

  /**
   * List of Mythkeeper needed paths.
   */
  MKPaths : interfaceMKPaths =  {
    wdBase: "",
    wdAssets: "\\assets",
    wdThemes: "\\themes",
    wdBrushes: "\\brushes",
    mkBase: "\\_mythKeeper",
    mkProfiles: "\\_mythKeeper\\profiles",
    mkBackup: "\\_mythKeeper\\backup",
    mkBackupAssets: "\\_mythKeeper\\backup\\assets",
    mkBackupThemes: "\\_mythKeeper\\backup\\themes",
    mkBackupBrushes: "\\_mythKeeper\\backup\\brushes",
    mkDeleted: "\\_mythKeeper\\deleted",
    mkDeletedAssets: "\\_mythKeeper\\deleted\\assets",
    mkDeletedThemes: "\\_mythKeeper\\deleted\\themes",
    mkDeletedBrushes: "\\_mythKeeper\\deleted\\brushes",
    mkTemp: "\\_mythKeeper\\temp"
  }

  /**
   * Temporary holder for the installer while in bounces through the overlays
   */
  installationType = {} as interfaceInstaller


  /* ------------------------------ */
  /* ------------PROPS------------ */
  /* ------------------------------ */


  /**
   * Trigger sent by the parent if we need to refresh module sources
   * Set in the upper bar via switch
   *
   */
  @Prop() readonly triggerSourceRefresh!: boolean


  /* ------------------------------ */
  /* ------------WATCH------------ */
  /* ------------------------------ */


  /**
   * Watches on changes on currently active profile and reloads the asset directory if it detect a change.
   * @see storeGetActiveProfile
   */
  @Watch("storeGetActiveProfile")
  listenerActiveProfileModule(){
    this.refreshModuleSources()
  }


  /**
   * Reacts to parent calls to trigger refresh of the sources
   */
  @Watch("triggerSourceRefresh")
  watchTriggerBackup(value: boolean){
    if (value) {
      if (this["forceRefresh"]) {
        this["forceRefresh"](true)
      }
    }
  }


  /* ---------------------------- */
  /* ------------VUEX------------ */
  /* ---------------------------- */


  /**
   * Retrieves base path for the Wonderdraft user folder.
   */
  @Getter storeGet_PATH_userFolder !: string

  /**
   * Retrieves the path for Custom folder for assets and theme if it is set.
   */
  @Getter storeGet_PATH_customAssetFolder !: string

  /**
   * Determines if the profile module is allowed or not.
   */
  @Getter storeGetIsProfilesModuleAllowed !: boolean


  /* ----------------------------------- */
  /* ------------VUE NATIVE------------ */
  /* ----------------------------------- */


  /**
   * Vue native Created lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  created() {

    // Refresh once on load
    this.refreshModuleSources()
  }


  /* ------------------------------------------------ */
  /* ------------METHODS: RESOURCE SCAN------------ */
  /* ------------------------------------------------ */


  /**
   * Sets local Wonderdraft base folder to needed state before further paths get generated after
   * @see wdBaseFolder
   */
  setWdBaseFolderPath(){

    // If profiles are allowed set this module Wondedraft base folder to store profiles base path
    if (this.storeGetIsProfilesModuleAllowed){
      this.wdBaseFolder = this.storeGet_PATH_profileBasePath
    }
    // If profiles are NOT allowed, set this module Wondedraft base folder to store custom assets folder
    else{
      this.wdBaseFolder = this.storeGet_PATH_customAssetFolder
    }

  }

  /**
   * Check and build new MK paths based on local Wonderdraft folder set by "setWdBaseFolderPath" method
   * @see MKPaths
   * @see setWdBaseFolderPath
   */
  checkMKFolders(){

    // An empty placeholder for the possible profile name if any profile is set that is not default
    let pathAddition:string = ""

    // Set the placeholder the proper profile path if needed
    if (this.storeGetActiveProfile !== "Default"){
      pathAddition = "\\_mythKeeper\\profiles\\"+this.storeGetActiveProfile
    }

    // If someone deleted profile manually or it is just... gone
    if (!fs.existsSync(this.wdBaseFolder+pathAddition)){

      // Reset default INI
      fs.copySync(this.storeGet_PATH_userFolder+"/_MKbackup_config.ini", this.storeGet_PATH_userFolder+"/config.ini")

      //@ts-ignore
      this.$awn.warning(
        this.$t.moduleTemplate.awn.checkMKFoldersWarning(this.wdBaseFolder+pathAddition)
        ,{durations:{warning: 10000}})
      this.storeResetProfiles()

      // Reset the placeholder since we couldn't load anything
      pathAddition = ""

    }

    // Hard reset before check
    this.MKPaths = {
      wdBase: pathAddition,
      wdAssets: pathAddition+"\\assets",
      wdThemes: pathAddition+"\\themes",
      wdBrushes: pathAddition+"\\brushes",

      mkBase: pathAddition+"\\_mythKeeper",

      mkProfiles: pathAddition+"\\_mythKeeper\\profiles",

      mkBackup: pathAddition+"\\_mythKeeper\\backup",
      mkBackupAssets: pathAddition+"\\_mythKeeper\\backup\\assets",
      mkBackupThemes: pathAddition+"\\_mythKeeper\\backup\\themes",
      mkBackupBrushes: pathAddition+"\\_mythKeeper\\backup\\brushes",

      mkDeleted: pathAddition+"\\_mythKeeper\\deleted",
      mkDeletedAssets: pathAddition+"\\_mythKeeper\\deleted\\assets",
      mkDeletedThemes: pathAddition+"\\_mythKeeper\\deleted\\themes",
      mkDeletedBrushes: pathAddition+"\\_mythKeeper\\deleted\\brushes",

      mkTemp: pathAddition+"\\_mythKeeper\\temp"
    }

    // Loop through all MK paths to check if they exist. If not, create appropriate folders
    Object.entries(this.MKPaths).forEach(([key, value]) => {

      const newPath = this.wdBaseFolder+value

      // Dont create profile folder inside a single profile folder
      if (key === "mkProfiles" && this.storeGetActiveProfile !== "Default"){
        this.MKPaths.mkProfiles = this.wdBaseFolder+"\\_mythKeeper\\profiles"
      }

      // Otherwise check if the folder exists, if not, make one, then assign the new folder path to the MKPaths
      else{

        if (!pathChecker.checkExist(newPath, true)){
          fs.mkdirSync(newPath)
        }

        this.MKPaths[key] = newPath
      }

    })

  }

  /**
   * Loads all available profiles
   * @see profileList
   */
  loadProfiles(){

    // Resets the profiles at start
    this.profileList = ["Default"]

    // Check the profile directory
    const profileFolders = fs.readdirSync(this.MKPaths.mkProfiles)

    // Add all directories to the list
    profileFolders.forEach((singleFolder:string) => {
      this.profileList.push(singleFolder)
    })

  }

  /**
   * Refreshes current module resources
   * @see setWdBaseFolderPath
   * @see checkMKFolders
   * @see loadProfiles
   */
  refreshModuleSources(){

    // Reset the base folder
    this.setWdBaseFolderPath()

    // Reset the paths
    this.checkMKFolders()

    // If profiles are allowed, load profiles
    if (this.storeGetIsProfilesModuleAllowed){
      this.loadProfiles()
    }

    // Normalize themes
    const installUtil = new InstallManagerMK(this.MKPaths,0)
    installUtil.normalizeThemes(this.MKPaths.wdThemes)

    // Check for junk in the temp folder that too old
    this.clearTempFolder()
  }


  /* ------------------------------------------------------ */
  /* ------------METHODS: TEMP FOLDER CLEANUP------------ */
  /* ------------------------------------------------------ */


  /**
   * Clears the temp folder daily in case something went wrong
   */
  clearTempFolder(){

    // 24 hours
    const timeLimit = 60 * 60 * 1000 * 24

    const tempFolderList = fs.readdirSync(this.MKPaths.mkTemp)
    const currentTimeStamp = new Date().getTime()
    tempFolderList.forEach((singleFolder) => {


      if (currentTimeStamp > parseInt(singleFolder) + timeLimit) {
        fs.remove(this.MKPaths.mkTemp+"/"+singleFolder)
      }
    })
  }


  /* ---------------------------------------------------- */
  /* ------------METHODS: WD INI PROCESSING------------ */
  /* ---------------------------------------------------- */


  /**
   * Rewrite the Wonderdraft INI file with appropriate Profile path
   */
  updateProfileIniWD(){

    // Load Wonderdraft INI file and read it via the manager
    const wdIniPath: string = this.storeGet_PATH_userFolder+"/config.ini"
    const wdIni: any = iniManager.readIni(wdIniPath)

    // If the file doesn't exist or is busted
    if (wdIni === false) {
      //@ts-ignore
      this.$awn.warning(
        this.$t.moduleTemplate.awn.updateProfileIniWDWarning
        ,{durations:{warning: 20000}})

    }

    // If the INI file loaded properly
    else{

      // If the profile is set to "Default" set the INI "custom_assets_directory" to the standard base path
      if (this.storeGetActiveProfile === "Default"){
        wdIni.Preferences.custom_assets_directory = this.storeGet_PATH_profileBasePath
      }

      // If some other profile is selected, set the path to the appropriate profile
      else{
        wdIni.Preferences.custom_assets_directory = this.MKPaths.mkProfiles+"\\"+this.storeGetActiveProfile
      }

      //@ts-ignore
      this.$awn.success(
        this.$t.moduleTemplate.awn.updateProfileIniWDSuccess(wdIni.Preferences.custom_assets_directory)
        ,{durations:{success: 5000}})

      // Update the INI using the manager
      iniManager.modifyIniWDCustomAssetFolder(wdIniPath,wdIni)
    }
  }


  /* -------------------------------------------- */
  /* ------------METHODS: INSTALLERS------------ */
  /* -------------------------------------------- */


  /**
   * Opens native Electron dialog for install file selection
   */
  async openDialogInstallerFile(command: string = ""){

    // Set the options
    let dialogOptions: any = (() => {
      let defaultPath = remote.app.getPath("desktop").replace(/\//g, "\\")

      if(command === "restoreTheme"){
        defaultPath = this.MKPaths.mkDeleted+"/themes".replace(/\//g, "\\")
      }

      if(command === "restoreAsset"){
        defaultPath = this.MKPaths.mkDeleted+"/assets".replace(/\//g, "\\")
      }

      return {
        title: "Select the file you wish to use as installer for Mythkeeper",
        defaultPath: defaultPath,
        filters: [
          { name: "Mythkeeper-compatible files", extensions: ["zip","wonderdraft_theme"] },
        ],
        properties: ["openFile", "showHiddenFiles"]
      }
    })()

    // Open Electron dialog
    remote.dialog.showOpenDialog( dialogOptions, async(fileName ?: string[]) => {

      // If no file gets select, silently close down and re-enable the app
      if (fileName === undefined) {
        console.warn("Problem with directory selection.")
        return
      }

      // Determine what is the user trying to install
      this.installationType = await InstallManagerMK.scanInputFile(fileName[0],"asset")

      // Do a last check in case it is a badly packed brush pack
      if (this.installationType.installerType === false) {

        // Assign the variable to local storage and trigger the overlay
        this.brushCheckDialog()
        return
      }

      // Trigger unpacking of the file
      this.triggerUnpack()

    })
  }

  /**
   * Triggers an installer from external source.
   * @param input - A data list from the child.
   */
  async triggerInstaller(input:interfaceUnpackInstaller){

    // Determine what is the user trying to install
    this.installationType = await InstallManagerMK.scanInputFile(input.unpackPath,"asset")

    // Do a last check in case it is a badly packed brush pack
    if (this.installationType.installerType === false) {

      // Assign the variable to local storage and trigger the overlay
      this.brushCheckDialog(input)
      return
    }

    // Trigger unpacking of the file
    this.triggerUnpack(input)
  }

  /**
   * Offer a last manual check for the edge-case of brushes
   */
  brushCheckDialog(input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){

    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: "Unknown file input.",
      contents: `
        We were unable to determine the file input.
        <br>
        In some edge-cases this can mean that you are trying to install an unusually packed brushes package.
        <br><br>
        Is this the case?`,
      actions: [
        {
          title: "No, exit",
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: "Yes, continue",
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param: {
            functionName: "triggerUnpackSpecialBrush",
            data: input
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)
  }

  /**
   * Trigger the unpacker for the edge-case of badly packed brushes
   */
  triggerUnpackSpecialBrush(input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){
    this.installationType.installerType = "specialBrush"
    this.triggerUnpack(input)
  }

  /**
   * Trigger the normal unpacker
   */
  async triggerUnpack(input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){
    // Process the install file
    const timestamp = new Date().getTime()

    await new Promise((resolve) => {

      // Set new task for the store and also set it locally for updates and removal later
      //@ts-ignore
      const newTask = this.commitNewTask("Unpacking (1/2)", this.installationType.installerName)


      const command: interfaceBackgroundRenderWork = {
        command: "unpackFile-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          timestamp: timestamp,
          mkPaths: this.MKPaths,
          installationType: this.installationType
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

          // Cleanup and removal of the task from the tasklist
          clearInterval(reportTimer)
          this.updateTask(newTask, 100)
          this.removeTask(newTask)

          resolve()
        }
      }, 1000)
    })
    this.processTempFolder(`${this.MKPaths.mkTemp}/${timestamp}`, timestamp, input)
  }

  async processTempFolder(tempFolderPath:string, timestamp:number, input: interfaceUnpackInstaller = {} as interfaceUnpackInstaller){

    // Set up the variables
    const possibleContents:string[] = ["assets", "themes", "brushes"]
    let extractionQueue:any[] = []

    // Check for all folders to extract
    for(const singleContentFolder of possibleContents){

      const folderPath = `${tempFolderPath}/${singleContentFolder}`
      if (fs.existsSync(folderPath)) {

        // Read the sub-folder, fix paths and add it to the queue
        let subFolderList: any[] = fs.readdirSync(folderPath)
        subFolderList = subFolderList.map((single) => {
          return {
            folderPath: `${folderPath}/${single}`,
            folderToCopyPath: `${this.MKPaths.wdBase}/${singleContentFolder}/${single}`,
            name: single,
            type: singleContentFolder,
            willInstall: true,
            alreadyExists: false,
            installedVersion: "N/A",
            newVersion: "N/A"
          }}
        )
        extractionQueue = [...extractionQueue, ...subFolderList]
      }
    }

    // Construct the final data object
    const queueAddition: interfaceInstallerQueueMember = {
      timestamp: timestamp,
      masterPath: tempFolderPath,
      name: this.installationType.installerName,
      extractionQueue: extractionQueue,
      sourceComponentData: input
    }

    // Commit the new queue item to the store
    this.storeAddToInstallationQueue(queueAddition)

  }

}
