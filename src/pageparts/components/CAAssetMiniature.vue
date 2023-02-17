<template lang="pug">

.AssetMiniature(
  :class="[\
    {'-opened': showExtraInfo},\
    {'isLocked': isLocked},\
    {'-hiddenByFilter': !passedFilters},\
    {'hasConfig': compatibleAsset === 'Compatible'}\
  ]"
)

  DragonSpinner(v-show="isLocked")

  .AssetMiniature__content

    .AssetMiniature__content__imageWrapper.clickable

      // Image
      template(v-if='assetData.images[0]')
        img( :src='assetData.images[0].src')
      template(v-if='!assetData.images[0]')
        img(:src="placeholderImage")

      // Rating & reviews & downloads
      .AssetMiniature__content__imageWrapper__fileDetails(v-if="assetData.purchasable === false")

        // Rating & reviews
        .rating( :class='{incompatible: isMKCompatible}')
          .stars
            .overlay(:style='`width: ${ratingWidth};`')
          .reviews
            | {{ assetData.rating_count }} {{ grammarRatingsMultiple }}
          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Average rating: {{parseInt(assetData.average_rating)}}/5

        // Downloads
        .downloads(:class='{incompatible: isMKCompatible}')
          .amount
            | {{ assetData.total_sales }}
          .subtitle
            | downloads

    // All of the basic info
    .AssetMiniature__content__basicInfoWrapper

      .AssetMiniature__content__basicInfoWrapper__buyableAsset.shadow-3(v-if="assetData.purchasable === true || hasPrice")
        q-icon(
          size="17px"
          name="attach_money")

        q-tooltip(
          :delay="300"
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down")
          | This item has a price set to it.
          br
          | You can buy it for the uploader for <b>{{assetData.price}} € </b>

      .title
        | {{ assetData.name }}
        br
        | {{ assetData.id }}
        q-tooltip(
          :delay="300"
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down")

          b {{ assetData.name }}

      //.author
        .label
          | Uploader

          .iconGroup

            // Icon - Author - URL
            span(
              v-if='assetData.User.website'
              @click='openURL(assetData.User.website)')

              q-icon(name="open_in_browser")

              q-tooltip(
                :delay="300"
                anchor="top middle"
                self="bottom middle"
                transition-show="jump-up"
                transition-hide="jump-down")

                | Visit authors website at:
                br
                b {{ assetData.User.website }}

            // Icon - Author - Donate
            span(
              v-if='assetData.custom_fields.donation_btn'
              @click='openURL(assetData.custom_fields.donation_btn)')

              q-icon(class="impGood" name="mdi-coffee")

              q-tooltip(
                :delay="300"
                anchor="top middle"
                self="bottom middle"
                transition-show="jump-up"
                transition-hide="jump-down")

                | Consider donating to the author at:
                br
                b {{ assetData.custom_fields.donation_btn }}

        // Author line
        .content.author(
          @click="triggerQuickSearchInput(assetData.username)"
        )

          .name
            | {{ assetData.username }}

          .icon
            template(v-if='assetData.User.avatar_urls.s !== null')
              img.shadow-1(:src='assetData.User.avatar_urls.s')
            template(v-if='assetData.User.avatar_urls.s === null')
              .backupAvatar.shadow-1(:style='`background-color:${authorBackupColor}`')
                | {{ authorBackupAvatar }}

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")

            | Filter by uploader:
            br
            b {{ assetData.username }}

      // License
      //.license
        .label
          | License &amp; Use:
          .iconGroup

        .impGood.content(
          v-if="isCommerciallyUseable"
          @click="triggerQuickSearchInput('commercial')"
        )
          q-icon(name="check")
          q-icon(name="attach_money")
          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Filter by commercial use:
            br
            b commercial

        .impBad.content(
          @click="triggerQuickSearchInput('personal')"
          v-if="!isCommerciallyUseable")

          q-icon(name="check")
          q-icon(name="not_interested")

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Filter by commercial use:
            br
            b personal

        .content.licenseContent(
          v-if="assetData.custom_fields.CCLicense && assetData.custom_fields.CCLicense !== 'OTHER'"
          @click="triggerQuickSearchInput(`CC-${assetData.custom_fields.CCLicense}-4.0`)"
        )
          | CC-{{ assetData.custom_fields.CCLicense }}-4.0

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Filter by license:
            br
            b CC-{{ assetData.custom_fields.CCLicense }}-4.0

        .content.licenseContent(
          v-if="assetData.custom_fields.CCLicense && assetData.custom_fields.CCLicense === 'OTHER'"
          @click="triggerQuickSearchInput(assetData.custom_fields.CCLicense)"
        )
          | {{ assetData.custom_fields.CCLicense }}

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Filter by license:
            br
            b {{ assetData.custom_fields.CCLicense }}

      // Category & Prefix
      .categoryPrefix
        .label
          | Categories

        // Category
        template(
          v-if="[...assetData.categories.map(cat => cat.name)].length > 0"
        )
          .content(
            v-for='(cat) in [...assetData.categories.filter(cat => cat.name !== "Licenses").map(cat => cat.name)]'
            :key='cat'
            @click="triggerQuickSearchInput(cat)"
          )
            q-icon(
              name="mdi-cards")
            | {{ cat }}

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")
              | Filter by category:
              br
              b {{ cat }}

      // Commands
      .commandLine

        // View item
        q-btn(
          icon="open_in_browser"
          outline
          class="q-ml-sm"
          color="primary"
          @click="openCALink"
        )

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            b View item details on the website
            br
            | (opens a new browser window).

        // Download item
        q-btn(
          v-if="assetData.purchasable === false && !hasPrice && isInstalled === null"
          icon="mdi-download"
          outline
          class="q-ml-sm"
          color="primary"
          @click="dialogIncompatibleCheck()"
        )

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Download and install <b>{{ assetData.name }}</b>


        // Update item
        q-btn(
          v-if="assetData.purchasable === false && !hasPrice && isInstalled === false"

          class="q-highlight-secondaryCta"
          icon="mdi-chevron-double-up"
          outline
          class="q-ml-sm"
          color="primary"
          @click="downloadItem(false,false)"
        )

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | Update <b>{{ assetData.name }}</b> to the newest version

        // Up to date item
        q-btn(
          v-if="assetData.purchasable === false && !hasPrice && isInstalled === true"

          class="q-highlight-pass"
          icon="check"
          outline
          class="q-ml-sm"
          color="primary"
          @click="dialogIncompatibleCheck"
        )

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")
            | <b>{{ assetData.name }}</b> Is already installed and up to date.
            br
            | If you wish, you can reinstall it or download another variation if available.

    // Extended info
    transition(
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp")

      .AssetMiniature__content__extendedInfoWrapper(
        v-show="showExtraInfo"
        )

        .tags(v-if='assetData.tags.length !== 0')

          .label
            | Tags

          .content(
            :disabled='storeGetTaskList.length !== 0'
            v-for='tag in [...assetData.tags.map(tag => tag.name)]'
            :key='tag'
            @click="triggerQuickSearchInput(tag)"
          )
            | {{ tag }}

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              | Filter by tag:
              br
              b {{ tag }}

        //.description(v-if='assetData.tag_line')

          .label
            | Description

          .content(v-html='assetData.tag_line')

        .dates

          .label
            | Last update
          .content
            | {{dateFormatLastUpload}}
          .label
            | First upload
          .content
            | {{dateFormatFirstUpload}}
</template>

<script lang="ts">

// Libs
import {remote, ipcRenderer} from "electron"
import fs from "fs-extra"
import moment from "moment"
import {extend as qExtend} from "quasar"

// File managers
import DownloadManagerMK from "@/scripts/fileManagers/downloadManagerMK"

// Import placeholder images
//@ts-ignore
import placeholderImage from "../../assets/images/placeholderSymbol.png"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"
import interfaceUnpackInstaller from "@/scripts/interfaces/_interfaceUnpackInstaller"
import MKPathsInterface from "@/scripts/interfaces/_interfaceMKPaths"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"
import CAFilterContentInterface from "@/scripts/interfaces/_interfaceCAFilterContent"

// Decorators & Vue base + VUEX Decorators
import {Component, Prop, Watch} from "vue-property-decorator"
import { Getter,Action} from "vuex-class"

//Components
import DragonSpinner from "@/pageparts/components/DragonSpinner.vue"

@Component({
  components: {
    DragonSpinner
  }
})
export default class CaClientModule extends BaseClass {

  /* ----------------------------------- */
  /* ------------VUE NATIVE------------ */
  /* ----------------------------------- */


  /**
   * Vue native Mounted lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  mounted(){
    this.isInstalled = this.assetData.updateState

  }


  /* ------------------------------------------------------- */
  /* ------------VUEX: OVERLAY FUNCTIONALITY-------------- */
  /* ------------------------------------------------------- */


  /**
   * Determines if the overlay visibility is set to true or false right now.
   */
  @Getter storeGetOverlayVisibility !: boolean


  /* ------------------------------------------------ */
  /* ------------VUEX: COMPONENT LOCKS-------------- */
  /* ------------------------------------------------ */


  /**
   * Gets a list of component locks from the store
   * @returns {string[]} Each lock is an absolute folder path bound to the absolute path of the particular asset
   */
  @Getter storeGetComponentLocks !: string[]

  /**
   * Adds a new folder path lock to the store
   * @param lockPath {string} - An absolute folder path
   */
  @Action storeAddComponentLock !: (lockPath: string) => void

  /**
   * Remove a folder path from the store
   * @param lockPath {string} - An absolute folder path
   */
  @Action storeRemoveComponentLock !: (lockPath: string) => void


  /* --------------------------------------- */
  /* ------------SECTION: FILTERS---------- */
  /* --------------------------------------- */


  /**
   * Determines if this asset passed through the filters and is therefore shown
   */
  passedFilters: boolean = true

  /**
   * Currently active filters
   */
  @Prop() readonly activeFilterContent!: CAFilterContentInterface

  /**
   * Triggers an update of filter list on the parent
   */
  triggerQuickSearchInput(filterValue: string){
    this.$emit("trigger-quick-search-input", filterValue)
  }

  /**
   * React to changes in the filter list from the parent
   */
  @Watch("activeFilterContent",{ immediate: true,deep: true })
  watchActiveFilterContent(activeFilters: CAFilterContentInterface){


    let licenseField = (this.assetData.custom_fields && this.assetData.custom_fields.CCLicense)? this.assetData.custom_fields.CCLicense: undefined

    if (licenseField && licenseField !== "OTHER") {
      licenseField =  `CC-${ licenseField }-4.0`
    }

    let updateState:string = ""
    if (this.assetData.updateState === true) {
      updateState = "Up to date"
    }
    if (this.assetData.updateState === false) {
      updateState = "Update available"
    }
    if (this.assetData.updateState === null) {
      updateState = "Not installed"
    }



    let mkCompatibility = ""
    if (this.assetData.attributes.find(single =>{
      single.id === 9 && single.options && single.options[0] === "Yes"
    })) {
      mkCompatibility = "Compatible"
    }
    else{
      mkCompatibility = "Incompatible"
    }

    // Local filter values
    const localFilterValues: CAFilterContentInterface = {
      names: [this.assetData.name],
      categories: [...this.assetData.categories.map(cat => cat.name)],
      prefixes: [this.assetData.prefix],
      authors: [this.assetData.username],
      compatibleMK: [mkCompatibility],
      installationState: [updateState],
      commercialUses:[(this.assetData.custom_fields && this.assetData.custom_fields.license)? this.assetData.custom_fields.license: undefined],
      licenses:[licenseField],
      tags: [...this.assetData.tags.map(tag => tag.name)]
    }

    // Set the booleans
    const filterValues: any = {
      //authors: false,
      //prefixes: false,
      categories: false,
      //commercialUses: false,
      //licenses: false,
      compatibleMK: false,
      installationState: false,
      tags: false
    }

    // Fields we want to specifically loop through
    const filterLoop: string[] = [
      //"authors",
      //"prefixes",
      "categories",
      //"commercialUses",
      //"licenses",
      "tags",
      "compatibleMK",
      "installationState"
    ]

    // Set dummy value to evade any type errors
    const localQuickSearch: any = {
      value: ""
    }

    // Snapshot observable
    qExtend(true, localQuickSearch, activeFilters.allSearch)


    // Run whole check ONLY if the filters as a whole are active to begin with
    if (activeFilters.filtersActive) {

      // Check each field from the loop
      filterLoop.forEach((filterFieldName)=>{

        // Check if we have quick search as a backup
        if(localQuickSearch.value.length > 0){

          // Compare against anything isn't a name
          localFilterValues[filterFieldName].forEach((single)=>{

            const needle = localQuickSearch.value.toLowerCase()
            const haystack = (single)? single.toLowerCase(): ""


            // Quick search needs just one single field to match in order to show the whole asset
            if(haystack.includes(needle)){
              //filterValues.authors = true
              //filterValues.prefixes = true
              filterValues.categories = true
              //filterValues.commercialUses = true
              //\filterValues.licenses = true
              filterValues.compatibleMK = true
              filterValues.installationState = true
              filterValues.tags = true
            }
          })

          // Each asset has only one name so compare against it
          if (localFilterValues.names[0].toLowerCase().includes(localQuickSearch.value.toLowerCase())) {
            //filterValues.authors = true
            //filterValues.prefixes = true
            filterValues.categories = true
            //filterValues.commercialUses = true
            //filterValues.licenses = true
            filterValues.compatibleMK = true
            filterValues.installationState = true
            filterValues.tags = true
          }

        }

        // Check if nothing slipped through the cracks via 3rd party
        else if (activeFilters[filterFieldName]
            && activeFilters[filterFieldName].length > 0
        ) {

          localFilterValues[filterFieldName].forEach((single)=>{

            if(activeFilters[filterFieldName].find(a =>a === single)){

              filterValues[filterFieldName] = true
            }
          })

        }

        // If the value is somehow undefined or null and we dont have a quick search
        else{
          filterValues[filterFieldName] = true
        }

      })

    }

    // If filters are not active, let everything through
    else{
      //filterValues.authors = true
      //filterValues.prefixes = true
      filterValues.categories = true
      //filterValues.commercialUses = true
      //filterValues.licenses = true
      filterValues.compatibleMK = true
      filterValues.installationState = true
      filterValues.tags = true
    }

    // Compare all booleans to determine if to show the asset
    if (
      //filterValues.authors &&
    //filterValues.prefixes &&
      filterValues.categories &&
    //filterValues.commercialUses &&
    //filterValues.licenses &&
    filterValues.tags &&
    filterValues.compatibleMK &&
    filterValues.installationState
    ) {
      this.passedFilters = true
    }
    else{
      this.passedFilters = false
    }


  }

  /* ----------------------------------------- */
  /* ------------SECTION: MINIATURE---------- */
  /* ----------------------------------------- */

  /**
   * Reactive property if the "extra info" slideout is showing or not
   * Set in the upper bar via switch
   *
   */
  @Prop() readonly showExtraInfo!: boolean

  /**
   * Determines the state of the
   */
  isInstalled: null|boolean = null

  /**
   * Data about the item passed from the parent list
   */
  @Prop() readonly assetData!: any

  /**
   * Data about the item passed from the parent list
   */
  @Prop() readonly childTriggerChecker!: boolean

  get hasPrice(){

    if(this.assetData.purchasable){return true}

    const price = parseInt(this.assetData.price)

    if(this.assetData.id === 5293){
      console.log(price)
    }

    if(!isNaN(price) && price > 0){
      return true
    }

    return false

  }

  get compatibleAsset(){

    if (this.assetData.attributes.find(single =>{
      return single.id === 9 && single.options && single.options[0] === "Yes"
    })) {
      return "Compatible"
    }
    else{
      return "Incompatible"
    }
  }

  /**
   * Reacts to parent calls to trigger checking of the asset data
   */
  @Watch("childTriggerChecker",{ immediate: true})
  watchTriggerChecker(value: boolean){
    if (value) {
      this.isInstalled = this.assetData.updateState
    }
  }

  /**
   * Reacts to parent calls to trigger refresh of the sources
   */
  @Watch("isLocked")
  watchComponentLock(value: boolean){
    if (!value) {
      this.$emit("recheck-item")
    }
  }

  /**
   * Determines if the component is locked or not
   * @returns {boolean} Return "true" or "false"
   */
  get isLocked(){
    const lockExists = this.storeGetComponentLocks.find((singleLockPath)=>{
      return singleLockPath === this.assetData.id
    })

    // If we found the lock, lock the file, otherwise unlock it
    return lockExists !== undefined
  }

  /**
   * Determines if the author ticked the item being compatible with MK or not.
   */
  isMKCompatible = false

  /**
   * Placeholder image for items that have no preview images.
   */
  placeholderImage = placeholderImage

  /**
   * Opens a link of Cartography Assets
   */
  openCALink() {
    remote.shell.openExternal(this.$props.assetData.permalink)
  }

  /* ----------------------------------------------- */
  /* ------------SECTION: COMMERCIAL USE---------- */
  /* ----------------------------------------------- */


  /**
   * Determines if the asset is set as commercially useable or not
   */
  get isCommerciallyUseable(){
    let isCommerciallyUseable:boolean = false

    if (this.assetData.custom_fields && this.assetData.custom_fields.license === "commercial"
          || (this.assetData.custom_fields && this.assetData.custom_fields.CCLicense === "BY")
          || (this.assetData.custom_fields && this.assetData.custom_fields.CCLicense === "BY_SA")
          || (this.assetData.custom_fields && this.assetData.custom_fields.CCLicense === "BY_ND")) {
      isCommerciallyUseable = true
    }

    return isCommerciallyUseable
  }


  /* -------------------------------------- */
  /* ------------SECTION: RATING---------- */
  /* -------------------------------------- */


  /**
   * Determines the width of the golden star overlay.
   */
  get ratingWidth() {
    const ratingWidth = (this.$props.assetData.average_rating * 2) * 10
    return ratingWidth + "%"
  }

  /**
     * Determines if we use singular or plural for the "ratings" word.
     */
  get grammarRatingsMultiple() {
    if (this.$props.assetData.rating_count === 1) {
      return "reviews"
    } else {
      return "reviews"
    }

  }


  /* ------------------------------------------------------ */
  /* ------------SECTION: PARENT TRIGGER UPDATE---------- */
  /* ------------------------------------------------------ */


  /**
   * Data about the item passed from the parent list
   */
  @Prop() readonly childTriggerUpdate!: boolean

  /**
   * Reacts to parent calls to trigger checking of the asset data
   */
  @Watch("childTriggerUpdate")
  watchTriggerUpdate(value: boolean){

    if (value && this.isInstalled === false) {

      this.downloadItem(false,false)

    }
  }


  /* ---------------------------------------- */
  /* ------------SECTION: DOWNLOAD---------- */
  /* ---------------------------------------- */


  /**
   * Data about the item passed from the parent list
   */
  @Prop() readonly mkPaths!: MKPathsInterface

  /**
   * A variable for the multi-file interval overlay checker if needed
   */
  installerInterval:any = null

  /**
   * Check for expert mode before opening the dialog
   */
  dialogIncompatibleCheck(){

    //Trigger popup if expert mode is not allowed
    if (!this.storeGetIsExpertModeAllowed && this.compatibleAsset !== "Compatible"){
      this.dialogIncompatible()
    }

    // If the expert mode is on then proceed without asking
    else{
      this.dialogAlreadyInstalledCheck()
    }
  }

  /**
   * Open a dialog, asking if the user wants to overwrite the item.
   */
  dialogIncompatible(){
    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: "Incompatible item",
      contents: `
        The item you are intending to install is marked as incompatible with Mythkeeper.
        <br>
        While we are aware that this can be an oversight on the uploader's end, we would like to warn you that downloading such an asset could cause the following:
        <br>
        <br>- <b>Mythkeeper errors & possible crashes</b>
        <br>- <b>Wonderdraft errors & possible crashes</b>
        <br>- <b>Corruption of any maps opened in Wonderdraft with this item installed</b> (unlikely)
        <br>- <b>Taking space on your hard-drive for no reason</b>
      `,
      actions: [
        {
          title: "Close & Cancel",
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: "Acknowledge & Proceed",
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param: {
            functionName: "dialogAlreadyInstalledCheck",
            data: {}
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)
  }

  /**
   * Check for expert mode before opening the dialog
   */
  dialogAlreadyInstalledCheck(){

    //Trigger popup if expert mode is not allowed
    if (!this.storeGetIsExpertModeAllowed && this.isInstalled === true){
      this.dialogAlreadyInstalled()
    }

    // If the expert mode is on then proceed without asking
    else{
      this.downloadItem()
    }
  }

  /**
   * Open a dialog, asking if the user wants to overwrite the item.
   */
  dialogAlreadyInstalled(){
    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: "Already installed & Up to date",
      contents: `
        The item you are trying to install is already installed.
        <br>
        The following action will re-download the same version of the asset already present on your computer.
        <br>
        <br>
        <b>Please reconsider unless you aim to fix a broken package or download a different variation in case the item is a multi-version.</b>
      `,
      actions: [
        {
          title: "Close & Cancel",
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: "Continue with download",
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param: {
            functionName: "downloadItem",
            data: {}
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)
  }

  /**
   * Downloads an item from Cartography assets.
   * @param inputUrl - Either an absolute string where to download from or false if we want to let the default run.
   * @param isUpdate - Determines if this is an update or a new installation. If set to true, it will skip prompts for user and overwrite the asset without asking
   */
  async downloadItem(inputUrl:boolean|string = false,isUpdate: boolean = false){

    // Fix buggy inputs
    if (typeof inputUrl !== "boolean" && typeof inputUrl !== "string") {
      inputUrl = false
    }

    let hasPrepickedDownload = false

    if(inputUrl === false){
      console.log(this.assetData.downloads)
      inputUrl = this.assetData.downloads["0"].file
    }
    else{
      hasPrepickedDownload = true
    }

    const currentTimeStamp:number = new Date().getTime()
    const tempFolder = this.mkPaths.mkTemp + "/" + currentTimeStamp


    // Handle multi-file input
    if (this.assetData.downloads.length > 1 && !hasPrepickedDownload) {


      const downloadableItems = this.assetData.downloads

      // Overlay dialog contents
      const overlayContents: overlayActionsInterface = {
        componentID: this.getComponentID(),
        title: "Download file choice",
        downloadItems: downloadableItems,
        contents: `
          <b>${this.assetData.name}</b> has multiple variations for download.
          <br>
          Please chose which one do you wish to download.`,
        actions: [
          {
            title: "Close & Cancel",
            classes: "q-btn--outline -noBG",
            action: "closeModal"
          },
          {
            title: "Download selected",
            classes: "",
            action: "storeSetOverLayTriggerAction",
            param: {
              functionName: "downloadItem",
              data: {}
            }
          }
        ]
      }

      // Set timer for multi-file popup
      this.installerInterval = setInterval(() => {

        if (!this.storeGetOverlayVisibility) {

          clearInterval(this.installerInterval)

          // Trigger dialog
          this.triggerDownloadChoiceDialog(overlayContents)

          this.storeRemoveComponentLock(this.assetData.id)
          fs.removeSync(tempFolder)

        }
      }, 2000)

      return
    }
    // Handle single file
    else{
      await new Promise((resolve) => {

        // Lock item
        this.storeAddComponentLock(this.assetData.id)

        // Set new task for the store and also set it locally for updates and removal later
        const newTask = this.commitNewTask("Downloading", this.assetData.name)
        const command: interfaceBackgroundRenderWork = {
          command: "downloadItem-work",
          status: "active",
          progress: 0,
          taskID: newTask.uniqueTaskID,
          data: {
            itemRecourseId: this.assetData.id,
            timeStamp: currentTimeStamp,
            tempFolder: tempFolder,
            mkPaths: this.mkPaths,
            inputUrl: inputUrl
          }
        }

        ipcRenderer.send("asynchronous-message", command)

        // Set timer for reporting
        const reportTimer = setInterval(() => {
          const workList = remote.getCurrentWindow()["workList"]

          let taskIndex: number = -1

          workList.forEach((singleTask: interfaceBackgroundRenderWork, index) => {
            if (singleTask.taskID === command.taskID) {
              taskIndex = index
            }
          })

          if (taskIndex !== -1) {

            this.updateTask(newTask, workList[taskIndex].progress)

          } else {

            // Cleanup and removal of the task from the tasklist
            clearInterval(reportTimer)
            this.updateTask(newTask, 100)
            this.removeTask(newTask)

            //@ts-ignore
            resolve()

          }

        }, 1000)
      })

    }

    const tempJSON = {
      vendors: {
        cartographyassetsID: this.assetData.id,
        cartographyassetsVersion:Date.parse(this.assetData.date_modified)
      }
    }

    const tempFileList = fs.readdirSync(tempFolder)

    for (const tempFile of tempFileList) {
      if (tempFile.includes(".zip") || tempFile.includes(".wonderdraft_theme")) {

        const output:interfaceUnpackInstaller = {
          askForOverwrite: this.assetData.updateState,
          tempJSON: tempJSON,
          tempFolderPath: tempFolder,
          unpackPath: tempFolder+"/"+tempFile,
          componentLock: this.assetData.id
        }
        this.$emit("trigger-installer",output)
      }
    }

  }


  /* -------------------------------------- */
  /* ------------SECTION: AUTHOR---------- */
  /* -------------------------------------- */


  /**
   * Generates a corresponding hex color our of a normal strong - Magic!
   * @param str - An input string of any kind
   */
  convertStringToColor(str) {
    let hash = 0
    let colour = "#"

    if (str) {
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }

      for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF
        colour += ("00" + value.toString(16)).substr(-2)
      }
      return colour
    } else {
      return str
    }
  }

  /**
   * A backup avatar for the user if there is no avatar uploaded. Use the first innitial in their nickname on CA.com.
   */
  get authorBackupAvatar() {
    return this.$props.assetData.username.slice(0, 1)
  }

  /**
   * A backup avatar background generated in case the avatar is missing on CA.com.
   */
  get authorBackupColor() {
    let str = this.$props.assetData.username
    return this.convertStringToColor(str)
  }


  /* ------------------------------------- */
  /* ------------SECTION: DATES---------- */
  /* ------------------------------------- */


  get dateFormatFirstUpload() {

    return moment(Date.parse(this.assetData.date_modified), "X").format("D. MMM. YYYY, h:mm a")
  }

  get dateFormatLastUpload() {
    return moment(Date.parse(this.assetData.date_created), "X").format("D. MMM. YYYY, h:mm a")
  }
}
</script>


<style lang="sass" scoped>
  @import '../../assets/sass/globals'

  .AssetMiniature
    position: relative
    border-radius: 0 4px 4px 0
    transition: 0.5s all
    width: 510px
    margin: 30px 31px 30px 47px
    height: 250px

    &.-hiddenByFilter
      position: absolute
      pointer-events: none
      opacity: 0

    &.-opened
      height: inherit

    &:after
      content: ''
      position: absolute
      left: -8px
      width: 8px
      top: 0
      height: 250px
      background-color: rgba(darken($themeCol-iconBad,10), 0.85)
      border-radius: 10px 0 0 10px

    &.hasConfig
      &:after
        background-color: rgba(darken($themeCol-iconGood,5), 0.8)

    &.isLocked
      *:not(.DragonSpinner)
        pointer-events: none
        filter: sepia(1) brightness(50%)

      .AssetMiniature__content__imageWrapper
        filter: sepia(0.2) grayscale(0.8) brightness(0.45)

        &.clickable
          filter: brightness(20%)

      .DragonSpinner
        height: 250px

    &.backup

      &:after
        background-color: rgba(darken($themeCol-iconBad,40), 0.85)

      &.hasConfig
        &:after
          background-color: rgba(darken($themeCol-iconGood,30), 0.8)

      .AssetMiniature__content__basicInfoWrapper
        +MK_elementBackground('../../assets/images/MKbackgroundElementsAlt.png')
        filter: sepia(0.8) brightness(70%) grayscale(50%)

      .AssetMiniature__content__extendedInfoWrapper
        +MK_elementBackground('../../assets/images/MKbackgroundElementsAlt.png')
        filter: sepia(0.8) brightness(70%) grayscale(50%)

      .AssetMiniature__content__imageWrapper
        filter: sepia(0.2) grayscale(0.8) brightness(0.50)

        &.clickable
          filter: brightness(50%)


    &__content
      position: relative
      z-index: 1
      color: $themeCol-text
      display: flex
      flex-wrap: wrap

      &__imageWrapper
        overflow: hidden
        z-index: 1
        width: 250px
        height: 250px
        flex-shrink: 0
        flex-grow: 0
        display: flex
        justify-content: center
        align-items: center
        position: relative
        background-image: url("../../assets/images/assetMiniatureBackground.png")
        pointer-events: none
        filter: sepia(0.2) grayscale(0.8) brightness(0.45)
        box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)

        &.clickable
          cursor: pointer
          pointer-events: auto
          filter: none

        &__fileDetails
          font-family: "Friz Quadrata", sans-serif
          position: absolute
          left: 5px
          bottom: 5px
          background-color: rgba($themeCol-ElementBackground, 0.7)
          border-radius: 4px
          padding: 1px 8px
          font-size: 12px
          display: flex
          width: 180px

          .rating
            flex-basis: 60%
            display: flex
            align-items: center
            justify-content: center
            flex-direction: column

            .stars
              position: relative
              margin: 2px 0 2px

              -webkit-mask-image: url(~@/assets/images/starRating.png), none
              -webkit-mask-size: contain
              -webkit-mask-repeat: no-repeat
              -webkit-mask-position: center

              width: 75%
              background-size: 100%
              height: 18px
              background-color: #acacac

              .overlay
                position: absolute
                left: 0
                top: 0
                bottom: 0

                background-color: gold

            .reviews
              color: gold
              font-size: 12px
              margin-bottom: 2px

          .downloads
            display: flex
            align-items: center
            justify-content: center
            flex-direction: column
            flex-basis: 40%

            .amount
              font-size: 14px
              font-weight: 600
              letter-spacing: 1.3px

            .subtitle
             font-size: 12px

      &__basicInfoWrapper,
      &__extendedInfoWrapper
        padding: 8px 10px 8px 8px
        font-size: 14px
        font-weight: 400
        letter-spacing: 1.4px
        flex-grow: 1
        position: relative

        +MK_elementBackground('../../assets/images/MKbackgroundElements.png')
        &:before
          border-radius: 0 4px 4px 0

        *:not(.q-icon)
          font-family: "Friz Quadrata", sans-serif

        >*
          z-index: 1
          position: relative

        .iconGroup
          flex-shrink: 0
          margin-bottom: 3px

          .q-icon
            height: 19px
            width: 19px
            min-width: 19px
            font-size: 19px !important
            margin-left: 5px
            color: rgba($themeCol-titles, 0.9)
            cursor: pointer
            transition: 0.3s color $transition-DefaultType

            &:hover
              color: rgba($themeCol-titlesGlow, 0.9)

            &.impGood
              color: rgba($themeCol-iconGood, 0.9)

              &:hover
                color: lighten(rgba($themeCol-iconGood, 0.9), 10)

            &.impBad
              color: rgba($themeCol-iconBad, 0.9)

              &:hover
                color: lighten(rgba($themeCol-iconBad, 0.9), 10)
            &.impNeutral
              color: rgba($themeCol-iconNeutral, 0.9)

              &:hover
                color: lighten(rgba($themeCol-iconNeutral, 0.9), 10)

        .title
          font-size: 17px
          font-weight: 600
          line-height: 1.2
          padding-bottom: 5px

          width: 225px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          color: $themeCol-titlesGlow

        .author,
        .distributor,
        .license,
        .commercialUse,
        .tags,
        .categoryPrefix
          font-size: 14px
          padding-bottom: 1px

          .label
            font-weight: 600
            display: flex
            width: 100%
            justify-content: space-between
            align-items: center

          .content
            font-weight: 600
            font-size: 15px
            cursor: pointer
            line-height: 1.1
            color: $themeCol-textInvert
            background-color: rgba($themeCol-titles, 0.75)
            border-radius: 4px
            padding: 3px 6px 3px
            display: inline-block
            transition: 0.3s all $transition-DefaultType
            max-width: 240px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            margin-left: 5px
            left: -5px
            position: relative

            &.author
              display: flex
              align-items: center
              width: max-content
              margin-bottom: 5px

              .icon
                margin-left: 5px
                height: 25px

                img,
                .backupAvatar
                  height: 25px
                  width: 25px
                  border-radius: 50%
                  background-color: #000
                  display: flex
                  justify-content: center
                  align-items: center
                  color: #fff
                  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
                  font-size: 14px

            .q-icon
              height: 16px !important
              width: 16px !important
              min-width: 16px !important
              font-size: 16px !important

            &:hover
              background-color: rgba($themeCol-titles, 0.9)

            &.impGood
              background-color: rgba($themeCol-iconGood, 0.7)
              color: $themeCol-text
              font-weight: 500

              &:hover
                background-color: rgba($themeCol-iconGood, 0.9)

            &.impBad
              background-color: rgba($themeCol-iconBad, 0.7)
              color: $themeCol-text
              font-weight: 500

              &:hover
                background-color: rgba($themeCol-iconBad, 0.9)

            &.impNeutral
              background-color: rgba($themeCol-iconNeutral, 0.7)
              color: $themeCol-text
              font-weight: 500

              &:hover
                background-color: rgba($themeCol-iconNeutral, 0.9)

            &[disabled]
              pointer-events: none
              filter: grayscale(1) brightness(0.6)

        .license
          .licenseContent
            max-width: 188px

        .categoryPrefix
          .content
            max-width: calc(50% - 5px)

      &__basicInfoWrapper
        box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
        width: calc(100% - 250px)
        height: 250px
        border-radius: 0 4px 4px 0
        z-index: 1

        &__buyableAsset
          position: absolute
          display: flex
          height: 25px
          width: 25px
          border-radius: 50%
          justify-content: center
          align-items: center
          background-color: rgba($themeCol-iconGood, 0.8)
          top: 5px
          right: 5px

        .commandLine
          position: absolute
          bottom: 10px
          right: 10px
          left: 10px

          display: flex
          justify-content: flex-end


      &__extendedInfoWrapper
        margin: 0 10px 0 5px
        padding: 0 15px 0
        width: 100%
        border-radius: 0 0 4px 4px
        box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
        border-top: none
        z-index: 0

        &:before
          border-radius: 0 0 5px 5px
          background-image: url("../../assets/images/MKbackgroundElementsAlt.png")

        &:after
          content: ''
          position: absolute
          top: 0
          left: 0
          right: 0
          height: 20px
          background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5018382352941176) 50%, rgba(0,0,0,0) 100%)

        >*
          &:first-child
            padding-top: 10px

          &:last-child
            padding-bottom: 10px !important

        .description,
        .dates
          font-size: 14px
          padding-bottom: 1px
          margin-bottom: 5px

          .label
            font-weight: 600
            display: flex
            width: 100%
            justify-content: space-between
            align-items: center

          .content
            font-family: "Open Sans", sans-serif
            background-color: rgba(#444444, 0.5)
            padding: 5px 10px
            font-size: 13px
            font-weight: 500
            line-height: 1.6
            border-radius: 4px
            filter: sepia(0.3)
            display: inline-block


</style>
