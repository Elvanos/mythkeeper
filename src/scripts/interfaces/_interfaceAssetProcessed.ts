/**
 * Data structure for the author inside the overlayActionsInterface
 *
 * @param exists - Determines if the author exists or not.
 * @param name - Name of the author.
 * @param mail - Can be "false" if not included. Email address of the author.
 * @param url - Can be "false" if not included. URL website address of the author.
 * @param donationURL - Can be "false" if not included. URL donation address of the author.
 *
 * @see interfaceAssetProcessed
 */
interface interfaceAuthor{
  exists: boolean
  name: string
  mail: boolean | string
  url: boolean | string
  donationURL: boolean | string
}

/**
 * Data structure for the author inside the overlayActionsInterface
 *
 * @param exists - Determines if the distributor exists or not.
 * @param name - Name of the distributor.
 * @param mail - Can be "false" if not included. Email address of the distributor.
 * @param url - Can be "false" if not included. URL website address of the distributor.
 * @param donationURL - Can be "false" if not included. URL donation address of the distributor.
 *
 * @see interfaceAssetProcessed
 */
interface interfaceDistributor{
  exists: boolean
  name: string
  mail: boolean | string
  url: boolean | string
  donationURL: boolean | string
}

/**
 * Data structure for the author inside the overlayActionsInterface
 *
 * @param hasLicense - Determines if the license exists or not.
 * @param type - Name and type of the license.
 * @param localFile - Can be "false" if not included. Path to the local license file.
 * @param externalLink - Can be "false" if not included. URL website address to the license.
 * @param commentary - Can be "false" if not included. Path to the local commentary file.
 * @see interfaceAssetProcessed
 *
 */
interface interfaceLicense {
  hasLicense: boolean
  type: string
  localFile: boolean | string
  externalLink: boolean | string
  commentary: boolean | string
}

/**
 * Data structure for processed and properly formatted data from mkConfig.json
 *
 * @param title - Name of the asset.
 * @param imagePreview - Absolute path to the preview image.
 * @param gallery - Either set as "false" if the gallery is not allowed OR a list of absolute paths to gallery images.
 * @param version - Either "false" if not added or a string for the version.
 * @param description - Either "false" if not added or a string for description.
 * @param downloadURL - Either "false" if not added or a string for the URL.
 * @param tags - Either "false" if not added or a list of string for tags.
 * @param license - Either "false" if not added or "interfaceLicense" for details.
 * @param author - Either "false" if not added or "author" for details.
 * @param distributor - Either "false" if not added or "distributor" for details.
 * @param vendors - Can be undefined if not added or false if someone filled it in or a list of data vendors... this can be pretty much anything, so careful!
 *
 * @see interfaceAuthor
 * @see interfaceLicense
 * @see interfaceDistributor
 */
interface interfaceAssetProcessed{
  title: string
  imagePreview: string
  gallery: boolean | string[]
  version: boolean | string
  description: boolean | string
  downloadURL: boolean | string
  tags: boolean | string[]
  license: boolean | interfaceLicense
  author: boolean | interfaceAuthor
  distributor: boolean | interfaceDistributor
  vendors?: boolean | {
    [key: string]: any
  }
}

export default interfaceAssetProcessed
