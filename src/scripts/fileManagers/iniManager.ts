/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import fs from "fs-extra"
//@ts-ignore
import iniReader from "ini"


/* ---------------------------------------- */
/* ------------INI MANAGER CLASS---------- */
/* ---------------------------------------- */

/**
 * Class used to read and write INI files.
 */
export default class iniManager {

  /**
   * Read and parses an ini file
   * @param iniPath - An absolute path to the ini file
   * @returns any - The ini contents in JSON format OR a "false" if nothing was found
   */
  static readIni(iniPath: string){

    if (fs.existsSync(iniPath)){
      return iniReader.parse(fs.readFileSync(iniPath, "utf-8"))
    }
    else{
      return false
    }

  }

  /**
   * Writes an INI file
   * @param iniPath - An absolute path to the ini file
   * @param iniContent - JSON input of the INI contents
   */
  static writeIni(iniPath: string,iniContent: any){
    fs.writeFileSync(iniPath,iniReader.stringify(iniContent))
  }

  /**
   * Writes INI specifically for Wonderdraft
   * @param iniPath - An absolute path to the ini file
   * @param iniContent - JSON input of the INI contents
   */
  static modifyIniWDCustomAssetFolder(iniPath: string,iniContent: any){

    // Replace all "\" with "\\" since WD wont read it otherwise
    const profilePath = iniContent.Preferences.custom_assets_directory.replace(/\\/g,"\\\\")

    // Read currently set INI settings
    let returnString = fs.readFileSync(iniPath, "utf-8")

    // If Custom asset Directory is set in the ini
    if (returnString.includes("custom_assets_directory=")){

      // Replace everything after "custom_assets_directory=" with the "profilePath"
      returnString = returnString.replace(/(?<=custom_assets_directory=\")(.*)(?=\")/, profilePath)
    }

    // If Custom asset Directory is NOT set in the ini
    else{

      // Add a whole new line after "[Preferences]"
      returnString = returnString.replace(
        "[Preferences]",`[Preferences]\n\ncustom_assets_directory="${profilePath}"`)
    }

    // Reset default theme and symbols set so we won't get errors in WD for switching profiles
    returnString = returnString.replace(/default_symbol_set="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/, "")
    returnString = returnString.replace(/default_theme="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/, "")

    // Finally write the INI file
    fs.writeFileSync(iniPath, returnString)

  }

}
