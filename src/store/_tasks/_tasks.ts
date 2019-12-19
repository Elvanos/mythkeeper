/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import { extend as qExtend} from "quasar"

// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"

// Interfaces
import interfaceTask from "@/scripts/interfaces/_interfaceTask"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class moduleTasks extends VuexModule {


  /* ------------------------------------------------- */
  /* ------------ SECTION: TASK MANAGER ------------ */
  /* ------------------------------------------------- */


  /**
   * Hosts the list of currently active tasks being processed via the background worker window.
   */
  taskList: interfaceTask[] = []

  /**
   * Retrieves the current task list.
   * @returns taskList
   */
  get storeGetTaskList() {
    return this.taskList
  }


  /* ------------Sub-section: ADD TASK ------------ */

  /**
   * Adds new task to the task list.
   * @param newTask - A new task to be added to the list.
   * @see taskList
   */
  @Mutation
  ADD_TASK(newTask: interfaceTask) {
    this.taskList.push(newTask)
  }

  /**
   * Commits a new task to be added to the list.
   * @param newTask - A new task to be added to the list.
   * @see ADD_TASK
   */
  @Action
  async storeAddTask(newTask: interfaceTask) {
    this.context.commit("ADD_TASK", newTask)
  }


  /* ------------Sub-section: REMOVE TASK ------------ */

  /**
   * Removes a task from the list
   * @param taskToRemove - Task to be removed
   * @see taskList
   */
  @Mutation
  REMOVE_TASK(taskToRemove: interfaceTask) {

    // Filter out the task we need from the global list based on the task ID
    let taskIndex: number = -1
    this.taskList.forEach((singleTask, index)=> {
      const taskObject : any = {}
      qExtend(true, taskObject, singleTask)

      if (taskObject.uniqueTaskID === taskToRemove.uniqueTaskID) {taskIndex = index}
    })

    // Remove the task
    this.taskList.splice( taskIndex, 1)

  }

  /**
   * Commits a task to be removed from the list.
   * @param taskToRemove - Task to be removed
   */
  @Action
  async storeRemoveTask(taskToRemove: interfaceTask) {
    this.context.commit("REMOVE_TASK", taskToRemove)
  }


  /* ------------Sub-section: UPDATE TASK ------------ */

  /**
   * Updates a task with new data.
   * Mostly meant for updating progress, but can update anything else on the task object as well.
   * @param taskToUpdate - Task to be updated.
   */
  @Mutation
  UPDATE_TASK(taskToUpdate: interfaceTask) {

    // Filter out the task we need from the global list based on the task ID
    let taskIndex: number = -1
    this.taskList.forEach((singleTask, index)=> {

      const taskObject : any = {}
      qExtend(true, taskObject, singleTask)

      if (taskObject.uniqueTaskID === taskToUpdate.uniqueTaskID) {taskIndex = index}
    })

    // Apply the changes to the proper task based on array
    this.taskList[taskIndex].progress = taskToUpdate.progress
    this.taskList[taskIndex].taskDescription = taskToUpdate.taskDescription
    this.taskList[taskIndex].taskName = taskToUpdate.taskName


  }

  /**
   * Commit an update for a task with new data.
   * Mostly meant for updating progress, but can update anything else on the task object as well.
   * @param taskToUpdate - Task to be updated.
   */
  @Action
  async storeUpdateTask(taskToUpdate: object) {
    this.context.commit("UPDATE_TASK", taskToUpdate)
  }


  /* ---------------------------------------------- */
  /* ------------ SECTION: TASK RESET ------------ */
  /* ---------------------------------------------- */


  /**
   * Clears the task list.
   * @see taskList
   */
  @Mutation
  RESET_TASKLIST() {
    this.taskList = []
  }

  /**
   * Commits the clear of a task list.
   * @see RESET_TASKLIST
   */
  @Action
  async storeResetTaskList() {
    this.context.commit("RESET_TASKLIST")
  }

}


