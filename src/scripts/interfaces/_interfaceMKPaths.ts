/**
 * An array with all important Wonderdraft and Mythkeeper file paths
 *
 * @param - wdAssets - Base Wonderdraft path to the assets folder
 * @param - wdThemes - Base Wonderdraft path to the themes folder
 * @param - mkBase - Base Mythkeeper folder
 * @param - mkProfiles - Mythkeeper profiles folder
 * @param - mkBackup - Mythkeeper backup folder
 * @param - mkBackupAssets - Mythkeeper backup assets sub-folder
 * @param - mkBackupThemes - Mythkeeper backup themes sub-folder
 * @param - mkDeleted - Mythkeeper deleted folder
 * @param - mkDeletedAssets - Mythkeeper deleted assets sub-folder
 * @param - mkDeletedThemes - Mythkeeper deleted themes sub-folder
 * @param - mkTemp - Mythkeeper temporary folder (used to download/unpack stuff in)
 */
interface MKPathsInterface {
  wdBase: string
  wdAssets: string
  wdThemes: string
  wdBrushes: string
  mkBase: string
  mkProfiles: string
  mkBackup: string
  mkBackupAssets: string
  mkBackupThemes: string
  mkBackupBrushes: string
  mkDeleted: string
  mkDeletedAssets: string
  mkDeletedThemes: string
  mkDeletedBrushes: string
  mkTemp: string
}

export default MKPathsInterface
