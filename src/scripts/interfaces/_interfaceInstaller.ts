import typeInstallerPackageVariations from "@/scripts/interfaces/_typeInstallerPackageVariations"

/**
 * Data structure for installer object
 *
 */
interface interfaceInstaller {
  installerFilePath: string,
  installerName: string | false,
  installerType: typeInstallerPackageVariations,
  hasOverWrapper: boolean,
  lacksWrapper: boolean,
}

export default interfaceInstaller
