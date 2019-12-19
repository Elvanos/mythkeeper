/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class allowanceRichTooltips extends VuexModule {


  /* ---------------------------------------------------------- */
  /* ------------SECTION: RICH TOOLTIPS ALLOWANCE------------ */
  /* ---------------------------------------------------------- */


  /**
   * Determines if the Rich tooltips are currently allowed or not.
   * Enabled by default, can be turned off from the settings.
   */
  isRichTooltipsAllowed: boolean = true

  /**
   * Retrieves the Rich tooltips allowance.
   * Returns true/false.
   * @returns isRichTooltipsAllowed
   */
  get storeGetIsRichTooltipsAllowed() {
    return this.isRichTooltipsAllowed
  }

  /**
   * Sets the Rich tooltips allowance to true or false.
   * @param richTooltips - Determines if the Rich tooltips allowance is on or off.
   * @see isRichTooltipsAllowed
   */
  @Mutation
  SET_IS_RICH_TOOLTIPS_ALLOWED(richTooltips: boolean) {
    this.isRichTooltipsAllowed = richTooltips
  }

  /**
   * Commits a mutation to modify the Rich tooltips allowance.
   * @param richTooltips - Determines if the Rich tooltips allowance is on or off.
   * @see SET_IS_RICH_TOOLTIPS_ALLOWED
   */
  @Action
  async storeSetIsRichTooltipsAllowed(richTooltips: boolean) {
    this.context.commit("SET_IS_RICH_TOOLTIPS_ALLOWED", richTooltips)
  }

}


