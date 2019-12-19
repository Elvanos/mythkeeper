/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"
import interfaceOverlayActions from "@/scripts/interfaces/_interfaceOverlayActions"
import interfaceInstallerQueueMember from "@/scripts/interfaces/_interfaceInstallerQueueMember"
import interfaceTask from "@/scripts/interfaces/_interfaceTask"
import {extend as qExtend} from "quasar"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class installQueue extends VuexModule {


  /* ------------------------------------------------ */
  /* ------------SECTION: ACTIVE MODULE------------ */
  /* ------------------------------------------------ */


  /**
   * Determines the current active module component.
   */
  installationQueue: interfaceInstallerQueueMember[] = []

  /**
   * Retrieves the current active module component name.
   * @returns installationQueue
   */
  get storeGetInstallationQueue() {
    return this.installationQueue
  }


  /* ------------Sub-section: ADD TO INSTALLATION QUEUE ------------ */

  /**
   * Adds new task to the task list.
   * @param newInstallationQueue - A new task to be added to the list.
   * @see taskList
   */
  @Mutation
  ADD_TO_INSTALLATION_QUEUE(newInstallationQueue: interfaceInstallerQueueMember) {
    this.installationQueue.push(newInstallationQueue)
  }

  /**
   * Commits a new task to be added to the list.
   * @param newInstallationQueue - A new task to be added to the list.
   * @see ADD_TO_INSTALLATION_QUEUE
   */
  @Action
  async storeAddToInstallationQueue(newInstallationQueue: interfaceInstallerQueueMember) {
    this.context.commit("ADD_TO_INSTALLATION_QUEUE", newInstallationQueue)
  }


  /* ------------Sub-section: REMOVE FROM INSTALLATION QUEUE ------------ */

  /**
   * Removes a task from the list
   * @param removeQueue - Task to be removed
   * @see taskList
   */
  @Mutation
  REMOVE_FROM_INSTALLATION_QUEUE(removeQueue: interfaceInstallerQueueMember) {

    // Filter out the queue from the list global list based on the timestamp
    let queueIndex: number = -1
    this.installationQueue.forEach((singleTask, index)=> {
      const queueObject : any = {}
      qExtend(true, queueObject, singleTask)

      if (queueObject.uniqueTaskID === removeQueue.timestamp) {queueIndex = index}
    })

    // Remove the queue
    this.installationQueue.splice( queueIndex, 1)

  }

  /**
   * Commits a task to be removed from the list.
   * @param taskToRemove - Task to be removed
   */
  @Action
  async storeRemoveFromInstallationQueue(taskToRemove: interfaceInstallerQueueMember) {
    this.context.commit("REMOVE_FROM_INSTALLATION_QUEUE", taskToRemove)
  }


  /* --------------------------------------------------------------- */
  /* ------------SECTION: RESET INSTALLATION QUEUE---------------- */
  /* --------------------------------------------------------------- */


  /**
   * Cleans the installation queue
   * @see installationQueue
   */
  @Mutation
  RESET_INSTALLATION_QUEUE() {

    this.installationQueue = []

  }

  /**
   * Commits an installation queue reset.
   * @see RESET_INSTALLATION_QUEUE
   */
  @Action
  async storeResetInstallationQueue() {
    this.context.commit("RESET_INSTALLATION_QUEUE")
  }

}
