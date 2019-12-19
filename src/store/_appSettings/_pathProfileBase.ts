/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class pathProfileBase extends VuexModule {


  /* ---------------------------------------------------- */
  /* ------------SECTION: PROFILE BASE PATH------------ */
  /* ---------------------------------------------------- */


  /**
   * An absolute path leading the Mythkeeper profiles base folder
   * This is generally the same as either Wonderdraft custom assets folder or Wonderdraft base path.
   * @see PATH_userFolder
   * @see PATH_customAssetFolder
   */
  PATH_profileBasePath: string = ""

  /**
   * Retrieves the Mythkeeper profiles base folder
   * @returns PATH_profileBasePath
   */
  get storeGet_PATH_profileBasePath() {
    return this.PATH_profileBasePath
  }

  /**
   * Modifies the custom profiles base folder state with a new path.
   * @param pathInput - The new absolute path to modify the state with.
   * @see PATH_profileBasePath
   */
  @Mutation
  SET_PATH_PATH_PROFILE_BASE_PATH(pathInput: string) {
    this.PATH_profileBasePath = pathInput
  }

  /**
   * Commits a mutation to modify the profiles base folder.
   * @param pathInput - The new absolute path to modify the state with.
   * @see SET_PATH_PATH_PROFILE_BASE_PATH
   */
  @Action
  async storeSet_PATH_profileBasePath(pathInput: string) {
    this.context.commit("SET_PATH_PATH_PROFILE_BASE_PATH", pathInput)
  }
}
