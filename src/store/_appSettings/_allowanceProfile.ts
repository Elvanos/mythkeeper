/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceProfile extends VuexModule {


  /* ---------------------------------------------------- */
  /* ------------SECTION: PROFILE ALLOWANCE------------ */
  /* ---------------------------------------------------- */


  /**
   * Determines if the Profiles module is currently allowed or not.
   * It is disabled by default, but can be turned on manually.
   */
  isProfilesModuleAllowed: boolean = false

  /**
   * Retrieves the Profile module allowance.
   * Returns true/false.
   * @returns isProfilesModuleAllowed
   */
  get storeGetIsProfilesModuleAllowed() {
    return this.isProfilesModuleAllowed
  }

  /**
   * Sets the Profile module allowance to either true or false.
   * @param isAllowed - Determines if the Profiles module is turned on or not.
   * @see isProfilesModuleAllowed
   */
  @Mutation
  SET_IS_PROFILE_MODULE_ALLOWED(isAllowed: boolean) {
    this.isProfilesModuleAllowed = isAllowed
  }

  /**
   * Commits a mutation to modify the Profile module allowance.
   * @param isAllowed - Determines if the Profiles module is turned on or not.
   * @see SET_IS_PROFILE_MODULE_ALLOWED
   */
  @Action
  async storeSetIsProfilesModuleAllowed(isAllowed: boolean) {
    this.context.commit("SET_IS_PROFILE_MODULE_ALLOWED", isAllowed)
  }

}
