/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */

// Libs
import downloader from "@elvanos/download"
import fs from "fs-extra"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


/**
 * Manages downloading of assets/themes/etc.
 * The class expects the existence of proper Mythkeeper folder structure for the installation!
 */
export default class downloadManagerMK {


  /* ----------------------------------------------- */
  /* ------------SECTION: DOWNLOAD FILE------------ */
  /* ----------------------------------------------- */


  /**
   * Unpacking progress % that gets update from "unpackFile"
   * @see unpackFile
   */
  private downloadProgress : number|string = 0

  /**
   * Gets the value of "unpackProgress"
   * @see unpackProgress
   * @returns - Floored percentage
   */
  getDownloadProgress(){
    return this.downloadProgress
  }

  /**
   * Unpacks a zip file (or a single .wonderdraft_theme in edge cases)
   * @param downloadData - Data batch for the installer
   * @see unpackProgress
   */
  public async downloadFile(downloadData){

    return await new Promise(async (resolve) => {

      const runDownload = () => {
        // Set input URL
        let itemLink = `https://cartographyassets.com/mythkeeper-download/?product_id=${downloadData.itemRecourseId}&file_path=${encodeURIComponent(downloadData.inputUrl)}`

        console.log(itemLink)

        if (!fs.existsSync(downloadData.tempFolder)) {
          fs.mkdirSync(downloadData.tempFolder)
        }

        downloader(itemLink, downloadData.tempFolder)
          .on("response", res => {

            // Get normal CA file size
            let maxSize = res.headers["content-length"]
            let currentDownloadSize:number = 0

            // Update on received data
            res.on("data", (data) => {

              currentDownloadSize += data.length

              // If normal size
              if (maxSize) {
                this.downloadProgress = (Math.floor(currentDownloadSize / maxSize * 100) > 100)? 100: Math.floor(currentDownloadSize / maxSize * 100)

              }

              // If lacking max size
              else{
                this.downloadProgress = (currentDownloadSize / 1024 / 1024).toFixed(1) + " MB"
              }
            })
          })
          .then(({data, filename}) => {

            resolve()

          }).catch(e => console.log(e))

      }
      runDownload()

    })

  }



}
