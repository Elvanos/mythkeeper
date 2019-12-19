/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Module, VuexModule } from "vuex-module-decorators"

// The actual translation file
import translationsFile from "@/translations/translations"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class translations extends VuexModule {


  /* -------------------------------------------------- */
  /* ------------SECTION: TRANSLATIONS -------------- */
  /* -------------------------------------------------- */


  /**
   * An imported translations files.
   * For more information see the source file.
   */
  translationList: any = translationsFile

  /**
   * Retrieves the translation object.
   * @see translationList
   */
  get $t() {
    return this.translationList
  }

}


