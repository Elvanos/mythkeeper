/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import fs from "fs-extra"
import oneZip from "onezip"
import copyProgress from "recursive-copy-progress"
import klaw from "klaw"
import getSize from "du"
import progress from "progress-stream"
import through2 from "through2"

// Interfaces
import interfaceMKPaths from "@/scripts/interfaces/_interfaceMKPaths"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


/**
 * Manages backing up of assets/themes/etc.
 * The class expects the existence of proper Mythkeeper folder structure for the backup!
 */
export default class BackupManagerMK {


  /* --------------------------------------------------- */
  /* ------------SECTION: STATIC UTILITIES------------ */
  /* --------------------------------------------------- */


  /**
   * This method checks if the assets/themes/etc. has a backup.
   * @param singleName - Name of the folder without any "\\".
   * @param MKPaths - List ok Mythkeeper paths.
   * @return - True or false depending if backup exists or not.
   */
  static checkBackupSingle(singleName: string, MKPaths: interfaceMKPaths){
    const backupPath: string = MKPaths.mkBackupAssets+"\\"+singleName
    return (fs.existsSync(backupPath))
  }


  /* ---------------------------------------- */
  /* ------------SECTION: BACKUP------------ */
  /* ---------------------------------------- */


  /**
   * Backup progress % that gets update from "backupSingle"
   * @see backupSingle
   */
  private backupProgress : number = 0

  /**
   * Gets the value of "backupProgress"
   * @see backupProgress
   * @returns - Floored percentage
   */
  getBackupProgress(){
    return this.backupProgress
  }

  /**
   * Creates/overwrites a assets/themes/etc. backup
   * @param singleName - Name of the folder without any "\\"
   * @param MKPaths - List ok Mythkeeper paths
   */
  async backupSingle(singleName: string, MKPaths: interfaceMKPaths){
    const activePath: string = MKPaths.wdAssets+"\\"+singleName
    const backupPath: string = MKPaths.mkBackupAssets+"\\"+singleName

    const backupExists = fs.existsSync(backupPath)

    // Read max asset size
    const assetSize = await getSize(activePath)

    // Set variable for additive processed size from the max size
    let remainingSize = 0

    // Only delete files if they actually exist
    if (backupExists) {

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
        klaw(backupPath,{depthLimit: -1})

          // Delete each file
          .pipe(deleteAction)

          // On each file deleted, calculate how much we have remaining of the size
          .on("data", (item:any) => {
            remainingSize = remainingSize + item.stats.size
            this.backupProgress = Math.floor(remainingSize / assetSize * 100 / 4)
          })

          // When we done, finish up and clean up
          .on("end", async() => {

            // Upon delete all files, delete all empty folders too, then set the progress to 25%
            await fs.remove(backupPath)
            this.backupProgress = 25

            // Wait 100ms before resetting the timer, since we want to report those 25% one more time
            setTimeout(() => {

              resolve()
            }, 1000)

          })
      })

    }

    // After deleting, copy files
    await copyProgress(activePath, backupPath, {dot: true})
      .on("progress", (update:any) => {

        // If backup exists, start from 25%
        if (backupExists) {
          this.backupProgress = Math.floor(update.transferred / assetSize * 100 / 4 * 3 + 25)
        }

        // If backup doesn't exist, start from 0%
        else {
          this.backupProgress = Math.floor(update.transferred / assetSize * 100)
        }
      })

    // Finally finish!
    return
  }


  /* ------------------------------------------------ */
  /* ------------SECTION: DELETE BACKUP------------ */
  /* ------------------------------------------------ */


  /**
   * Delete progress % that gets update from "deleteSingleBackup"
   * @see deleteSingleBackup
   */
  private deleteProgress : number = 0

  /**
   * Gets the value of "deleteProgress"
   * @see deleteProgress
   * @returns - Floored percentage
   */
  getDeleteProgress(){
    return this.deleteProgress
  }

  /**
   * Deletes a single backup file
   * @param singleName - Name of the folder without any "\\"
   * @param MKPaths - List ok Mythkeeper paths
   * @param safeDeleteAllowed - A true/false setting of the app if safe delete mode is allowed or not
   */
  async deleteSingleBackup(singleName: string, MKPaths: interfaceMKPaths, safeDeleteAllowed: boolean){

    const activePath: string = MKPaths.mkBackupAssets+"\\"+singleName
    const activePathZip: string = MKPaths.mkBackupAssets
    const deletePath: string = MKPaths.mkDeletedAssets+"\\"+singleName+".zip"

    // Read max asset size
    const assetSize = await getSize(activePath)

    // Set variable for additive processed size from the max size
    let remainingSize = 0

    // Backup asset only if the safe mode is up
    if (safeDeleteAllowed) {

      // Zip files and wait for the zip to finish
      await new Promise((resolve) => {

        const pack = oneZip.pack(activePathZip, deletePath, [singleName])

        // Update on progress
        pack.on("progress", (percent) => {
          this.deleteProgress = Math.floor(percent / 100 * 90)
        })

        // Resolve on end
        pack.on("end", () => {
          resolve()
        })

      })
    }


    // Delete files and wait before moving on
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

      // Run thought the asset folder
      klaw(activePath,{depthLimit: -1})

        // Delete each file
        .pipe(deleteAction)

        // On each file deleted, calculate how much we have remaining of the size
        .on("data", (item:any) => {
          remainingSize = remainingSize + item.stats.size

          // Start at 90% if safe delete mode is allowed
          if (safeDeleteAllowed) {
            this.deleteProgress = Math.floor(remainingSize / assetSize * 10 + 90)
          }

          // Start at 0% if safe delete mode NOT allowed
          else{
            this.deleteProgress = Math.floor(remainingSize / assetSize * 100)
          }

        })

        // When we are done, finish up and clean up
        .on("end", async() => {

          // Upon delete all files, delete all empty folders too, then set the progress to 50% since we did half the job
          await fs.remove(activePath)
          this.deleteProgress = 100

          // Wait 100ms before resetting the timer, since we want to report those 50% one more time
          setTimeout(() => {
            resolve()
          }, 1000)

        })
    })

    // Finally finish!
    return
  }


  /* ------------------------------------------------- */
  /* ------------SECTION: RESTORE BACKUP------------ */
  /* ------------------------------------------------- */


  /**
   * Restore progress % that gets update from "restoreSingle"
   * @see restoreSingle
   */
  private restoreProgress : number = 0

  /**
   * Gets the value of "restoreProgress"
   * @see restoreProgress
   * @returns - Floored percentage
   */
  getRestoreProgress(){
    return this.restoreProgress
  }

  /**
   * Restores an asset from backup location
   * @param singleName - Name of the folder without any "\\"
   * @param MKPaths - List ok Mythkeeper paths
   */
  public async restoreSingle(singleName: string, MKPaths: interfaceMKPaths){
    const activePath: string = MKPaths.wdAssets+"\\"+singleName
    const backupPath: string = MKPaths.mkBackupAssets+"\\"+singleName

    // Read max asset size
    const assetSize = await getSize(backupPath)

    // After deleting, copy files
    await copyProgress(backupPath, activePath, {dot: true})
      .on("progress", (update:any) => {
        this.restoreProgress = Math.floor(update.transferred / assetSize * 100)
      })

    // Finally finish!
    return
  }

}
