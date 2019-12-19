/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class pathUserFolder extends VuexModule {


  /* ---------------------------------------------- */
  /* ------------SECTION: USER FOLDER------------ */
  /* ---------------------------------------------- */


  /**
   * An absolute path leading to the Wonderdraft user folder
   */
  PATH_userFolder: string = ""

  /**
   * Retrieves the Wonderdraft user folder path
   * @returns PATH_userFolder
   */
  get storeGet_PATH_userFolder() {
    return this.PATH_userFolder
  }

  /**
   * Modifies the user folder state with a new path.
   * @param pathInput - The new absolute path to modify the state with.
   * @see PATH_userFolder
   */
  @Mutation
  SET_PATH_USERFOLDER(pathInput: string) {
    this.PATH_userFolder = pathInput
  }

  /**
   * Commits a mutation to modify the user folder.
   * @param pathInput - The new absolute path to modify the state with.
   * @see SET_PATH_USERFOLDER
   */
  @Action
  async storeSet_PATH_userFolder(pathInput: string) {
    this.context.commit("SET_PATH_USERFOLDER", pathInput)
  }

}
