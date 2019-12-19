/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import fs from "fs-extra"
import oneZip from "onezip"
import klaw from "klaw"
// @ts-ignore
import getSize from "du"
// @ts-ignore
import through2 from "through2"

// Interfaces
import interfaceMKPaths from "@/scripts/interfaces/_interfaceMKPaths"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


/**
 * Manages deleting up of assets/themes/etc.
 * The class expects the existence of proper Mythkeeper folder structure for deleting
 */
export default class DeleteManagerMK {


  /* ---------------------------------------- */
  /* ------------SECTION: DELETE------------ */
  /* ---------------------------------------- */


  /**
   * Delete progress % that gets update from "deleteSingle".
   * @see deleteSingle
   */
  private deleteProgress : number = 0

  /**
   * Gets the value of "deleteProgress".
   * @see deleteProgress
   * @returns - Floored percentage
   */
  getDeleteProgress(){
    return this.deleteProgress
  }

  /**
   * Deletes an asset.
   * @param singleName - Name of the folder without any "\\"
   * @param MKPaths - List ok Mythkeeper paths
   * @param safeDeleteAllowed - A true/false setting of the app if safe delete mode is allowed or not
   */
  async deleteSingle(singleName: string, MKPaths: interfaceMKPaths, safeDeleteAllowed: boolean){
    const activePath: string = MKPaths.wdAssets+"\\"+singleName
    const activePathZip: string = MKPaths.wdAssets
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

        pack.on("progress", (percent) => {
          this.deleteProgress = Math.floor(percent / 100 * 90)
        })

        pack.on("end", () => {
          resolve()
        })

      })
    }

    // Delete files and wait before moving on
    await new Promise((resolve, reject) => {

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

        // When we done, finish up and clean up
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
}
