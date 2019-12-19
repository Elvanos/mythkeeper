/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceSafeDeletion extends VuexModule {


  /* ---------------------------------------------------------------- */
  /* ------------SECTION: SAFE DELETION MODE ALLOWANCE------------ */
  /* ---------------------------------------------------------------- */


  /**
   * Determines if the Safe deletion mode is currently allowed or not.
   * Enabled by default, can be turned off from the settings.
   */
  isSafeDeleteAllowed: boolean = true

  /**
   * Retrieves the Safe deletion mode allowance.
   * Returns true/false.
   * @returns isSafeDeleteAllowed
   */
  get storeGetIsSafeDeleteAllowed() {
    return this.isSafeDeleteAllowed
  }

  /**
   * Sets the Safe deletion mode allowance to true or false.
   * @param safeDelete - Determines if the Safe deletion mode allowance is on or off.
   * @see isSafeDeleteAllowed
   */
  @Mutation
  SET_IS_SAFE_DELETE_ALLOWED(safeDelete: boolean) {
    this.isSafeDeleteAllowed = safeDelete
  }

  /**
   * Commits a mutation to modify the Safe deletion mode allowance.
   * @param safeDelete - Determines if the Safe deletion mode allowance is on or off.
   * @see SET_IS_SAFE_DELETE_ALLOWED
   */
  @Action
  async storeSetIsSafeDeleteAllowed(safeDelete: boolean) {
    this.context.commit("SET_IS_SAFE_DELETE_ALLOWED", safeDelete)
  }

}
