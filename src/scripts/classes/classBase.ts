/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import electron from "electron"
import { uid as qUid , extend as qExtend} from "quasar"

// Interfaces
import interfaceTask from "../interfaces/_interfaceTask"
import interfaceOverlayActions from "../interfaces/_interfaceOverlayActions"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"
import interfaceInstallerQueueMember from "@/scripts/interfaces/_interfaceInstallerQueueMember"

// Decorators & Vue base + VUEX Decorators
import { Component, Vue, Watch} from "vue-property-decorator"
import { Getter,Action} from "vuex-class"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component
export default class classBase extends Vue {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */


  /**
   * Unique ID of the component
   */
  private uniqueComponentID : string = qUid()


  /* ------------------------------ */
  /* ------------WATCH------------ */
  /* ------------------------------ */


  /**
   * Watches on changes to the store getter for the overlay action.
   * This means that this watcher detects an action paired with the ID the component it is watching on, it will then trigger an action on whatever component it is being detected on.
   */
  @Watch("storeGetOverLayTriggerAction")
  listenerOverlayAction(){

    // Trigger only if the current dialog is paired with this specific component AND ignore resets
    if (this.storeGetOverLayContents.componentID === this.getComponentID()
        && this.storeGetOverLayTriggerAction.functionName.length !== 0)
    {
      this[this.storeGetOverLayTriggerAction.functionName](this.storeGetOverLayTriggerAction.data)
    }
  }


  /* ---------------------------- */
  /* ------------VUEX------------ */
  /* ---------------------------- */


  /**
   * Allow translations to be accessible from the whole app
   * Retrieves the "translations.js" file with string translations
   */
  @Getter("$t") $t !: any

  /**
   * Allow access to the whole task list from the store to each component in the app.
   */
  @Getter("storeGetTaskList") storeGetTaskList !: interfaceTask[]

  /**
   * Allow adding tasks to the store task list for each component in the app.
   * @param newTask - The new task object to add to the list.
   */
  @Action("storeAddTask") storeActionAddTask !: (newTask: interfaceTask) => void

  /**
   * Allow removing it's own tasks from the task list from each component in the app.
   * @param taskToRemove - The task to remove from the list.
   */
  @Action storeRemoveTask !: (taskToRemove: interfaceTask) => void

  /**
   * Allow updating it's own tasks from the task list from each component in the app.
   * @param taskToUpdate - The task to update.
   */
  @Action("storeUpdateTask") storeActionUpdateTask !: (taskToUpdate: interfaceTask) => void

  /**
   * Allow access to showing of rich tooltips from the settings.
   */
  @Getter storeGetIsRichTooltipsAllowed !: boolean

  /**
   * Allow access to the safe deletion mode from the settings.
   */
  @Getter storeGetIsSafeDeleteAllowed !: boolean

  /**
   * Allow access to currently set overlay contents.
   */
  @Getter storeGetOverLayContents !: interfaceOverlayActions

  /**
   * Allow setting current overlay contents.
   * @param overlayContents - The object with data for the new overlay contents OR a list of strings for the gallery.
   */
  @Action storeSetOverLayContents !: (overlayContents: interfaceOverlayActions | string[]) => void

  /**
   * Allow access to the currently activated trigger action from overlay choice dialog
   */
  @Getter storeGetOverLayTriggerAction !: {functionName: string, data: any}

  /**
   * Allow setting of the currently activated trigger action from overlay choice dialog
   * This gets triggered by clicking on any buttons on "choiceDialog" component
   * @param overlayActionString - Name of the function that gets triggered on whatever component called this overlay into existence.
   */
  @Action storeSetOverLayTriggerAction !: ({functionName: string, data: any}) => void

  /**
   * Allow access to the currently activated trigger parameter from overlay dialog
   */
  @Getter storeGetOverLayTriggerParameter !: any

  /**
   * Allow setting of the currently activated trigger action from overlay choice dialog
   * @param overlayActionString - Name of the function that gets triggered on whatever component called this overlay into existence.
   */
  @Action storeSetOverLayTriggerParameter !: (parameterDataBatch: any) => void


  /**
   * Allow access to the base profile directory.
   */
  @Getter storeGet_PATH_profileBasePath !: string

  /**
   * Allow access to determining if the currently opened overlay is closeable or not.
   */
  @Getter storeGetIsCloseableOverlay !: boolean

  /**
   * Allow setting if currently opened overlay is closeable or not.
   * @param overlayCloseable - True/false if the overlay is closeable.
   */
  @Action storeSetIsCloseableOverlay !: (overlayCloseable: boolean) => void

  /**
   * Allow access to the currently active profile name.
   */
  @Getter storeGetActiveProfile !: string

  /**
   * Allow setting currently active profile name.
   * @param profileName - Name of the profile.
   */
  @Action storeSetActiveProfile !: (profileName: string) => void

  /**
   * Resets the active profile to "Default".
   */
  @Action storeResetProfiles !: () => void

  /**
   * Allow for the component to determine if the global overlay is closeable via outside clicks or not right now.
   * @param clickState - True/false.
   */
  @Action storeSetOutsideOverLayClick !: (clickState: boolean) => void

  /**
   * Allow for the component to determine if the global overlay is visible or not.
   * @param overlayVisibility - True/false
   */
  @Action storeSetOverlayVisibility !: (overlayVisibility: boolean) => void

  /**
   * Allow for the component to set currently active overlay component name.
   * @activeOverlayComponentName - The string name of the currently opened overlay component found in "@/pageparts/overlays"
   */
  @Action storeSetOverlayComponent !: (activeOverlayComponentName: string) => void

  /**
   * Allows access to the expert mode settings allowance.
   */
  @Getter storeGetIsExpertModeAllowed !: boolean

  /**
   * Add a new member to the installation queue.
   * @newQueue - A new data batch for the queue.
   */
  @Action storeAddToInstallationQueue !: (newQueue: interfaceInstallerQueueMember) => void

  /**
   * Remove a member from the installation queue.
   * @toRemoveQueue - A  data batch to remove from the queue.
   */
  @Action storeRemoveFromInstallationQueue !: (toRemoveQueue: interfaceInstallerQueueMember) => void

  /**
   * Allows access to the installer queue.
   */
  @Getter storeGetInstallationQueue !: interfaceInstallerQueueMember[]


  /* ------------------------------------------ */
  /* ------------METHODS: INTERNAL------------ */
  /* ------------------------------------------ */


  /**
   * Retrieves the unique ID of the component
   * @returns uniqueComponentID
   */
  protected getComponentID() {
    return this.uniqueComponentID
  }

  /**
   * Generates unique ID of the component
   * @returns qUid
   */
  private generateTaskID(){
    return qUid()
  }


  /* ------------------------------------------ */
  /* ------------METHODS: OVERLAYS------------ */
  /* ------------------------------------------ */


  /**
   * Triggers the choice dialog overlay.
   * @param contents - Data feed for the overlay.
   */
  triggerChoiceDialog(contents: overlayActionsInterface){

    // Resets action
    this.storeSetOverLayTriggerAction({functionName: "", data: {}})

    // Triggers the correct overlay
    this.storeSetOverlayComponent("choiceDialog")

    // Fills the contents of the overlay
    this.storeSetOverLayContents(contents)

    // Sets the visibility of the overlay
    this.storeSetOverlayVisibility(true)

  }

  /**
   * Triggers the choice dialog overlay.
   * @param contents - Data feed for the overlay.
   */
  triggerDownloadChoiceDialog(contents: overlayActionsInterface){

    // Resets action
    this.storeSetOverLayTriggerAction({functionName: "", data: {}})

    // Triggers the correct overlay
    this.storeSetOverlayComponent("downloadChoiceDialog")

    // Fills the contents of the overlay
    this.storeSetOverLayContents(contents)

    // Sets the visibility of the overlay
    this.storeSetOverlayVisibility(true)

  }

  /**
   * Triggers the choice dialog overlay.
   * @param parameters - Data feed for the detailed parameters.
   * @param contents - Data feed for the overlay.
   */
  triggerInstallationDialog(contents: overlayActionsInterface, parameters: interfaceInstallerQueueMember){

    // Resets action
    this.storeSetOverLayTriggerAction({functionName: "", data: {}})

    // Triggers the correct overlay
    this.storeSetOverlayComponent("installDialog")

    // Fills the contents of the overlay
    this.storeSetOverLayContents(contents)

    // Fills the contents of the overlay
    this.storeSetOverLayTriggerParameter(parameters)

    // Sets the visibility of the overlay
    this.storeSetOverlayVisibility(true)

  }

  /**
   * Triggers the gallery overlay.
   * @param imageList - A list of paths for images to show in the gallery.
   */
  triggerGallery(imageList: string[]){

    // Resets action
    this.storeSetOverLayTriggerAction({functionName: "", data: {}})

    // Triggers the correct overlay
    this.storeSetOverlayComponent("gallerySlider")

    // Fills the contents of the overlay (in this case string list)
    this.storeSetOverLayContents(imageList)

    // Sets the visibility of the overlay
    this.storeSetOverlayVisibility(true)

  }

  /**
   * Triggers closing of any active overlay
   */
  closeModal(){

    // Hide the overlay
    this.storeSetOverlayVisibility(false)

    // Disable closing of the overlay via escape or clicking outside
    this.storeSetOutsideOverLayClick(false)

    // Unhook active overlay from the prent component
    this.storeSetOverlayComponent("")
  }


  /* --------------------------------------- */
  /* ------------METHODS: TASKS------------ */
  /* --------------------------------------- */


  /**
   * Adds new task to the task list.
   * @param taskDescription - A short description of what the task is doing (eg: "Deleting")
   * @param taskName - The name of the individual task (eg: "Elvanos mountains")
   */
  commitNewTask(taskDescription: string,taskName: string) {

    // Current list of tasks in the store
    const currentStoreTaskList = this.storeGetTaskList

    // Generate unique ID for the task
    let taskID : string
    let duplicateTasks : object[]

    // Cycle for as long as we get an actually unique ID
    do {

      // Generate a random ID
      taskID = this.generateTaskID()

      // Check if the ID already exists in active tasks
      duplicateTasks = currentStoreTaskList.filter((taskObservable : object)  => {

        // Duplicate object so we can access it
        const taskObject: any = {}
        qExtend(true, taskObject, taskObservable)

        // Return if we have a duplicate
        return taskObject.uniqueTaskID === taskID

      })
    }
    while (duplicateTasks.length !== 0)

    // Generate new task IDs
    const newTask = {
      taskDescription: taskDescription,
      taskName: taskName,
      uniqueComponentID: this.uniqueComponentID,
      uniqueTaskID: taskID,
      progress: 0
    }

    // Add to global store list
    this.storeActionAddTask(newTask)

    // Return the Task
    return newTask

  }

  /**
   * Updates the appropriate task in the task list.
   * @param taskObject - Data object that helps match the task previously created.
   * @param progress - 1-100 progress number.
   */
  updateTask(taskObject:interfaceTask, progress: number|string) {
    taskObject.progress = progress
    this.storeActionUpdateTask(taskObject)
  }

  /**
   * Removes the appropriate task from the task list.
   * @param taskObject - Data object that helps match the task previously created.
   */
  removeTask(taskObject:interfaceTask){

    this.storeRemoveTask( taskObject)
  }


  /* ---------------------------------------------- */
  /* ------------METHODS: UNCATALOGUED------------ */
  /* ---------------------------------------------- */


  /**
   * Opens URL via Electon's openExternal
   * @param link - The URL for the link
   */
  openURL(link:string) {
    electron.shell.openExternal(link)
  }

  /**
   * Escapes HTML string for printing it out.
   * @param text - The input string.
   * @returns Escaped text ready to be displayed.
   */
  escapeHtml(text:string) {
    let replacementCharactersList: any = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }
    return text.replace(
      /[&<>"']/g,
      function(m) {
        return replacementCharactersList[m]
      })
  }

}
