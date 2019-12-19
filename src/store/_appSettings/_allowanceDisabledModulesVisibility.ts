/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceDisabledModulesVisibility extends VuexModule {


  /* -------------------------------------------------------------- */
  /* ------------SECTION: DISABLED MODULES VISIBILITY------------ */
  /* -------------------------------------------------------------- */


  /**
   * Determines if the Disabled modules are currently allowed to show or not.
   * They show by default, but can be turned off manually.
   */
  areDisabledModulesShowing: boolean = true

  /**
   * Retrieves the Disabled modules visibility allowance.
   * Returns true/false.
   * @returns areDisabledModulesShowing
   */
  get storeGetAreDisabledModulesShowing() {
    return this.areDisabledModulesShowing
  }

  /**
   * Sets the Disabled modules visibility allowance to true or false.
   * @param areShown - Determines if the Disabled modules visibility allowance is on or off.
   * @see isProfilesModuleAllowed
   */
  @Mutation
  SET_ARE_DISABLED_MODULES_SHOWING(areShown: boolean) {
    this.areDisabledModulesShowing = areShown
  }

  /**
   * Commits a mutation to modify the Disabled modules visibility allowance.
   * @param areShown - Determines if the Disabled modules visibility allowance is on or off.
   * @see SET_ARE_DISABLED_MODULES_SHOWING
   */
  @Action
  async storeSetAreDisabledModulesShowing(areShown: boolean) {
    this.context.commit("SET_ARE_DISABLED_MODULES_SHOWING", areShown)
  }

}
