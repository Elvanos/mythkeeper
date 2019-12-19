/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceExpertMode extends VuexModule {


  /* -------------------------------------------------------- */
  /* ------------SECTION: EXPERT MODE ALLOWANCE------------ */
  /* -------------------------------------------------------- */


  /**
   * Determines if the Expert mode is currently allowed or not.
   * Disabled by default, can be turned on from the settings.
   */
  isExpertModeAllowed: boolean = false

  /**
   * Retrieves the Expert mode allowance.
   * Returns true/false.
   * @returns isExpertModeAllowed
   */
  get storeGetIsExpertModeAllowed() {
    return this.isExpertModeAllowed
  }

  /**
   * Sets the Expert mode allowance to true or false.
   * @param expertMode - Determines if the Expert mode allowance is on or off.
   * @see isExpertModeAllowed
   */
  @Mutation
  SET_IS_EXPERT_MODE_ALLOWED(expertMode: boolean) {
    this.isExpertModeAllowed = expertMode
  }

  /**
   * Commits a mutation to modify the Expert mode allowance.
   * @param expertMode - Determines if the Expert mode allowance is on or off.
   * @see SET_IS_EXPERT_MODE_ALLOWED
   */
  @Action
  async storeSetIsExpertModeAllowed(expertMode: boolean) {
    this.context.commit("SET_IS_EXPERT_MODE_ALLOWED", expertMode)
  }

}
