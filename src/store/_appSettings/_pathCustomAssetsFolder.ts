/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class pathCustomAssetsFolder extends VuexModule {


  /* ------------------------------------------------------- */
  /* ------------SECTION: CUSTOM ASSETS FOLDER------------ */
  /* ------------------------------------------------------- */


  /**
   * An absolute path leading to the Wonderdraft custom assets folder
   */
  PATH_customAssetFolder: string = ""

  /**
   * Retrieves the Wonderdraft user custom assets folder
   * @returns PATH_customAssetFolder
   */
  get storeGet_PATH_customAssetFolder() {
    return this.PATH_customAssetFolder
  }

  /**
   * Modifies the custom assets folder state with a new path.
   * @param pathInput - The new absolute path to modify the state with.
   * @see PATH_customAssetFolder
   */
  @Mutation
  SET_PATH_CUSTOM_ASSET_FOLDER(pathInput: string) {
    this.PATH_customAssetFolder = pathInput
  }

  /**
   * Commits a mutation to modify the custom assets folder.
   * @param pathInput - The new absolute path to modify the state with.
   * @see SET_PATH_CUSTOM_ASSET_FOLDER
   */
  @Action
  async storeSet_PATH_customAssetFolder(pathInput: string) {
    this.context.commit("SET_PATH_CUSTOM_ASSET_FOLDER", pathInput)
  }

}
