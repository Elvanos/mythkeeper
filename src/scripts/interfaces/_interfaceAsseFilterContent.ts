/**
 * A structure of the filter data object
 *
 * @param names - A list of names of the object. This can either be the actual folder name or the name specified in the config file.
 * @param commercialUses - A list of commercial uses. Allowed, Forbidden or Non specified.
 * @param status - A lost of statuses. Active, Backup, Has config or No config.
 * @param authors - A list of authors and distributor.
 * @param licenses - A list of licenses.
 * @param tags - A list of tags.
 * @param filtersActive - A boolean representing the checkbox in the top menu that determines if the filters are being respected or not.
 * @param allSearch - The current value in the quick/all search.
 * @param sortingDirection - The sorting direction of the list. Ascending or Descending.
 */
interface assetFilterContentInterface{
  names: string[]
  commercialUses: string[]
  status: string[]
  authors: string[]
  licenses: string[]
  tags: string[]
  filtersActive?: boolean
  allSearch?: any
  sortingDirection?: string
}

export default assetFilterContentInterface
