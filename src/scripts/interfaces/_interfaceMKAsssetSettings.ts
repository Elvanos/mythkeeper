/**
 * A ROUGH data structure of the JSON that MK uses for input
 *
 * @description Don't bother reading too much into this. Any of these things can be there or not, since this file is filled in by people who aren't very tech-savy most of the time. There is a HEAVY checking on the input to make sure nothing gets skipped or malformed.
 */
interface MKAssetsSettingsInterface {
  mkSettings?: {
    basicInformation?: any | {
      name?: any,
      version?: any,
      description?: any
      downloadURL?: any,
      tags?: any[],
      commercialUse?: any
      commercialURL?: any
      author?: any | {
        exists?: any,
        name?: any,
        mail?: any,
        url?: any
        donationURL?: any
      },
      distributor?: any | {
        exists?: any,
        name?: any,
        mail?: any,
        url?: any
        donationURL?: any
      },
      license?: {
        hasLicense?: any,
        type?: any,
        localFile?: any,
        externalLink?: any,
        commentary?: any
      },
    },
    vendors ?: {
      cartographyassetsID: number,
      cartographyassetsVersion: number
    }
  }
}

export default MKAssetsSettingsInterface
