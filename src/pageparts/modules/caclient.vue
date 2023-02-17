<template lang="pug">
.ModuleCaClient

  // Top bar
  ModuleTopBar(
    :profile-list='profileList'
    @trigger-ini-update='updateProfileIniWD')

    // Left slot of the bar
    template(v-slot:leftSide)

      // Button - Sync item list
      q-btn(
        icon="sync"
        outline
        :ripple="false"
        class="q-ml-sm"
        color="primary"

        :disable='storeGetTaskList.length !== 0'
        @click='reloadLocalItemData')

        q-tooltip(
          :delay="300"
          transition-show="jump-down"
          transition-hide="jump-up")

          b Sync the item list
          template(v-if='storeGetIsRichTooltipsAllowed')
            br
            | Use if any of the items don't update after installation

      // Button - Update all items
      q-btn(
        icon="mdi-chevron-double-up"
        :class="(updateAvailableList.length === 0) ? 'q-highlight-pass' : 'q-highlight-secondaryCta'"
        outline
        :ripple="false"
        class="q-ml-sm"
        color="primary"
        :disable='storeGetTaskList.length !== 0 || updateAvailableList.length === 0'
        @click="triggerChildUpdate"
        )

        q-badge(
          v-if="updateAvailableList.length !== 0"
          color="red-10"
          floating
        )
          | {{updateAvailableList.length}}

        q-tooltip(
          :delay="300"
          transition-show="jump-down"
          transition-hide="jump-up")

          template(
            v-if="updateAvailableList.length === 0"
          )
            b All items are up to date.
            br
            | Nothing to update.

          template(
            v-if="updateAvailableList.length !== 0"
          )
            b Update all items

            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              | Updates all available items on the list that have an update available.
              br
              br
              | Available updates:
              div(
                v-for="item in updateAvailableList"
                :key="item.title"
              )
                b {{item.title}}

    // Right slot of the bar
    template(v-slot:rightSide)

      // Switch - Show/Hide details of items in the list
      q-toggle.q-mr-md(
        :class="[{'-active': showExtendedInfoOnMiniatures},'-dense']"
        :ripple="false"
        checked-icon="mdi-eye-outline"
        unchecked-icon="mdi-eye-off-outline"
        v-model="showExtendedInfoOnMiniatures"
        label="Show details"
      )

      // Filters
      //CAclientFilter(
        :filterQuickSearchUpdate="filterQuickSearchUpdate"
        :filterContents="filterContents"
        @trigger-filter-input="applyFiltersToList"
      //)

  // Content
  .moduleWrapper

    .tempModule(v-if="!isFinishedLoading")
      .moduleTitle
        | CA Client

      .introText
        p Retrieving a list of items from the website!
        p Hang on tight!

      q-card.bg-grey-9.q-mt-lg.loader
        q-card-section
          | Items retrieved: {{retrievedListLength}} / {{allItemsLength}}
        q-card-section(v-if="isFinishedFetching")
          | Rendering the item list
          br
          | (this may lag for a second)
        q-card-section
          DragonSpinner

    // Fancy animation :o
    transition-group(
      name='list'
      tag='span')

      CAAssetMiniature.animateListItem(
        v-for='(asset, key) in filteredItemList'
        :key='asset.id'
        transition='item'

        :mk-paths="MKPaths"
        :asset-data="asset"
        :show-extra-info='showExtendedInfoOnMiniatures'
        :active-filter-content='activeFilterContent'

        :child-trigger-checker="childTriggerChecker"
        :child-trigger-update="childTriggerUpdate"

        @trigger-installer="triggerInstaller"
        @recheck-item="reloadLocalItemData"
        @trigger-quick-search-input='triggerQuickSearchInput'
      )

</template>

<script lang="ts">

// Libs
import fs from "fs-extra"
import WooCommerceAPI from "woocommerce-api"

// Module template
import ModuleTemplate from "@/scripts/classes/moduleTemplate"

// Decorators & Vue base + VUEX Decorators
import { Component, Watch } from "vue-property-decorator"

// Layout
import ModuleTopBar from "@/pageparts/layout/ModuleTopBar.vue"

// Components
import CAAssetMiniature from "@/pageparts/components/CAAssetMiniature.vue"
import CAclientFilter from "@/pageparts/components/CAclientFilter.vue"
import DragonSpinner from "@/pageparts/components/DragonSpinner.vue"

// Interfaces
import CAFilterContentInterface from "@/scripts/interfaces/_interfaceCAFilterContent"
import sortingAndFilterHelpers from "@/scripts/uncategorized/sortingAndFilterHelpers"


@Component({
  components: {
    // Layout
    ModuleTopBar,

    // Components
    CAAssetMiniature,
    CAclientFilter,
    DragonSpinner
  }
})
export default class CaClientModule extends ModuleTemplate {


  /* ------------------------------------------ */
  /* ------------SECTION: VUE NATIVE---------- */
  /* ------------------------------------------ */

  /** Vue native Created lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  created() {
    this.resetFilterData()
  }

  /** Vue native Mounted lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  mounted(){
    this.firstLoadSources()
  }


  /* --------------------------------------- */
  /* ------------SECTION: FILTERS---------- */
  /* --------------------------------------- */


  /**
   * Data for the filters
   */
  filterContents = {} as CAFilterContentInterface

  /**
   * Builds the innitial filter data based on the item list retrieved from Cartography Assets.
   */
  buildFilterData(){

    this.fetchedItemList.forEach((item: any)=>{

      let licenseField = (item.custom_fields && item.custom_fields.CCLicense)? item.custom_fields.CCLicense: undefined
      if (licenseField && licenseField !== "OTHER") {
        licenseField =  `CC-${ licenseField }-4.0`
      }

      let updateState:string = ""
      if (item.updateState === true) {
        updateState = "Up to date"
      }
      if (item.updateState === false) {
        updateState = "Update available"
      }
      if (item.updateState === null) {
        updateState = "Not installed"
      }

      let mkCompatibility = ""
      if (item.attributes.find(single =>{
        single.id === 9 && single.options && single.options[0] === "Yes"
      })) {
        mkCompatibility = "Compatible"
      }
      else{
        mkCompatibility = "Incompatible"
      }

      const filterUpdateValue: CAFilterContentInterface = {
        names: [item.name],
        categories: [...item.categories.map(cat => cat.name)],
        prefixes: [item.prefix],
        authors: [item.username],
        installationState: [updateState],
        compatibleMK: [mkCompatibility],
        commercialUses:[(item.custom_fields && item.custom_fields.license)? item.custom_fields.license: undefined],
        licenses:[licenseField],
        tags: [...item.tags.map(tag => tag.name)]
      }
      this.triggerUpdateFilter(filterUpdateValue)
    })
  }

  /**
   * Updates the filter values depending on
   * @param filterUpdateValue - Update value from the child
   * @see filterContents - The value that gets updated on this component
   */
  triggerUpdateFilter(filterUpdateValue: CAFilterContentInterface){

    // Merge unique "Names"
    if (filterUpdateValue.names[0] !== undefined) {
      this.filterContents.names = [...new Set([...filterUpdateValue.names ,...this.filterContents.names])]
    }

    // Merge unique "Categories"
    if (filterUpdateValue.categories[0] !== undefined) {
      this.filterContents.categories = [...new Set([...filterUpdateValue.categories, ...this.filterContents.categories])]
    }

    // Merge unique "MK Compatibility"
    if (filterUpdateValue.compatibleMK[0] !== undefined) {
      this.filterContents.compatibleMK = [...new Set([...filterUpdateValue.compatibleMK, ...this.filterContents.compatibleMK])]
    }

    // Merge unique "Installation states"
    if (filterUpdateValue.installationState[0] !== undefined) {
      this.filterContents.installationState = [...new Set([...filterUpdateValue.installationState, ...this.filterContents.installationState])]
    }

    // Merge unique "Prefixes"
    /*if (filterUpdateValue.prefixes[0] !== undefined) {
      this.filterContents.prefixes = [...new Set([...filterUpdateValue.prefixes, ...this.filterContents.prefixes])]
    }*/

    // Merge unique "Authors"
    /*  if (filterUpdateValue.authors[0] !== undefined) {
      this.filterContents.authors = [...new Set([...filterUpdateValue.authors, ...this.filterContents.authors])]
    } */

    // Merge unique "Commercial uses"
    /*   if (filterUpdateValue.commercialUses[0] !== undefined) {
      this.filterContents.commercialUses = [...new Set([...filterUpdateValue.commercialUses, ...this.filterContents.commercialUses])]
    }
 */
    // Merge unique "Licenses"
    /*  if (filterUpdateValue.licenses[0] !== undefined) {
      this.filterContents.licenses = [...new Set([...filterUpdateValue.licenses, ...this.filterContents.licenses])]
    }
 */
    // Merge unique "Tags"
    if (filterUpdateValue.tags[0] !== undefined) {
      this.filterContents.tags = [...new Set([...filterUpdateValue.tags, ...this.filterContents.tags])]
    }

  }
  /**
   * Data from the filters
   */
  activeFilterContent: CAFilterContentInterface = {
    allSearch: "",
    authors: [],
    licenses: [],
    commercialUses: [],
    tags: [],
    names: [],
    installationState: [],
    compatibleMK: ["Compatible"],
    categories: [],
    prefixes: []
  }

  /**
   * Data passed to filters as a prop, updated via any of the miniatures
   * @see triggerQuickSearchInput
   */
  filterQuickSearchUpdate: string = ""

  /**
   * Passes data as prop to the filter child for the quick filter
   * @see filterQuickSearchUpdate
   */
  triggerQuickSearchInput(searchValue: string){
    this.filterQuickSearchUpdate = searchValue
  }

  /**
   * Resets the filter contents to a blank state
   * @see filterContents
   */
  resetFilterData(){
    this.filterContents = {
      names: [],
      authors: [],
      commercialUses: [],
      licenses: [],
      tags: [],
      installationState: [],
      compatibleMK: ["Compatible"],
      categories: [],
      prefixes: []
    }
  }

  /**
   * Applies the filters to the asset list
   */
  applyFiltersToList(activeFilters: CAFilterContentInterface){
    this.activeFilterContent = activeFilters

    if (activeFilters.sorting !== undefined) {

      if(activeFilters.sorting === "Alphabetical - ascending (A >> Z)"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByAlphabetical(this.filteredItemList,false)
      }

      if(activeFilters.sorting === "Alphabetical - descending (Z >> A)"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByAlphabetical(this.filteredItemList,true)
      }

      if(activeFilters.sorting === "Rating - lowest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByRating(this.filteredItemList,false)
      }

      if(activeFilters.sorting === "Rating - highest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByRating(this.filteredItemList,true)
      }

      if(activeFilters.sorting === "Last update - newest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByLastUpdate(this.filteredItemList,true)
      }

      if(activeFilters.sorting === "Last update - oldest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByLastUpdate(this.filteredItemList,false)
      }

      if(activeFilters.sorting === "Uploaded - newest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByUploaded(this.filteredItemList,true)
      }

      if(activeFilters.sorting === "Uploaded - oldest"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByUploaded(this.filteredItemList,false)
      }

      if(activeFilters.sorting === "Downloads - ascending (0 >> X)"){
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByDownloads(this.filteredItemList,false)
      }

      if (activeFilters.sorting === "Downloads - descending (X >> 0)") {
        //@ts-ignore
        this.filteredItemList = sortingAndFilterHelpers.sortDownloadItemsByDownloads(this.filteredItemList,true)
      }

    }

  }


  /* -------------------------------------------------------- */
  /* ------------SECTION: CHILD RELATED FUNCTIONS---------- */
  /* -------------------------------------------------------- */


  /**
   * Set by switch in the top bar.
   * Determines if the extended info on the miniatures is shown or not.
   * Gets passes on as a prop
   */
  showExtendedInfoOnMiniatures: boolean = false

  /*---------- SUB SECTION: Child Re-check install status ----------*/

  /**
   * A slightly hacky-solution to trigger a method on a child.
   * Child only react to "true" state so this needs to get reset every time it gets triggered.
   */
  childTriggerChecker: boolean = false

  /**
   * Triggers checking of the installation values on the child
   * @see childTriggerBackup childTriggerBackup - Gets toggled on an off with 1 sec delay.
   */
  triggerChildCheck(){
    this.childTriggerChecker = true

    setTimeout(()=>{
      this.childTriggerChecker = false
    },1000)
  }


  /*---------- SUB SECTION: Child Mass Update ----------*/

  /**
   * A slightly hacky-solution to trigger a method on a child.
   * Child only react to "true" state so this needs to get reset every time it gets triggered.
   */
  childTriggerUpdate: boolean = false

  /**
   * Triggers update function on the child
   * @see childTriggerUpdate - Gets toggled on an off with 1 sec delay.
   */
  triggerChildUpdate(){

    this.childTriggerUpdate = true

    setTimeout(()=>{
      this.childTriggerUpdate = false
    },1000)
  }


  /* ------------------------------------------------------- */
  /* ------------SECTION: SOURCE REFRESH/LOADING---------- */
  /* ------------------------------------------------------- */


  /**
   * Load all needed sources to begin working with the list for the first time
   * Retrieves both the config files from the directories and the item list from the CA website.
   */
  async firstLoadSources(){

    Promise.all([this.readConfigFiles(), this.retrievePagesFromCA()]).then((values) => {

      let fileConfigs, assetList
      [fileConfigs, assetList] = values

      //console.log(assetList)

      this.getListAndSetFilterBase(assetList)

      this.determineItemInstallationState()

      this.applyFiltersToList(this.activeFilterContent)

      this.buildFilterData()

      this.isFinishedLoading = true
    })
  }

  isFinishedLoading = false


  /*---------- SUB SECTION: Directory scan */

  /**
   * A list ofg config files along with folder info
   */
  fileConfigList = []

  /**
   * Reads all needed config files from all needed directories so we can compare later.
   * @returns - A list of all processed directories along with config files if they exist
   */
  async readConfigFiles(){
    this.fileConfigList =  await new Promise((resolve,reject)=>{
      const allDirectoryPaths = this.scanDirectories()
      //@ts-ignore
      resolve(allDirectoryPaths)
    })
  }

  /**
   * Resets all lists, rescans the directory and builds new ones.
   * @returns - A list of all currently installed assets, themes and brushes set as "active".
   */
  scanDirectories(){

    // Check for normal assets
    const assets = fs.readdirSync(this.MKPaths.wdAssets)
    const brushes = fs.readdirSync(this.MKPaths.wdBrushes)
    const themes = fs.readdirSync(this.MKPaths.wdThemes)

    return  [
      ...this.addFoldersToList(this.MKPaths.wdAssets,assets),
      ...this.addFoldersToList(this.MKPaths.wdBrushes,brushes),
      ...this.addFoldersToList(this.MKPaths.wdThemes,themes)
    ]

  }

  /**
   * Loads data from normal assets into the normal list and combined list
   * @param corePath - The base path for whatever directory we are processing.
   * @param individualFolders - A list of individual folders recovered from the core path.
   * @returns - A list of processed folders.
   */
  addFoldersToList(corePath: string, individualFolders: string[]){

    const fileList:any = []

    // Add all directories to the list
    individualFolders.forEach(
      (singleFolder:string) => {
        const newAsset:any = {
          folderName: singleFolder,
          folderPath: `${corePath}\\${singleFolder}`,
          mkSettings: undefined
        }

        if(fs.existsSync(`${corePath}\\${singleFolder}\\mythKeeperSettings.json`))
        {
          try {
            //@ts-ignore
            newAsset.mkSettings = JSON.parse(fs.readFileSync(`${corePath}\\${singleFolder}\\mythKeeperSettings.json`))
          }
          catch(err) {
            //@ts-ignore
            this.$awn.alert(`
              <b>${corePath}\\${singleFolder}</b> has a malformed Mythkepeer config file.
              <br>
              Check the developer Developer Tools for more details (button on bottom left)`,{durations: {alert: 0}})
            console.error(err)
          }
        }


        fileList.push(newAsset)

      }
    )
    return fileList
  }


  /*---------- SUB SECTION: Website API requests */

  /**
   * A raw list of fetched items from CA after the bare-bones filter of the completely incompatible ones.
   */
  fetchedItemList: any[] = []

  /**
   * A fully filtered and prepared list of assets that went through proper filtering
   * This one gets used for the actual render.
   */
  filteredItemList = []

  /**
   *
   */
  retrievedListLength: number = 0

  allItemsLength: number|string = "N/A"


  isFinishedFetching = false

  /**
   * Retrieves all available assets from Cartography Assets website.
   * @returns A list of assets.
   */
  async retrievePagesFromCA() {

    return await new Promise((resolve,reject) =>{
      let pageNum = 1
      let assetList = []
      let maxPage = 0

      let firstRun = false

      const WooCommerce = new WooCommerceAPI({
        url: "https://cartographyassets.com/",
        consumerKey: "ck_7686419cec8ee02a3bcc8f7c0c6d92b457907808",
        consumerSecret: "cs_44464aa86706aa1e87dcb3c80cc6e2fb82604dce",
        wpAPI: true,
        version: "wc/v1"
      })


      WooCommerce.get("products/categories?per_page=100", (err,body,result) => {
        console.log(JSON.parse(result))
      })


      const cyclePages = () => {

        WooCommerce.get(`products?page=${pageNum}&per_page=100&category=216`, (err,body,result) => {

          if(err){
            console.log(err)
            reject()
            //@ts-ignore
            this.$awn.alert("Attempt to connect to Cartographyassets.com has failed.")
            return
          }

          if(!firstRun){
            firstRun = true
            maxPage = body.headers["x-wp-totalpages"]
            this.allItemsLength = body.headers["x-wp-total"]
          }

          pageNum++

          assetList = assetList.concat(JSON.parse(result))

          if (pageNum - 1 < maxPage) {
            this.retrievedListLength = assetList.length
            cyclePages()
            return
          } else {
            this.retrievedListLength = assetList.length
            this.isFinishedFetching = true

            setTimeout(()=>{
              resolve(assetList)
              return
            },1000)
          }
        })

        /*  .catch((err) => {


          })*/
      }
      cyclePages()
    })

  }

  /**
   * Builds a base list to work with by filtering out the flat-out, non-compatible parts.
   * @param itemList - A list of all items recovered from CA.com
   */
  getListAndSetFilterBase(itemList){

    // TODO add filters if needed

    //itemList = itemList.filter(single => single.name.includes("Avoro"))

    //itemList = itemList.filter(single => single.downloads.length > 1)

    this.fetchedItemList = itemList

    this.fetchedItemList.forEach(e => {
      if(e.id === 5293){
        console.log(e)
      }
    })

  }


  /*---------- SUB SECTION: Determine item installation state ----------*/

  /**
   * List of items that have an update available
   */
  updateAvailableList: number[] = []

  /**
   * Determines if the item is already installed and what version does it have
   */
  determineItemInstallationState(){
    const determinedList = this.fetchedItemList.map((item:any) => {

      const resourceID = item.id
      const resourceVersion = Date.parse(item.date_modified)

      // Reset at the start
      item.updateState = null

      // Check if any of the folders even has a config file
      this.fileConfigList.find((singleConfig: any) => {
        if (singleConfig.mkSettings
              && singleConfig.mkSettings.vendors
              && singleConfig.mkSettings.vendors.cartographyassetsID
              && singleConfig.mkSettings.vendors.cartographyassetsVersion
        ) {


          // Check if we get a match
          if (singleConfig.mkSettings.vendors.cartographyassetsID === resourceID) {

            // Check if the item is up to date
            if (singleConfig.mkSettings.vendors.cartographyassetsVersion >= resourceVersion) {
              item.updateState = true
              return
            }

            // Check if the item is an older version
            if (singleConfig.mkSettings.vendors.cartographyassetsVersion < resourceVersion) {
              item.updateState = false
              return
            }
          }
        }
      })

      return item
    })

    //@ts-ignore
    this.filteredItemList = determinedList

    // Set available update list
    this.updateAvailableList = determinedList.filter((singleItem)=>{
      return singleItem.updateState === false
    })
  }


  /*---------- SUB SECTION: Re-checks the local file config list on demand ----------*/

  /**
   * Listens to profile changes from any part of the app
   * When detecting a change, rescans the list
   */
  @Watch("storeGetActiveProfile")
  listenerActiveProfile(){
    this.reloadLocalItemData()
  }

  /**
   * Rechecks the single item upon trigger from the child
   */
  async reloadLocalItemData(){

    // Assign proper values
    await this.readConfigFiles()
    this.determineItemInstallationState()
    this.buildFilterData()
    this.applyFiltersToList(this.activeFilterContent)

    // Trigger manual recheck of values on the child
    this.triggerChildCheck()

  }


}
</script>

<style scoped lang="sass">
  @import '../../assets/sass/globals'

  .list-item
    display: inline-block
    margin-right: 10px

  .list-enter-active, .list-leave-active
    transition: all 1s

  .list-enter, .list-leave-to
    opacity: 0
    transform: translateY(30px)

  .list-leave-active
    position: absolute

  .moduleWrapper
    padding: 10px 0
    overflow-y: auto
    overflow-x: hidden
    +M_scrollbars(5px, $themeCol-titles,rgba($themeCol-text, 0.5))

    >span
      display: flex
      flex-wrap: wrap

  .showMoreSwitch
    transform: scale(0.9)
    margin: -10px !important
    padding: 9px 15px !important
    width: 225px !important
    white-space: nowrap

  .tempModule
    width: 1300px
    margin: auto
    height: 100%
    padding: 60px 120px

    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    +Q_customMax(1366px)
      padding: 30px 0

    .DragonSpinner
      position: relative

    .loader
      width: 400px
      text-align: center
      color: #fff
      font-size: 18px
      position: relative
      border-radius: 4px
      box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
      +MK_elementBackground('../../assets/images/MKbackgroundElements.png')
      &:before
        border-radius: 4px

    .moduleContent
      display: flex
      justify-content: space-between
      width: 100%

    .introText
      text-align: center
      color: $themeCol-text
      text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.35)
      width: 1000px
      margin-top: 25px

      p
        font-family: Friz Quadrata, sans-serif
        font-size: 18px
        line-height: 1.4

        +Q_customMax(1366px)
          font-size: 16px
          line-height: 1.2

</style>
