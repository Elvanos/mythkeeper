/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */

// Libs
import downloader from "@jinphen/download2"
import fs from "fs-extra"
import cheerio from "cheerio"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


/**
 * Manages downloading of assets/themes/etc.
 * The class expects the existence of proper Mythkeeper folder structure for the installation!
 */
export default class downloadManagerMK {


  /* -------------------------------------------- */
  /* ------------SECTION: PARSE HTML------------ */
  /* -------------------------------------------- */

  /**
   * Parses HTML data into download row data
   * @param data - HTML input
   * @param downloadData - Data object from the CA miniature
   */
  readCAHtml (data,downloadData){
    // Parse the HTML to get the data we need
    const $ = cheerio.load(data)
    const fileRows = $(".p-body-main .contentRow-main")
    const filesArray: [] = []

    // Run through all of the HTML bits
    fileRows.each((i,element) => {
      element = $(element)

      // Build a data object out of the scraped HTML
      const downloadableObject = {
        assetID: downloadData.itemRecourseId,
        fileName: element.find("h3").text(),
        downloadPath: "https://www.cartographyassets.com" + element.find("a").attr("href")
      }

      // Filter out junk and leave only the useful parts
      if (downloadableObject.fileName.includes(".zip") || downloadableObject.fileName.includes(".wonderdraft_theme")) {
        //@ts-ignore
        filesArray.push(downloadableObject)
      }
    })
    return filesArray
  }


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
        let itemLink = (!downloadData.inputUrl) ? "https://www.cartographyassets.com/assets/" + downloadData.itemRecourseId + "/download": downloadData.inputUrl

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

            // If multi-file
            if (filename === "download.null") {

              const filesArray = this.readCAHtml(data,downloadData)

              // Open overlay in case we have multiple items in the list
              if (filesArray.length > 1) {
                resolve()
              }

              // Rerun the download if we have only a single item left in the list
              else {
                //@ts-ignore
                downloadData.inputUrl = filesArray[0].downloadPath
                runDownload()
              }
            }

            // if Single file
            else {
              if (fs.existsSync(downloadData.tempFolder+"/download.null")) {
                fs.removeSync(downloadData.tempFolder+"/download.null")
              }
              resolve()
            }

          })
      }
      runDownload()

    })

  }



}
