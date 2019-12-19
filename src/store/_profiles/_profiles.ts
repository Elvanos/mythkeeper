/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class profiles extends VuexModule {


  /* ------------------------------------------- */
  /* ------------SECTION: PROFILES ------------ */
  /* ------------------------------------------- */


  /**
   * Determines the current active profile name.
   * Matches the name of the directory the profile is in.
   */
  activeProfile: string = "Default"

  /**
   * Retrieves the name of the current active profile.
   * @returns activeProfile
   */
  get storeGetActiveProfile() {
    return this.activeProfile
  }

  /**
   * Sets the currently active profile.
   * @param profile - A string name of the current active profile matching the directory on the hard disk.
   * @see activeProfile
   */
  @Mutation
  SET_ACTIVE_PROFILE(profile: string) {
    this.activeProfile = profile
  }

  /**
   * Commits the currently active profile.
   * @param profile - A string name of the current active profile matching the directory on the hard disk.
   * @see SET_ACTIVE_PROFILE
   */
  @Action
  async storeSetActiveProfile(profile: string) {
    this.context.commit("SET_ACTIVE_PROFILE", profile)
  }


  /* ------------------------------------------------ */
  /* ------------SECTION: PROFILES RESET------------ */
  /* ------------------------------------------------ */


  /**
   * Resets the currently active profile to default.
   * @see activeProfile
   */
  @Mutation
  RESET_PROFILES() {
    this.activeProfile = "Default"
  }

  /**
   * Commits the the reset of currently active profile to default.
   * @see RESET_PROFILES
   */
  @Action
  async storeResetProfiles() {
    this.context.commit("RESET_PROFILES")
  }

}


