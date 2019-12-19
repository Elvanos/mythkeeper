interface interfaceUnpackInstaller{
  askForOverwrite: boolean | null
  tempJSON: {
    vendors:{
      cartographyassetsID: number
      cartographyassetsVersion: number
    }
  }
  unpackPath: string
  tempFolderPath: string
  componentLock: number
}

export default interfaceUnpackInstaller
