/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class componentLock extends VuexModule {


  /* -------------------------------------------------- */
  /* ------------SECTION: COMPONENT LOCK ------------ */
  /* -------------------------------------------------- */


  /**
   * Determines the list of current locked components based on absolute path string for each component.
   */
  componentLocks: string[] = []

  /**
   * Retrieves the current list of currently locked components
   * @returns componentLocks
   */
  get storeGetComponentLocks() {
    return this.componentLocks
  }


  /* ------------Sub-section: ADD LOCK ------------ */

  /**
   * Adds a component lock to the list.
   * @param lockPath - An absolute path of whatever component is getting locked.
   * @see componentLocks
   */
  @Mutation
  ADD_COMPONENT_LOCK(lockPath: string) {
    this.componentLocks.push(lockPath)
  }

  /**
   * Commits a component lock to be added into the list
   * @param lockPath - An absolute path of whatever component is getting locked.
   * @see ADD_COMPONENT_LOCK
   */
  @Action
  async storeAddComponentLock(lockPath: string) {
    this.context.commit("ADD_COMPONENT_LOCK", lockPath)
  }


  /* ------------Sub-section: REMOVE LOCK ------------ */

  /**
   * Removes a component lock from the list.
   * @param lockPath - An absolute path of whatever component is being removed.
   * @see componentLocks
   */
  @Mutation
  REMOVE_COMPONENT_LOCK(lockPath: string) {
    // Filter out the lock we need from the lock list based on the path of the current lock being removed.
    let lockIndex: number = -1
    this.componentLocks.forEach((singleLock, index)=> {

      // When we find one, set the index to it
      if (singleLock === lockPath){
        lockIndex = index
      }
    })

    // Remove the lock
    this.componentLocks.splice( lockIndex, 1)
  }

  /**
   * Commits a component lock to be removed from the list
   * @param lockPath - An absolute path of whatever component is being removed.
   * @see REMOVE_COMPONENT_LOCK
   */
  @Action
  async storeRemoveComponentLock(lockPath: string) {
    this.context.commit("REMOVE_COMPONENT_LOCK", lockPath)
  }


  /* ------------------------------------------------------- */
  /* ------------SECTION: COMPONENT LOCK RESET------------ */
  /* ------------------------------------------------------- */


  /**
   * Sets the component locks to empty state.
   * @see componentLocks
   */
  @Mutation
  RESET_COMPONENT_LOCKS() {
    this.componentLocks = []
  }

  /**
   * Commits the component locks reset.
   * @see RESET_COMPONENT_LOCKS
   */
  @Action
  async storeResetComponentLocks() {
    this.context.commit("RESET_COMPONENT_LOCKS")
  }



}


