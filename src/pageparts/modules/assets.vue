<template lang="pug">
  .ModuleAssets

    // Top bar
    ModuleTopBar(
      :profile-list='profileList'
      @trigger-ini-update='updateProfileIniWD')

      // Left slot of the bar
      template(v-slot:leftSide)

        // Button - Refresh asset list
        q-btn(
          icon="mdi-refresh"
          outline
          :ripple="false"
          class="q-ml-sm"
          color="primary"

          :disable='storeGetTaskList.length !== 0'
          @click='forceRefresh')

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Hard-refresh the asset list
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | Use if any of the assets don't update
              br
              | or something else isn't working properly

        // Button - Asset builder
        q-btn(
          icon="mdi-folder-zip-outline"
          outline
          :ripple="false"
          class="q-ml-sm"
          color="primary"
          disable
         )

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Asset builder
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | This isn't done yet, but we are working on it!

          q-tooltip(
            v-if="false"
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Asset builder
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | A user-friendly maker for all asset makers!
              br
              | Or just for people downloaded some assets
              br
              | somewhere and want build a proper package out of them.

        // Button - Backup all assets
        q-btn(
          icon="mdi-archive"
          outline
          :ripple="false"
          class="q-ml-sm"
          color="primary"

          :disable='storeGetTaskList.length !== 0'
          @click='backupAllAssetsListener')

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Backup all assets
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              b Overwrites all older versions of all backed up assets!
              br
              br
              | Auto-backup your whole asset library with one click!
              br
              | Mostly meant for use right after launching Mythkeeper for the first time.

        // Button - Restore deleted asset
        q-btn(

          @click="openDialogInstallerFile('restoreAsset')"
          icon="mdi-delete-restore"
          outline
          :ripple="false"
          class="q-ml-sm"
          color="primary")

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Restore a previously deleted asset
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | This does exactly the same thing as the button next to it that install a new asset.
              br
              | Except it automatically open the Mythkeeper deleted directory; for convenience purposes!


        // Button - Add new asset
        q-btn(
          icon="mdi-bank-plus"
          outline
          :ripple="false"
          class="q-ml-sm"
          @click="openDialogInstallerFile"
          color="primary")

          q-tooltip(
            :delay="300"
            transition-show="jump-down"
            transition-hide="jump-up")

            b Install from local file
            template(v-if='storeGetIsRichTooltipsAllowed')
              br
              br
              | This will open a dialog to allow installation from a local file.
              br
              | And since we reworked the installation system:
              br
              |<b> You can now install assets, themes, brushes and even whole combined packs using this super-button!</b>

      // Right slot of the bar
      template(v-slot:rightSide)

        // Switch - Show/Hide details of assets in the list
        q-toggle.q-mr-md(
          :class="[{'-active': showExtendedInfoOnMiniatures},'-dense']"
          :ripple="false"
          checked-icon="mdi-eye-outline"
          unchecked-icon="mdi-eye-off-outline"
          v-model="showExtendedInfoOnMiniatures"
          label="Show details"
        )

        // Filters
        AssetsFilter(
        :filterQuickSearchUpdate="filterQuickSearchUpdate"
        :filterContents="filterContents"
        @trigger-filter-input="applyFiltersToList"
        )

    // Content
    .moduleWrapper

      // Fancy animation :o
      transition-group(
        name='list'
        tag='span')

        // Individual miniatures
        AssetMiniature.animateListItem(
          v-for='(asset) in assetListFiltered'
          :key='asset.folderName'

          transition='item'

          :asset-data='asset'
          :show-extra-info='showExtendedInfoOnMiniatures'
          :mk-paths='MKPaths'
          :active-filter-content='activeFilterContent'

          :trigger-backup='childTriggerBackup'

          @trigger-update-asset-data='triggerChangeMiniatureData'
          @trigger-remove-from-list='triggerRemoveFromList'
          @trigger-gallery='triggerGallery'
          @trigger-quick-search-input='triggerQuickSearchInput'
          @trigger-update-filter='triggerUpdateFilter')

</template>

<script lang="ts">

/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */

// Libs
import {extend as qExtend} from "quasar"
import fs from "fs-extra"

// Interfaces
import interfaceAssetObject from "@/scripts/interfaces/_interfaceAssetObject"
import assetFilterContentInterface from "@/scripts/interfaces/_interfaceAsseFilterContent"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"


// Helpers
import sortingAndFilterHelpers from "@/scripts/uncategorized/sortingAndFilterHelpers"

// Module template
import ModuleTemplate from "@/scripts/classes/moduleTemplate"

// Decorators & Vue base + VUEX Decorators
import { Component, Watch } from "vue-property-decorator"

// Layout
import ModuleTopBar from "@/pageparts/layout/ModuleTopBar.vue"

// Components
import AssetMiniature from "@/pageparts/components/AssetMiniature.vue"
import AssetsFilter from "@/pageparts/components/AssetsFilter.vue"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component({
  components: {
    // Layout
    ModuleTopBar,

    // Components
    AssetMiniature,
    AssetsFilter

  }
})
export default class AssetsModule extends ModuleTemplate {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */


  /**
   * Set by switch in the top bar.
   * Determines if the extended info on the miniatures is shown or not.
   * Gets passes on as a prop
   */
  showExtendedInfoOnMiniatures: boolean = false

  /**
   * A slightly hacky-solution to trigger a method on a child.
   * Child only react to "true" state so this needs to get reset every time it gets triggered.
   */
  childTriggerBackup: boolean = false

  /**
   * Data passed to filters as a prop, updated via any of the miniatures
   * @see triggerQuickSearchInput
   */
  filterQuickSearchUpdate: string = ""

  /**
   * A list of found asset after the scan found in the normal "assets" directory
   */
  assetList: interfaceAssetObject[] = []

  /**
   * A list of found asset after the scan found in the backup "assets" directory
   */
  assetListBackups: interfaceAssetObject[] = []

  /**
   * A mixture of normal list and backup list
   * Normal assets get added first, backup gets compared to the normal list. If it missing, it gets added to this list
   * @see assetList
   * @see assetListBackups
   */
  assetListCombined: interfaceAssetObject[] = []

  /**
   * Filtered asset list based on filter parameters
   * @see assetListCombined
   * @see filterAssetList
   */
  assetListFiltered: interfaceAssetObject[] = []

  /**
   * Data for the filters
   */
  filterContents = {} as assetFilterContentInterface

  /**
   * Data from the filters
   */
  activeFilterContent: assetFilterContentInterface = {
    allSearch: "",
    authors: [],
    licenses: [],
    commercialUses: [],
    tags: [],
    names: [],
    status: [],
  }

  /* ------------------------------- */
  /* ------------WATCH-------------- */
  /* ------------------------------- */


  /**
   * Listens to profile changes from any part of the app
   * When detecting a change, rescans the list
   */
  @Watch("storeGetActiveProfile")
  listenerActiveProfile(){
    this.scanAssetDirectory()
  }


  /* ----------------------------------- */
  /* ------------VUE NATIVE------------ */
  /* ----------------------------------- */

  /**
   * Vue native Created lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  created() {

    // Set filter to a blank slate at start
    this.resetFilterData()

    // Rescan the directory
    this.scanAssetDirectory()
  }


  /* ------------------------------------------------ */
  /* ------------METHODS: DIRECTORY SCAN------------ */
  /* ------------------------------------------------ */


  /**
   * Filters asset list based on filter settings in the top bar
   * @see assetListCombined assetListCombined - Source data.
   */
  filterAssetList(sortingDirection: boolean = false){
    let filteredAssetList: interfaceAssetObject[] = this.assetListCombined

    filteredAssetList = sortingAndFilterHelpers.sortAssetsAlphabetically(filteredAssetList, sortingDirection)
    filteredAssetList = sortingAndFilterHelpers.sortAssetsByStatus(filteredAssetList, false)

    this.assetListFiltered = filteredAssetList
  }

  /**
   * Resets all lists, rescans the directory and builds new ones.
   */
  scanAssetDirectory(){

    // Reset asset list
    this.assetList = []
    this.assetListBackups = []
    this.assetListCombined = []

    // Check for normal assets
    let assetFolders = fs.readdirSync(this.MKPaths.wdAssets)
    this.addAssetsToList(this.MKPaths.wdAssets,assetFolders)

    // Check for backups
    assetFolders = fs.readdirSync(this.MKPaths.mkBackupAssets)
    this.addAssetsBackupsToList(this.MKPaths.mkBackupAssets, assetFolders)

    this.filterAssetList()

  }

  /**
   * Loads data from normal assets into the normal list and combined list
   */
  addAssetsToList(corePath: string, assetFolders: string[]){

    // Add all directories to the list
    assetFolders.forEach(
      (singleFolder:string) => {
        const newAsset: interfaceAssetObject = {
          folderName: singleFolder,
          folderPath: `${corePath}\\${singleFolder}`,
          hasBackup: false,
          status: "active",
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

        this.assetList.push(newAsset)
        this.assetListCombined.push(newAsset)
      }
    )
  }

  /**
   * Loads data from backup assets into the backup list and combined list
   */
  addAssetsBackupsToList(corePath: string, assetFolders: string[]){

    // Add all directories to the list
    assetFolders.forEach(
      (singleFolder:string) => {
        const newAsset: interfaceAssetObject = {
          folderName: singleFolder,
          folderPath: `${corePath}\\${singleFolder}`,
          hasBackup: false,
          status: "backup",
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

        this.assetListBackups.push(newAsset)

        // Filter out asset both in normal and backup lists
        const duplicate = this.assetList.find((singleAsset) => {
          return (singleAsset.folderName === newAsset.folderName)
        })
        if (duplicate === undefined)
        {this.assetListCombined.push(newAsset)}

      }
    )
  }


  /* -------------------------------------------------- */
  /* ------------METHODS: TOP BAR ACTIONS------------ */
  /* -------------------------------------------------- */

  /**
   * Triggers a dialog to pick if we will backup everything or not
   * Gets skipped if Expert mode is on
   * @see backupAllAssets backupAllAssets - This function gets triggered if the dialog gets approved
   */
  backupAllAssetsListener(){
    if (this.storeGetIsExpertModeAllowed)
    {this.backupAllAssets()}
    else{
      const contents: overlayActionsInterface = {
        componentID: this.getComponentID(),
        title: "Backup all assets",
        contents:
            `Using a mass-backup will backup all your assets.
          <br>
          If you already have some assets backed up, this will overwrite the older versions of the backups:
          <br>
          <b>There will be NO WAY to recover the previous versions of backups later.</b>
          <br>
          <br>
          <b>Proceed?</b>`,
        actions: [
          {
            title: "close",
            classes: "md-primary",
            action: "closeModal"
          },
          {
            title: "Backup everything",
            classes: "md-primary md-raised",
            action: "storeSetOverLayTriggerAction",
            param: {
              functionName: "backupAllAssets",
              data: {}
            }
          }
        ]
      }
      this.triggerChoiceDialog(contents)
    }

  }

  /**
   * Triggers backing up on all children
   * @see childTriggerBackup childTriggerBackup - Gets toggled on an off with 1 sec delay.
   */
  backupAllAssets(){
    this.childTriggerBackup = true

    setTimeout(()=>{
      this.childTriggerBackup = false
    },1000)
  }

  /**
   * Manually refreshes the list of assets.
   */
  forceRefresh(suppressAWN: boolean = false){
    this.refreshModuleSources()
    this.scanAssetDirectory()

    if(!suppressAWN){
      //@ts-ignore
      this.$awn.success("Asset list has been refreshed",{durations:{success: 5000}})
    }

  }


  /* ---------------------------------------------- */
  /* ------------METHODS: FILTER LOGIC------------ */
  /* ---------------------------------------------- */


  /**
   * Resets the filter contents to a blank state
   * @see filterContents
   */
  resetFilterData(){
    this.filterContents = {
      names: [],
      authors: [],
      commercialUses: [],
      status: [],
      licenses: [],
      tags: []
    }
  }

  /**
   * Applies the filters to the asset list
   */
  applyFiltersToList(activeFilters: assetFilterContentInterface){
    this.activeFilterContent = activeFilters

    if (activeFilters.sortingDirection !== undefined) {

      (activeFilters.sortingDirection === "Ascending (A >> Z)")
        ? this.filterAssetList(false)
        : this.filterAssetList(true)

    }

  }

  /* ---------------------------------------------------------- */
  /* ------------METHODS: CHILD TRIGGERED METHODS------------ */
  /* ---------------------------------------------------------- */


  /**
   * Passes data as prop to the filter child for the quick filter
   * @see filterQuickSearchUpdate
   */
  triggerQuickSearchInput(searchValue: string){
    this.filterQuickSearchUpdate = searchValue
  }

  /**
   * Removes the child that triggered this action from the list
   * @param assetPath {string} - An absolute path of the asset triggering this
   */
  triggerRemoveFromList(assetPath : string){

    // Filter out the task we are looking for and remove it from the list
    let taskIndex: number = -1

    let assetListSnapShot : any = []
    qExtend(true, assetListSnapShot, this.assetListCombined)

    assetListSnapShot.forEach((singleAsset, index)=> {
      if (singleAsset.folderPath === assetPath) {taskIndex = index}
    })
    assetListSnapShot.splice( taskIndex, 1)

    // Assign filtered snapshot back to the observer
    this.assetListCombined = assetListSnapShot


    // Repeat for filtered list
    taskIndex = -1

    qExtend(true, assetListSnapShot, this.assetListFiltered)

    assetListSnapShot.forEach((singleAsset, index)=> {
      if (singleAsset.folderPath === assetPath) {taskIndex = index}
    })
    assetListSnapShot.splice( taskIndex, 1)

    // Assign filtered snapshot back to the observer
    this.assetListFiltered = assetListSnapShot

    // Trigger request for new data for the filters after resetting them
    this.resetFilterData()
  }

  /**
   * Updates data for the asset miniature
   * Data come inside an object!
   * @param status {string} - Active or Backup
   * @param oldPath {string} - Absolute old folder path
   * @param folderPath {string} - Absolute new folder path
   * @param configPath {string} - Absolute new config path
   */
  triggerChangeMiniatureData({status, oldPath, folderPath, configPath}){

    // Update config from the new path, or remove it, if it isn't there
    let newConfig = undefined
    if(fs.existsSync(configPath)) {
      //@ts-ignore
      newConfig = JSON.parse(fs.readFileSync(configPath))
    }

    // Filter out the task we are looking for and remove it from the list
    let taskIndex: number = -1

    let assetListSnapShot: any = []
    qExtend(true, assetListSnapShot, this.assetListCombined)

    assetListSnapShot.forEach((singleAsset, index)=> {
      if (singleAsset.folderPath === oldPath) {taskIndex = index}
    })
    assetListSnapShot[taskIndex].folderPath = folderPath
    assetListSnapShot[taskIndex].status = status
    assetListSnapShot[taskIndex].mkSettings = newConfig

    // Assign filtered snapshot back to the observer
    this.assetListCombined = assetListSnapShot

    // Repeat for filtered list
    taskIndex = -1

    qExtend(true, assetListSnapShot, this.assetListFiltered)

    assetListSnapShot.forEach((singleAsset, index)=> {
      if (singleAsset.folderPath === oldPath) {taskIndex = index}
    })
    assetListSnapShot[taskIndex].folderPath = folderPath
    assetListSnapShot[taskIndex].status = status
    assetListSnapShot[taskIndex].mkSettings = newConfig

    // Assign filtered snapshot back to the observer
    this.assetListFiltered = assetListSnapShot

    // Trigger request for new data for the filters after resetting them
    this.resetFilterData()
  }

  /**
   * Updates the filter values depending on
   * @param filterUpdateValue - Update value from the child
   * @see filterContents - The value that gets updated on this component
   */
  triggerUpdateFilter(filterUpdateValue: assetFilterContentInterface){

    // Merge unique "Names"
    this.filterContents.names = [...new Set([...filterUpdateValue.names ,...this.filterContents.names])]

    // Merge unique "Status"
    this.filterContents.status = [...new Set([...filterUpdateValue.status ,...this.filterContents.status])]

    // Merge unique "Authors"
    this.filterContents.authors = [...new Set([...filterUpdateValue.authors ,...this.filterContents.authors])]

    // Merge unique "Commercial uses"
    this.filterContents.commercialUses = [...new Set([...filterUpdateValue.commercialUses ,...this.filterContents.commercialUses])]

    // Merge unique "Licenses"
    this.filterContents.licenses = [...new Set([...filterUpdateValue.licenses ,...this.filterContents.licenses])]

    // Merge unique "Tags"
    this.filterContents.tags = [...new Set([...filterUpdateValue.tags ,...this.filterContents.tags])]

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

</style>

