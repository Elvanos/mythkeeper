/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import fs from "fs-extra"
import {remote} from "electron"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


export default class pathChecker {


  /* --------------------------------------------------- */
  /* ------------SECTION: STATIC UTILITIES------------ */
  /* --------------------------------------------------- */


  /**
   * Sets the very, most default Wonderdraft path from Electron into the "AppData" folder on different devices
   */
  static PATH_wdUserFolder = remote.app.getPath("appData") + "\\Wonderdraft"

  /**
   * Checks if a path exists and logs into console if it doesn't.
   * Essentially a pimped-up "fs.existSync".
   * @param folderPath - Absolute path to check.
   * @param suppressWarning - Determines if we want to suppress a console warning or not. Default on.
   * @returns True or False.
   */
  static checkExist(folderPath: string, suppressWarning: boolean = false){

    // If path exists
    if (fs.existsSync(folderPath)){
      return true
    }

    // If path doesnt exist
    else {
      if(!suppressWarning){
        console.warn(`Folder: "${folderPath}" doesn't exist.`)
      }
      return false
    }

  }

  /**
   * Quick check if Wondedrdraft user folder exists or not.
   * @returns True or False
   */
  static existsWdUserFolder(){
    return this.checkExist(this.PATH_wdUserFolder)
  }

}
