/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import assetObjectInterface from "@/scripts/interfaces/_interfaceAssetObject"


/* ------------------------------ */
/* ------------CLASS------------ */
/* ------------------------------ */


export default class sortingAndFilterHelpers {


  /* --------------------------------------------- */
  /* ------------SECTION: SORT ASSETS------------ */
  /* --------------------------------------------- */


  /**
   * Sorts a list of assets alphabetically.
   * Can sort from A to Z or from Z to A.
   * @param assetList - The list of assets.
   * @param reverse - Determines the sorting order.
   * @returns A sorted asset list.
   */
  static sortAssetsAlphabetically(assetList: assetObjectInterface[], reverse : boolean = false){
    assetList.sort((a: assetObjectInterface, b: assetObjectInterface) => {
      const textA = a.folderName.toUpperCase()
      const textB = b.folderName.toUpperCase()
      if (!reverse){
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      }
      else{
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0
      }
    })
    return assetList
  }

  /**
   * Sorts a list of assets based on their status.
   * @param assetList - The list of assets.
   * @param reverse - Determines the sorting order.
   * @returns A sorted asset list.
   */
  static sortAssetsByStatus(assetList: assetObjectInterface[], reverse : boolean = false){
    assetList.sort((a: assetObjectInterface, b: assetObjectInterface) => {
      const statusA = (a.status === "active") ? 0 : (a.status === "backup") ? 1 : 10
      const statusB = (b.status === "active") ? 0 : (b.status === "backup") ? 1 : 10
      if (!reverse){
        return (statusA < statusB) ? -1 : (statusA > statusB) ? 1 : 0
      }
      else{
        return (statusA > statusB) ? -1 : (statusA < statusB) ? 1 : 0
      }
    })
    return assetList
  }


  /* ------------------------------------------------------ */
  /* ------------SECTION: SORT DOWNLOAD ITEMS------------ */
  /* ------------------------------------------------------ */

  static sortDownloadItemsByAlphabetical(list: any[], reverse: boolean = false): any[]{
    list.sort((a: any, b: any) => {
      const textA = a.title.toUpperCase()
      const textB = b.title.toUpperCase()
      if (!reverse){
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      }
      else{
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0
      }
    })
    return list
  }

  static sortDownloadItemsByRating(list: any[], reverse: boolean = false): any[]{
    list.sort((a: any, b: any) => {
      const valueA = a.rating_avg
      const valueB = b.rating_avg
      if (!reverse){
        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0
      }
      else{
        return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0
      }
    })
    return list
  }

  static sortDownloadItemsByLastUpdate(list: any[], reverse: boolean = false){
    list.sort((a: any, b: any) => {
      const valueA = a.last_update
      const valueB = b.last_update
      if (!reverse){
        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0
      }
      else{
        return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0
      }
    })
    return list

  }

  static sortDownloadItemsByUploaded(list: any[], reverse: boolean = false){
    list.sort((a: any, b: any) => {
      const valueA = a.resource_date
      const valueB = b.resource_date
      if (!reverse){
        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0
      }
      else{
        return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0
      }
    })
    return list

  }

  static sortDownloadItemsByDownloads(list: any[], reverse: boolean = false){
    list.sort((a: any, b: any) => {
      const valueA = a.download_count
      const valueB = b.download_count
      if (!reverse){
        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0
      }
      else{
        return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0
      }
    })
    return list

  }

}




