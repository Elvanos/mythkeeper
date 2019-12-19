// Imports
import MKAssetsSettingsInterface from "@/scripts/interfaces/_interfaceMKAsssetSettings"

/**
 * @param folderName - A name of the folder.
 * @param folderPath - A full folder path
 * @param hasBackup - Determines if the asset has backup or not.
 * @param status - Determines the status of the asset. Backup or Active.
 */
interface assetObjectInterface extends MKAssetsSettingsInterface{
  folderName: string,
  folderPath: string,
  hasBackup: boolean,
  status: "active" | "backup"
}

export default assetObjectInterface
