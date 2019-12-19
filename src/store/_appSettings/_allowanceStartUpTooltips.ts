/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceStartUpTooltips extends VuexModule {


  /* --------------------------------------------------------- */
  /* ------------SECTION: STARTUP TIPS ALLOWANCE------------ */
  /* --------------------------------------------------------- */


  /**
   * Determines if the Startup tips are currently allowed or not.
   * Enabled by default, can be turned off from the settings.
   */
  isStartupTipsAllowed: boolean = true

  /**
   * Retrieves the Startup tips allowance.
   * Returns true/false.
   * @returns isStartupTipsAllowed
   */
  get storeGetIsStartupTipsAllowed() {
    return this.isStartupTipsAllowed
  }

  /**
   * Sets the Startup tips allowance to true or false.
   * @param startupTips - Determines if the Startup tips allowance is on or off.
   * @see isStartupTipsAllowed
   */
  @Mutation
  SET_IS_STARTUP_TIPS_ALLOWED(startupTips: boolean) {
    this.isStartupTipsAllowed = startupTips
  }

  /**
   * Commits a mutation to modify the Startup tips allowance.
   * @param startupTips - Determines if the Startup tips allowance is on or off.
   * @see SET_IS_STARTUP_TIPS_ALLOWED
   */
  @Action
  async storeSetIsStartupTipsAllowed(startupTips: boolean) {
    this.context.commit("SET_IS_STARTUP_TIPS_ALLOWED", startupTips)
  }

}


