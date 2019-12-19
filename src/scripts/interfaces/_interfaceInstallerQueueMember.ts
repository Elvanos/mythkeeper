import interfaceUnpackInstaller from "@/scripts/interfaces/_interfaceUnpackInstaller"

interface interfaceInstallerQueueMember{
  timestamp: number
  masterPath: string
  name: string | false,
  sourceComponentData: interfaceUnpackInstaller
  extractionQueue: {
    folderPath: string
    folderToCopyPath: string,
    name: string,
    type: string,
    alreadyExists: boolean
    willInstall: boolean
    installedVersion: string
    newVersion: string
  }[]
}

export default interfaceInstallerQueueMember
