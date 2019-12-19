/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import NodeStreamZip from "node-stream-zip"
import path from "path"
import fs from "fs-extra"
import getSize from "du"
import copyProgress from "recursive-copy-progress"
import through2 from "through2"
import klaw from "klaw"


// Types
import typeInstallerPackageVariations from "@/scripts/interfaces/_typeInstallerPackageVariations"

// Interfaces
import interfaceMKPaths from "@/scripts/interfaces/_interfaceMKPaths"
import interfaceInstaller from "@/scripts/interfaces/_interfaceInstaller"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


/**
 * Manages installing of assets/themes/etc.
 * The class expects the existence of proper Mythkeeper folder structure for the installation!
 */
export default class InstallManagerMK {

  constructor(mkPaths: interfaceMKPaths = {} as interfaceMKPaths, timestamp: number = 0 ) {
    this.mkPaths = mkPaths
    this.timestamp = timestamp
  }


  /* --------------------------------------------------- */
  /* ------------SECTION: STATIC UTILITIES------------ */
  /* --------------------------------------------------- */


  /**
   * This method scans the input file for the installation.
   * @param inputFileLocation - Location of the input file without any "\\".
   * @param expectedType - Expected type of an input from the install file. Allows for assuming the user know what he is doing when determining uncertain conditions.
   * @returns A type of the installed needing to called upon the input file. Returns false if it is a faulty file OR error.
   */
  static async scanInputFile(inputFileLocation: string, expectedType: typeInstallerPackageVariations){

    let installerType:interfaceInstaller = {
      installerFilePath: inputFileLocation,
      installerName: false,
      installerType: false,
      hasOverWrapper: false,
      lacksWrapper: false
    }

    await new Promise((resolve) => {


      /* ---------- SECTION: SETUP ----------*/

      // Assume that the installer is using wrong file... just because we know what people like to do sometimes
      let firstCheck:boolean = false

      // First path inside the asset. By default we expect the asset to be packed intelligently, so it is empty
      let corePath:string =  ""

      // Possible content types
      const packageStructure = {
        hasThemes: false,
        hasAssets: false,
        hasBrushes: false
      }

      // Package contents checker
      const checkPackage = (filePath:string) => {

        if (filePath !== undefined) {

          if (filePath.includes("assets/")) {
            installerType.hasOverWrapper = true
            packageStructure.hasAssets = true
          }

          if (filePath.includes("themes/")) {
            installerType.hasOverWrapper = true
            packageStructure.hasThemes = true
          }

          if (filePath.includes("brushes/")) {
            installerType.hasOverWrapper = true
            packageStructure.hasBrushes = true
          }
        }
      }

      // Theme contents checker
      const checkTheme = (filePath:string) => {

        if (filePath !== undefined) {

          if (filePath.includes(".wonderdraft_theme")) {
            packageStructure.hasThemes = true
          }

        }
      }

      // Asset contents checker
      const checkAsset = (filePath:string) => {

        if (filePath !== undefined) {

          // Determine if it even an asset
          if (
            filePath.includes("fonts/") ||
              filePath.includes("names/") ||
              filePath.includes("sprites/") ||
              filePath.includes("sprites/symbols/") ||
              filePath.includes("sprites/mountains/") ||
              filePath.includes("sprites/trees/") ||
              filePath.includes("textures/") ||
              filePath.includes("textures/ground") ||
              filePath.includes("textures/boxes") ||
              filePath.includes("textures/frames") ||
              filePath.includes("textures/paths") ||
              filePath.includes("textures/water")
          ) {
            packageStructure.hasAssets = true
          }

          // Check if the asset is packed inside "assets" folder
          if (
            filePath.includes("assets/fonts/") ||
              filePath.includes("assets/names/") ||
              filePath.includes("assets/sprites/") ||
              filePath.includes("assets/sprites/symbols/") ||
              filePath.includes("assets/sprites/mountains/") ||
              filePath.includes("assets/sprites/trees/") ||
              filePath.includes("assets/textures/") ||
              filePath.includes("assets/textures/ground") ||
              filePath.includes("assets/textures/boxes") ||
              filePath.includes("assets/textures/frames") ||
              filePath.includes("assets/textures/paths") ||
              filePath.includes("assets/textures/water")
          ) {
            installerType.hasOverWrapper = true
          }

          // Check if the pack has direct WD folders without any wrapper at all (don't do this, seriously)
          if (
            (filePath.includes("fonts/") && !filePath.includes("/fonts/")) ||
                (filePath.includes("names/") && !filePath.includes("/names/")) ||
                (filePath.includes("sprites/") && !filePath.includes("/sprites/")) ||
                (filePath.includes("sprites/symbols/") && !filePath.includes("/sprites/symbols/")) ||
                (filePath.includes("sprites/mountains/") && !filePath.includes("/sprites/mountains/")) ||
                (filePath.includes("sprites/trees/") && !filePath.includes("/sprites/trees/")) ||
                (filePath.includes("textures/") && !filePath.includes("/textures/")) ||
                (filePath.includes("textures/ground/") && !filePath.includes("/textures/ground")) ||
                (filePath.includes("textures/boxes/") && !filePath.includes("/textures/boxes")) ||
                (filePath.includes("textures/frame/") && !filePath.includes("/textures/frames")) ||
                (filePath.includes("textures/path/") && !filePath.includes("/textures/paths")) ||
                (filePath.includes("textures/water/") && !filePath.includes("/textures/water"))
          ) {
            installerType.lacksWrapper = true
          }

        }
      }

      /* ---------- SECTION: READ THE FILE ----------*/

      // Get the base path name without the extension
      installerType.installerName = path.basename(inputFileLocation, path.extname(inputFileLocation))

      // If it is a single file theme (wonderdraft_theme file), instantly finish
      if (inputFileLocation.includes(".wonderdraft_theme")) {

        // Set rest of the data
        installerType.installerType = "singleTheme"
        installerType.lacksWrapper = true

        resolve()
        return
      }

      // Load the file into memory and determine if it is some kind of a valid input or not
      const readZip = (inputFileLocation:string):any => {

        // Open the file into stream
        const zipProcess = new NodeStreamZip({
          file: inputFileLocation,
          storeEntries: true
        })

        // Throw an error in case something goes bad
        zipProcess.on("error", err => {
          console.error(err)
          zipProcess.close()
        })

        // Run when the file is ready to be read
        zipProcess.on("ready", () => {


          /* ---------- SUBSECTION: READ THE STREAM ---------- */

          // Inspect the whole folder structure of the package
          for (let entry of Object.values(zipProcess.entries())) {

            // Fix TS inputs
            const inputEntry: any = entry

            // Run only on directories
            if (inputEntry.isDirectory) {

              // Save core path of the zip file in order to check for bad folder structure later
              if (firstCheck === false) {
                firstCheck = true

                // Cut off the last "/" from the string
                corePath = inputEntry.name.slice(0, -1)
              }

            }

            // Check for multi-package
            checkPackage(inputEntry.name)

            // Check for assets
            checkAsset(inputEntry.name)

            // Check for themes
            checkTheme(inputEntry.name)

          }


          /* ---------- SUBSECTION: DETERMINE PACKAGE CONTENTS RESULTS ---------- */

          // If we determined the input file is a package
          if ((packageStructure.hasThemes && packageStructure.hasBrushes) ||
              (packageStructure.hasThemes && packageStructure.hasAssets) ||
              (packageStructure.hasBrushes && packageStructure.hasAssets) ) {

            // Return "package" type
            installerType.hasOverWrapper = true
            installerType.installerType = "package"
            zipProcess.close()
            resolve()
            return
          }

          // If we determined the input file is an asset
          if (packageStructure.hasAssets) {

            // Return "asset" type
            installerType.installerType = "asset"
            zipProcess.close()
            resolve()
            return
          }

          // If we determined the input file is a theme
          if (packageStructure.hasThemes) {

            // Return "theme" type
            installerType.installerType = "theme"
            zipProcess.close()
            resolve()
            return
          }

          // If we determined the input file is a brush
          if (packageStructure.hasBrushes) {

            // Return "brush" type
            installerType.installerType = "brush"
            zipProcess.close()
            resolve()
            return
          }


          /* ---------- SUBSECTION: ASSUME PACKAGE CONTENTS RESULTS ---------- */

          if (expectedType === "brush") {
            installerType.installerType = "brush"
            zipProcess.close()
            resolve()
            return
          }


          /* ---------- SUBSECTION: UNKNOWN FOLDER FORMAT---------- */

          installerType.installerType = false
          zipProcess.close()
          resolve()
          return

        })
      }


      /* ---------- SECTION: RUN THE ZIP READER ---------- */

      // Check for the type
      readZip(inputFileLocation)

    })
    return installerType
  }


  /* --------------------------------------------- */
  /* ------------SECTION: UNPACK FILE------------ */
  /* --------------------------------------------- */


  /**
   * Local instance of the MK files
   */
  private mkPaths = {} as interfaceMKPaths


  /**
   * Timestamp when this instance was created. Used to determine the directory of the unpacking
   */
  private readonly timestamp = 0 as number


  /**
   * Unpacking progress % that gets update from "unpackFile"
   * @see unpackFile
   */
  private unpackProgress : number = 0

  /**
   * Gets the value of "unpackProgress"
   * @see unpackProgress
   * @returns - Floored percentage
   */
  getUnpackProgress(){
    return this.unpackProgress
  }

  /**
   * Unpacks a zip file (or a single .wonderdraft_theme in edge cases)
   * @param installationType - Data batch for the installer
   * @see unpackProgress
   */
  public async unpackFile(installationType: interfaceInstaller){

    await new Promise(async (resolve) => {

      // Set sizes first
      const unpackFileSize:number = await getSize(installationType.installerFilePath)
      let remainingSizeToUnpack:number = 0

      // Set the path
      let unpackFolder:string = `${this.mkPaths.mkTemp}/${this.timestamp}`

      // Make the unpack folder - we don't need to check if it exists, since the timestamp is individual every time
      fs.mkdirpSync(unpackFolder)

      // If we lack an over-wrapper on the input files, create one first before unpacking
      if (!installationType.hasOverWrapper && !installationType.lacksWrapper) {

        if (installationType.installerType === "singleTheme" || installationType.installerType === "theme") {
          unpackFolder += "/themes"
          fs.mkdirpSync(unpackFolder)
        }

        if (installationType.installerType === "brush" || installationType.installerType === "specialBrush") {
          unpackFolder += "/brushes"
          fs.mkdirpSync(unpackFolder)
        }

        if (installationType.installerType === "asset") {
          unpackFolder += "/assets"
        }

        // Make the nested unpack folder and update the folder path
        fs.mkdirpSync(unpackFolder)
      }

      // If we lack any wrapper at all
      if (!installationType.hasOverWrapper && installationType.lacksWrapper) {

        if (installationType.installerType === "theme" || installationType.installerType === "singleTheme") {
          unpackFolder += "/themes"
        }

        if (installationType.installerType === "brush" || installationType.installerType === "specialBrush") {
          unpackFolder += "/brushes"
        }

        if (installationType.installerType === "asset") {
          unpackFolder += "/assets"
        }

        // Make the nested unpack folder and update the folder path
        fs.mkdirpSync(unpackFolder)
        unpackFolder += "/"+installationType.installerName
        fs.mkdirpSync(unpackFolder)

      }

      // If anything at all except for single theme
      if (installationType.installerType !== "singleTheme") {

        // Load the file into memory
        const zipProcess = new NodeStreamZip({
          file: installationType.installerFilePath,
          storeEntries: true
        })
        zipProcess.on("ready", () => {

          // Update the percentage
          zipProcess.on("extract", (entry) => {
            remainingSizeToUnpack += entry.size
            this.unpackProgress = Math.floor(remainingSizeToUnpack / unpackFileSize * 100)
            if (this.unpackProgress > 100) {
              this.unpackProgress = 100
            }
          })

          // Exit and close the zip when we are done
          zipProcess.extract(null, unpackFolder, async () => {
            zipProcess.close()
            await this.normalizeThemes(`${this.mkPaths.mkTemp}/${this.timestamp}/themes`)
            resolve()
          })
        })
      }

      // If single theme
      else {
        const unpackFolderFilePath = `${unpackFolder}/${installationType.installerName}.wonderdraft_theme`
        await fs.copy(installationType.installerFilePath, unpackFolderFilePath)
        this.unpackProgress = 100
        await this.normalizeThemes(`${this.mkPaths.mkTemp}/${this.timestamp}/themes`)
        resolve()
      }
    })
  }

  /**
   * Normalizes the theme folder structure for all themes in the given folder
   * @param themePath - A full path to the desired theme directory
   */
  async normalizeThemes(themePath: string){
    await new Promise(async (resolve) => {

      // Check if we have a valid path
      if (fs.existsSync(themePath)) {
        const themeList = fs.readdirSync(themePath)

        // Make a folder out of each spread theme in the folder
        for(const folderPath of themeList){
          if (folderPath.includes(".wonderdraft_theme")) {
            const newFolderName = path.basename(folderPath, path.extname(folderPath))
            fs.mkdirpSync(`${themePath}/${newFolderName}`)

            fs.moveSync(`${themePath}/${newFolderName}.wonderdraft_theme`, `${themePath}/${newFolderName}/${newFolderName}.wonderdraft_theme`)
          }
        }
      }

      resolve()
    })

  }


  /* ---------------------------------------------- */
  /* ------------SECTION: INSTALLATION------------ */
  /* ---------------------------------------------- */


  /**
   * Backup progress % that gets update from "backupSingle"
   * @see backupSingle
   */
  private installationProgress : number = 0

  /**
   * Gets the value of "backupProgress"
   * @see backupProgress
   * @returns - Floored percentage
   */
  getInstallationProgress(){
    return this.installationProgress
  }

  /**
   * Creates/overwrites a assets/themes/etc. backup
   * @param unpackFromPath - A full folder path.
   * @param unpackToPath - A full folder path.
   */
  async installSingle(unpackFromPath: string, unpackToPath: string){


    const unpackToPathExists = fs.existsSync(unpackToPath)

    // Read max asset size
    const assetSize = await getSize(unpackFromPath)

    // Set variable for additive processed size from the max size
    let remainingSize = 0

    // Only delete files if they actually exist
    if (unpackToPathExists) {

      // Wait for the full delete before moving on
      await new Promise((resolve) => {

        // Grab files from the stream and delete them one by one if they are files.
        // Leave them be if they are directories, we will delete them later.
        const deleteAction = through2.obj(function (item: any, enc: any, next: any) {
          //@ts-ignore
          this.push(item)

          if (!fs.lstatSync(item.path).isDirectory() ) {
            fs.unlink(item.path, next)
          } else {
            next()
          }
        })

        // Run through the folder
        klaw(unpackToPath,{depthLimit: -1})

        // Delete each file
          .pipe(deleteAction)

        // On each file deleted, calculate how much we have remaining of the size
          .on("data", (item:any) => {
            remainingSize = remainingSize + item.stats.size
            this.installationProgress = Math.floor(remainingSize / assetSize * 100 / 4)
          })

        // When we done, finish up and clean up
          .on("end", async() => {

            // Upon delete all files, delete all empty folders too, then set the progress to 25%
            await fs.remove(unpackToPath)
            this.installationProgress = 25

            // Wait 100ms before resetting the timer, since we want to report those 25% one more time
            setTimeout(() => {

              resolve()
            }, 1000)

          })
      })

    }

    // After deleting, copy files
    await copyProgress(unpackFromPath, unpackToPath, {dot: true})
      .on("progress", (update:any) => {

        // If backup exists, start from 25%
        if (unpackToPathExists) {
          this.installationProgress = Math.floor(update.transferred / assetSize * 100 / 4 * 3 + 25)
        }

        // If backup doesn't exist, start from 0%
        else {
          this.installationProgress = Math.floor(update.transferred / assetSize * 100)
        }
      })

    // Finally finish!
    return
  }



}
