<template lang="pug">


  div(
    :class="[\
      'AssetMiniature',\
      compAssetData.status,\
      {'-opened': showExtraInfo},\
      {'hasConfig': assetData.mkSettings},\
      {'isLocked': isLocked},\
      {'-hiddenByFilter': !passedFilters}\
    ]"

    )

    DragonSpinner(v-show="isLocked")

    .AssetMiniature__content

      // Image wrapper
      .AssetMiniature__content__imageWrapper(
        :class="{'clickable': compAssetData.gallery.length > 0}"
        @click='triggerGallery()')

        q-tooltip(
          :delay="300"
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down")

          b {{ $t.assetMiniature.actions.openGallery }}

        img(:src='compAssetData.imagePreview')

        .AssetMiniature__content__imageWrapper__fileDetails

          template(v-if="compAssetData.status === 'backup'")
            | {{ compAssetData.status | uppercase }} |
          | {{ compAssetData.folderSize }}
          template(v-if='compAssetData.version')
            |&nbsp;| version {{ compAssetData.version }}

      // Basic info
      .AssetMiniature__content__basicInfoWrapper

        .title
          | {{ compAssetData.title }}

          q-tooltip(
            :delay="300"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down")

            b {{ compAssetData.title }}

        // Author group
        .author(v-if='compAssetData.author && compAssetData.author.exists')

          .label
            template(v-if="compAssetData.author.name === compAssetData.distributor.name")
              | {{ $t.assetMiniature.titles.authorAndDistributor }}
            template(v-else)
              | {{ $t.assetMiniature.titles.author }}

            .iconGroup

              // Icon - Author - Mail
              span(
                v-if='compAssetData.author.mail'
                @click="openURL('mailto:'+compAssetData.author.mail)")

                q-icon(name="email")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.sendEmailAuthor }}
                  br
                  b {{ compAssetData.author.mail }}

              // Icon - Author - URL
              span(
                v-if='compAssetData.author.url'
                @click='openURL(compAssetData.author.url)')

                q-icon(name="open_in_browser")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.openUrlAuthor }}
                  br
                  b {{ compAssetData.author.url }}

              // Icon - Author - Donate
              span(
                v-if='compAssetData.author.donationURL'
                @click='openURL(compAssetData.author.donationURL)')

                q-icon(class="impGood" name="mdi-coffee")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.donateUrlAuthor }}
                  br
                  b {{ compAssetData.author.donationURL }}

          .content(
            :disabled='storeGetTaskList.length !== 0'
            @click="triggerQuickSearchInput(compAssetData.author.name)")
            | {{ compAssetData.author.name }}

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              | {{ $t.assetMiniature.actions.filterByAuthor }}
              br
              b {{ compAssetData.author.name }}

        // Distributor group
        .distributor(v-if='(compAssetData.distributor && compAssetData.distributor.exists) && (compAssetData.author.name !== compAssetData.distributor.name)')

          .label
            | {{ $t.assetMiniature.titles.distributor  }}

            .iconGroup

              // Icon - Distributor - Mail
              span(
                v-if='compAssetData.distributor.mail'
                @click="openURL('mailto:'+compAssetData.distributor.mail)")

                q-icon(name="email")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.sendEmailDistributor }}
                  br
                  b {{ compAssetData.distributor.mail }}

              // Icon - Distributor - URL
              span(
                v-if='compAssetData.distributor.url'
                @click='openURL(compAssetData.distributor.url)')

                q-icon(name="open_in_browser")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.openUrlDistributor }}
                  br
                  b {{ compAssetData.distributor.url }}

              // Icon - Distributor - Donate
              span(
                v-if='compAssetData.distributor.donationURL'
                @click='openURL(compAssetData.distributor.donationURL)')

                q-icon(class="impGood" name="mdi-coffee")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.donateUrlDistributor }}
                  br
                  b {{ compAssetData.distributor.donationURL }}

          .content(
            :disabled='storeGetTaskList.length !== 0'
            @click="triggerQuickSearchInput(compAssetData.distributor.name)")
            | {{ compAssetData.distributor.name }}

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              | {{ $t.assetMiniature.actions.filterByDistributor }}
              br
              b {{ compAssetData.distributor.name }}


        // License group
        .license

          .label
            | {{ $t.assetMiniature.titles.license }}

            .iconGroup

              // Icon - License - Local file
              span(
                v-if='compAssetData.license.localFile'
                @click='openURL(compAssetData.localLicensePath)')

                q-icon(name="book")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.licenseOffline }}
                  br
                  b {{ compAssetData.localLicensePath }}

              // Icon - License - External link
              span(
                v-if='compAssetData.license.externalLink'
                @click='openURL(compAssetData.externalLicenseUrl)')

                q-icon(name="open_in_browser")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  | {{ $t.assetMiniature.smallIconActions.licenseOnline }}
                  br
                  b {{ compAssetData.externalLicenseUrl }}

              // Icon - License - Commentary file
              span(
                v-if='compAssetData.license.commentary'
                @click='openURL(compAssetData.localCommentaryPath)')

                q-icon(class="impBad" name="mode_comment")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  b  {{ $t.assetMiniature.smallIconActions.commentary }}
                  br
                  b {{ compAssetData.localCommentaryPath }}

              // Icon - License - Commercial URL
              span(
                v-if='compAssetData.commercialURL'
                @click='openURL(compAssetData.commercialURL)')

                q-icon(class="impGood" name="attach_money")

                q-tooltip(
                  :delay="300"
                  anchor="top middle"
                  self="bottom middle"
                  transition-show="jump-up"
                  transition-hide="jump-down")

                  |  {{ $t.assetMiniature.smallIconActions.commercialURL }}
                  br
                  b {{ compAssetData.commercialURL }}

          // Special commercial allowance status "icon"
          div(
            :disabled='storeGetTaskList.length !== 0'
            :class="[compAssetData.commercialUseExtraClass,'content']"
            @click="triggerQuickSearchInput(compAssetData.commercialUse)")

            q-icon(
              v-if="compAssetData.commercialUse === $t.globals.licenseStatuses.allowed"
              name="check")

            q-icon(
              v-if="compAssetData.commercialUse === $t.globals.licenseStatuses.notAllowed"
              name="not_interested")

            q-icon(
              v-if="compAssetData.commercialUse === $t.globals.licenseStatuses.notSpecified"
              name="help_outline")

            q-icon(name="attach_money")

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              | {{ $t.assetMiniature.actions.filterByCommercialUse }}
              br
              b {{ compAssetData.commercialUse }}

          .content.licenseContent(
            :disabled='storeGetTaskList.length !== 0'
            v-if='compAssetData.license && compAssetData.license.hasLicense'
            @click="triggerQuickSearchInput(compAssetData.license.type)")
            | {{ compAssetData.license.type }}

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              | {{ $t.assetMiniature.actions.filterByLicense }}
              br
              b {{ compAssetData.license.type }}


        // Command line
        .commandLine

          // Delete asset

          q-btn(
            v-if="compAssetData.status === 'active'"

            icon="mdi-delete"
            outline
            class="q-ml-sm"
            color="primary"

            @click='deleteCheck')

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              b {{ $t.assetMiniature.actions.deleteAsset }}

          // Delete backup of asset
          q-btn(
            v-if="compAssetData.status === 'backup'"

            icon="delete_forever"
            outline
            class="q-ml-sm"
            color="primary"

            @click='backupDeleteCheck')

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              b {{$t.assetMiniature.actions.deleteAssetBackup}}

          // Restore asset
          q-btn(
            v-if="compAssetData.status === 'backup'"

            icon="unarchive"
            outline
            class="q-ml-sm"
            color="primary"

            @click='backupRestore')

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              b {{$t.assetMiniature.actions.restoreAssetBackup}}

          // Backup asset
          q-btn(
            v-if="compAssetData.status === 'active'"

            icon="archive"
            outline
            class="q-ml-sm"
            color="primary"

            @click='backupCheck')

            q-tooltip(
              :delay="300"
              anchor="top middle"
              self="bottom middle"
              transition-show="jump-up"
              transition-hide="jump-down")

              b {{$t.assetMiniature.actions.backupAsset}}

      // Extended info
      transition(
        enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutUp")

        .AssetMiniature__content__extendedInfoWrapper(
          v-show='((compAssetData.tags.length > 0 && compAssetData.tags) || compAssetData.description) && showExtraInfo'
          )

          .tags(v-if='compAssetData.tags.length > 0 && compAssetData.tags')

            .label
              | {{ $t.assetMiniature.titles.tags }}

            .content(
              :disabled='storeGetTaskList.length !== 0'
              v-for='tag in compAssetData.tags'
              :key='tag'
              @click="triggerQuickSearchInput(tag)")
              | {{ tag }}

              q-tooltip(
                :delay="300"
                anchor="top middle"
                self="bottom middle"
                transition-show="jump-up"
                transition-hide="jump-down")

                | {{ $t.assetMiniature.actions.filterByTag }}
                br
                b {{ tag }}

          .description(v-if='compAssetData.description')

            .label
              | {{ $t.assetMiniature.titles.description }}

            .content(v-html='compAssetData.description')

</template>

<script lang="ts">

/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


//Libs
import {extend as qExtend} from "quasar"
import fs from "fs-extra"
import {remote, ipcRenderer} from "electron"
// @ts-ignore
// noinspection TypeScriptCheckImport
import getSize from "du"

// Interfaces
import interfaceMKPaths from "@/scripts/interfaces/_interfaceMKPaths"
import assetObjectInterface from "@/scripts/interfaces/_interfaceAssetObject"
import interfaceAssetProcessed from "@/scripts/interfaces/_interfaceAssetProcessed"
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"
import overlayActionsInterface from "@/scripts/interfaces/_interfaceOverlayActions"
import assetFilterContentInterface from "@/scripts/interfaces/_interfaceAsseFilterContent"

// Import file managers
import BackupManagerMK from "@/scripts/fileManagers/backupManagerMK"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, Watch } from "vue-property-decorator"
import { Getter,Action} from "vuex-class"

// Import placeholder images
//@ts-ignore
import placeholderImage from "../../assets/images/placeholderSymbol.png"

//Components
import DragonSpinner from "@/pageparts/components/DragonSpinner.vue"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component({
  components: {
    DragonSpinner
  }
})
export default class AssetMiniature extends BaseClass {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */


  /**
   * A string with a placeholder that gets updated every 10 seconds and once on load of the miniature
   * This is in place, because the file size loader is async and we cant pause a whole app to scan each miniature if 1000 of them are in place
   */
  folderSize: string = ""

  /**
   * The actual timer for checking folder size that ticks every 10 seconds
   */
  intervalFolderSize = setInterval(() => {
    this.readFolderSize()
  }, 10000)

  /**
   * Component-wide variable used to store the pathing to the meta files of the asset miniature.
   * Exists mostly, because of convenience reasons
   */
  metaFilesPath: string = ""

  /**
   * Local copy of the filter data extracted from this asset
   */
  filterData = {} as assetFilterContentInterface

  /**
   * Determines if this asset passed through the filters and is therefore shown
   */
  passedFilters: boolean = true


  /* ------------------------------ */
  /* -----------PROPS------------- */
  /* ------------------------------ */


  /**
   * Reactive property if the "extra info" slideout is showing or not
   * Set in the upper bar via switch
   *
   */
  @Prop() readonly showExtraInfo!: boolean

  /**
   * Trigger sent by the parent if the "Backup all assets" gets clicked and approved
   * Set in the upper bar via switch
   *
   */
  @Prop() readonly triggerBackup!: boolean

  /**
   * Current profile MK path object provided via current module wrapper
   */
  @Prop() readonly mkPaths!: interfaceMKPaths

  /**
   * All asset data passed from the scan done at the parent
   */
  @Prop() readonly assetData!: assetObjectInterface

  /**
   * Currently active filters
   */
  @Prop() readonly activeFilterContent!: assetFilterContentInterface


  /* ------------------------------- */
  /* ------------WATCH-------------- */
  /* ------------------------------- */


  /**
   * Reacts to parent calls to trigger backup of this asset
   */
  @Watch("triggerBackup")
  watchTriggerBackup(value: boolean){
    if (value && this.assetData.status === "active") {
      this.backupCreate()
    }
  }

  /**
   * React to changes in the filter list from the parent
   */
  @Watch("activeFilterContent",{ deep: true })
  watchActiveFilterContent(activeFilters: assetFilterContentInterface){

    // Set the booleans
    const filterValues: any = {
      authors: false,
      status: false,
      tags: false,
      commercialUses: false,
      licenses: false
    }

    // Fields we want to specifically loop through
    const filterLoop: string[] = [
      "authors",
      "status",
      "tags",
      "commercialUses",
      "licenses"
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
          this.filterData[filterFieldName].forEach((single)=>{

            const needle = localQuickSearch.value.toLowerCase()
            const haystack = single.toLowerCase()

            // Quick search needs just one single field to match in order to show the whole asset
            if(haystack.includes(needle)){
              filterValues.authors = true
              filterValues.status = true
              filterValues.tags = true
              filterValues.commercialUses = true
              filterValues.licenses = true
            }
          })

          // Each asset has only one name so compare against it
          if (this.filterData.names[0].includes(localQuickSearch.value.toLowerCase())) {
            filterValues.authors = true
            filterValues.status = true
            filterValues.tags = true
            filterValues.commercialUses = true
            filterValues.licenses = true
          }

        }

        // Check if nothing slipped through the cracks via 3rd party
        else if (activeFilters[filterFieldName]
            && activeFilters[filterFieldName].length > 0
        ) {

          this.filterData[filterFieldName].forEach((single)=>{
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
      filterValues.authors = true
      filterValues.status = true
      filterValues.tags = true
      filterValues.commercialUses = true
      filterValues.licenses = true
    }

    // Compare all booleans to determine if to show the asset
    if (filterValues.authors
        && filterValues.status
        && filterValues.tags
        && filterValues.commercialUses
        && filterValues.licenses
    ) {
      this.passedFilters = true
    }
    else{
      this.passedFilters = false
    }


  }

  /**
   * React to changes to computed asset dada and sends them back to the parent so they can get added to the filer list
   */
  @Watch("compAssetData")
  watchCompAssetData(computedData: any){

    const updateData:assetFilterContentInterface = {
      status: [],
      names: [],
      authors: [],
      licenses: [],
      commercialUses: [],
      tags: []
    }

    // Add "Active" or "Backup" status
    const statusString = this.assetData.status.charAt(0).toUpperCase() + this.assetData.status.slice(1)
    updateData.status.push(statusString)

    // Add "Has config" or "No config" status
    if (this.assetData.mkSettings) {
      updateData.status.push(this.$t.globals.statusStatuses.hasConfig)
    }
    else{
      updateData.status.push(this.$t.globals.statusStatuses.noConfig)
    }

    // Add name
    updateData.names.push(computedData.title)

    // Add author and distributor
    if (computedData.author) {
      updateData.authors.push(computedData.author.name)
    }
    if (computedData.distributor) {
      updateData.authors.push(computedData.distributor.name)
    }

    // Add commercial use
    updateData.commercialUses.push(computedData.commercialUse)

    // Add license
    if (computedData.license) {
      updateData.licenses.push(computedData.license.type)
    }

    // Add tags
    if (computedData.tags) {
      computedData.tags.forEach(tag => updateData.tags.push(tag))
    }

    // Update the local data with the currently active filter data for this asset
    this.filterData = updateData

    // Trigger the update emitter
    this.$emit("trigger-update-filter",updateData)
  }


  /* ------------------------------- */
  /* -----------COMPUTED----------- */
  /* ------------------------------- */


  /**
   * Determines if the component is locked or not
   * @returns {boolean} Return "true" or "false"
   */
  get isLocked(){
    const lockExists = this.storeGetComponentLocks.find((singleLockPath)=>{
      return singleLockPath === this.assetData.folderPath
    })

    // If we found the lock, lock the file, otherwise unlock it
    return lockExists !== undefined
  }

  /**
   * Re-computes all the input asset data from the original input
   * @see metaFilesPath metaFilesPath - This variable gets modified by this function, since we can't load prop data directly into it
   * @see assetData assetData - The source data for this function
   * @returns compAssetData Properly computed data the miniature uses
   */
  get compAssetData(): interfaceAssetProcessed{

    // Set necessary variables
    this.metaFilesPath = this.assetData.folderPath+"\\metafiles"
    const sourceData:assetObjectInterface = this.assetData

    // Set the base, dummy data
    const compData: any = {
      title: sourceData.folderName,
      imagePreview: placeholderImage,
      gallery: [],
      folderSize: this.folderSize,
      status: sourceData.status,
      version: false,
      commercialUseExtraClass: "",
      localLicensePath: "",
      localCommentaryPath: "",
      externalLicenseUrl: "",
      description: false,
      downloadURL: false,
      tags: false,
      license: false,
      author: false,
      distributor: false,
      vendors: false
    }

    // Process the raw JSON full of holes...
    const processRawData = () => {
      const processPreviewImage = () => {

        if (fs.existsSync(this.metaFilesPath+"\\preview.jpg")){
          compData.imagePreview = this.metaFilesPath+"\\preview.jpg"
          compData.gallery.push(this.metaFilesPath+"\\preview.jpg")
        }

        if (fs.existsSync(this.metaFilesPath+"\\preview.png")){
          compData.imagePreview = this.metaFilesPath+"\\preview.png"
          compData.gallery.push(this.metaFilesPath+"\\preview.png")
        }

      }
      const processGallery = () =>{
        let galleryImages: boolean|string[] = fs.readdirSync(this.metaFilesPath+"\\gallery")
        galleryImages.forEach((singleImage:string)=>{
          compData.gallery.push(this.metaFilesPath+"\\gallery\\"+singleImage)
        })
        if(galleryImages.length === 0) {compData.gallery = false}
      }
      const processBaseData = () =>{
        // Only if we have a value
        if (
          sourceData.mkSettings !== undefined
            &&
            sourceData.mkSettings.basicInformation !== undefined
        ){

          // Set Name of the asset
          if (sourceData.mkSettings.basicInformation.name !== undefined)
          {compData.title = sourceData.mkSettings.basicInformation.name}
          else
          {compData.title = sourceData.folderName}

          // Set Version of the asset
          if (sourceData.mkSettings.basicInformation.version !== undefined)
          {compData.version = sourceData.mkSettings.basicInformation.version}
          else
          {compData.version = false}

          // Set Description of the asset
          if (sourceData.mkSettings.basicInformation.description !== undefined)
          {compData.description = sourceData.mkSettings.basicInformation.description}
          else
          {compData.description = false}

          // Set Download URL of the asset
          if (sourceData.mkSettings.basicInformation.downloadURL !== undefined)
          {compData.downloadURL = sourceData.mkSettings.basicInformation.downloadURL}
          else
          {compData.downloadURL = false}

          // Set Tags of the asset
          if (sourceData.mkSettings.basicInformation.tags !== undefined)
          {compData.tags = sourceData.mkSettings.basicInformation.tags}
          else
          {compData.tags = false}

          // Set Commercial use of the asset
          if (sourceData.mkSettings.basicInformation.commercialUse !== undefined)
          {compData.commercialUse = sourceData.mkSettings.basicInformation.commercialUse}
          else
          {compData.commercialUse = false}

          // Set Commercial URL of the asset
          if (sourceData.mkSettings.basicInformation.commercialURL !== undefined)
          {compData.commercialURL = sourceData.mkSettings.basicInformation.commercialURL}
          else
          {compData.commercialURL = false}
        }
      }
      const processLicenseData = () =>{
        if (
          sourceData.mkSettings !== undefined
            &&
            sourceData.mkSettings.basicInformation !== undefined
            &&
            sourceData.mkSettings.basicInformation.license !== undefined
        ){

          // Set base object for License
          compData.license = {}

          // Set Has License of the asset
          if (sourceData.mkSettings.basicInformation.license.hasLicense !== undefined)
          {compData.license.hasLicense = sourceData.mkSettings.basicInformation.license.hasLicense}
          else
          {compData.license.hasLicense = false}

          // Set License Type of the asset
          if (sourceData.mkSettings.basicInformation.license.type !== undefined)
          {compData.license.type = sourceData.mkSettings.basicInformation.license.type}
          else
          {compData.license.type = false}

          // Set License Local file of the asset
          if (sourceData.mkSettings.basicInformation.license.localFile !== undefined)
          {compData.license.localFile = sourceData.mkSettings.basicInformation.license.localFile}
          else
          {compData.license.localFile = false}

          // Set License External Link of the asset
          if (sourceData.mkSettings.basicInformation.license.externalLink !== undefined)
          {compData.license.externalLink = sourceData.mkSettings.basicInformation.license.externalLink}
          else
          {compData.license.externalLink = false}

          // Set License Commentary of the asset
          if (sourceData.mkSettings.basicInformation.license.commentary !== undefined)
          {compData.license.commentary = sourceData.mkSettings.basicInformation.license.commentary}
          else
          {compData.license.commentary = false}

        }
      }
      const processAuthorData = () =>{
        if (
          sourceData.mkSettings !== undefined
            &&
            sourceData.mkSettings.basicInformation !== undefined
            &&
            sourceData.mkSettings.basicInformation.author !== undefined
        ){

          // Set base object for Author
          compData.author = {}

          // Set Exist Author of the asset
          if (sourceData.mkSettings.basicInformation.author.exists !== undefined)
          {compData.author.exists = sourceData.mkSettings.basicInformation.author.exists}
          else
          {compData.author.exists = false}

          // Set Name Author of the asset
          if (sourceData.mkSettings.basicInformation.author.name !== undefined)
          {compData.author.name = sourceData.mkSettings.basicInformation.author.name}
          else
          {compData.author.name = false}

          // Set Mail Author of the asset
          if (sourceData.mkSettings.basicInformation.author.mail !== undefined)
          {compData.author.mail = sourceData.mkSettings.basicInformation.author.mail}
          else
          {compData.author.mail = false}

          // Set URL Author of the asset
          if (sourceData.mkSettings.basicInformation.author.url !== undefined)
          {compData.author.url = sourceData.mkSettings.basicInformation.author.url}
          else
          {compData.author.url = false}

          // Set Donation URL Author of the asset
          if (sourceData.mkSettings.basicInformation.author.donationURL !== undefined)
          {compData.author.donationURL = sourceData.mkSettings.basicInformation.author.donationURL}
          else
          {compData.author.donationURL = false}

        }
      }
      const processDistributorData = () =>{
        if (
          sourceData.mkSettings !== undefined
            &&
            sourceData.mkSettings.basicInformation !== undefined
            &&
            sourceData.mkSettings.basicInformation.distributor !== undefined
        ){

          // Set base object for Distributor
          compData.distributor = {}

          // Set Exist Distributor of the asset
          if (sourceData.mkSettings.basicInformation.distributor.exists !== undefined)
          {compData.distributor.exists = sourceData.mkSettings.basicInformation.distributor.exists}
          else
          {compData.distributor.exists = false}

          // Set Name Distributor of the asset
          if (sourceData.mkSettings.basicInformation.distributor.name !== undefined)
          {compData.distributor.name = sourceData.mkSettings.basicInformation.distributor.name}
          else
          {compData.distributor.name = false}

          // Set Mail Distributor of the asset
          if (sourceData.mkSettings.basicInformation.distributor.mail !== undefined)
          {compData.distributor.mail = sourceData.mkSettings.basicInformation.distributor.mail}
          else
          {compData.distributor.mail = false}

          // Set URL Distributor of the asset
          if (sourceData.mkSettings.basicInformation.distributor.url !== undefined)
          {compData.distributor.url = sourceData.mkSettings.basicInformation.distributor.url}
          else
          {compData.distributor.url = false}

          // Set Donation URL Distributor of the asset
          if (sourceData.mkSettings.basicInformation.distributor.donationURL !== undefined)
          {compData.distributor.donationURL = sourceData.mkSettings.basicInformation.distributor.donationURL}
          else
          {compData.distributor.donationURL = false}

        }
      }

      if (fs.existsSync(this.metaFilesPath)) {
        processPreviewImage()

        if (fs.existsSync(this.metaFilesPath+"\\gallery"))
        {processGallery()}
      }
      processBaseData()
      processLicenseData()
      processAuthorData()
      processDistributorData()
    }
    processRawData()

    // Format the processed data into something a bit more humanly readable
    const formatData = () => {

      if (compData.commercialUse === undefined){
        compData.commercialUse = this.$t.globals.licenseStatuses.notSpecified
        compData.commercialUseExtraClass = "impNeutral"
      }
      else if(compData.commercialUse){
        compData.commercialUse = this.$t.globals.licenseStatuses.allowed
        compData.commercialUseExtraClass = "impGood"
      }
      else{
        compData.commercialUse = this.$t.globals.licenseStatuses.notAllowed
        compData.commercialUseExtraClass = "impBad"
      }

      if (compData.license.localFile){
        if (fs.existsSync(this.metaFilesPath+"\\license.pdf"))
        {compData.localLicensePath = this.metaFilesPath+"\\license.pdf"}

        if (fs.existsSync(this.metaFilesPath+"\\license.txt"))
        {compData.localLicensePath = this.metaFilesPath+"\\license.txt"}

        if (fs.existsSync(this.metaFilesPath+"\\license.docx"))
        {compData.localLicensePath = this.metaFilesPath+"\\license.docx"}
      }

      if (compData.license.externalLink){
        switch(compData.license.type) {
          case "CC BY 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by/4.0/"
            break

          case "CC BY-SA 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/"
            break

          case "CC BY-ND 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by-nd/4.0/"
            break

          case "CC BY-NC 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by-nc/4.0/"
            break

          case "CC BY-NC-SA 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
            break

          case "CC BY-NC-ND 4.0":
            compData.externalLicenseUrl = "https://creativecommons.org/licenses/by-nc-nd/4.0/"
            break

          default:
            compData.externalLicenseUrl = `https://www.google.com/search?q=${compData.license.type}`
        }
      }

      if (compData.license.commentary){
        if (fs.existsSync(this.metaFilesPath+"\\commentary.pdf"))
        {compData.localCommentaryPath = this.metaFilesPath+"\\commentary.pdf"}

        if (fs.existsSync(this.metaFilesPath+"\\commentary.txt"))
        {compData.localCommentaryPath = this.metaFilesPath+"\\commentary.txt"}

        if (fs.existsSync(this.metaFilesPath+"\\commentary.docx"))
        {compData.localCommentaryPath = this.metaFilesPath+"\\commentary.docx"}
      }

    }
    formatData()

    // Return formatted data
    return compData
  }


  /* ------------------------------ */
  /* ------------VUEX-------------- */
  /* ------------------------------ */


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


  /* ----------------------------------- */
  /* ------------VUE NATIVE------------ */
  /* ----------------------------------- */


  /**
   * Vue native Mounted lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  mounted() {

    // Set placeholder text
    this.folderSize = this.$t.assetMiniature.placeholders.folderSize

    // Scan asset size once on load
    setTimeout(()=>{
      this.readFolderSize()
    },1000)
  }

  /**
   * Vue native Before Destroy lifecycle function
   * {@link https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram More about Vue lifecycle}
   */
  beforeDestroy() {
    // Clear the size scanning interval, no need to hog up memory needlessly
    clearInterval(this.intervalFolderSize)
  }


  /* ----------------------------------------- */
  /* ------------METHODS: UTILITY------------ */
  /* ----------------------------------------- */


  /**
   * Read the folder size of the current asset
   * * @see folderSize folderSize - The result gets saves in this variable
   */
  readFolderSize() {
    getSize(this.assetData.folderPath, (err: string, size: any) => {
      if (!err)
      {this.folderSize = (size / 1024 / 1024).toFixed(1) + " MB"}
    })
  }

  /**
   * Open the gallery inside an overlay using an emitting "triggerGallery" to the parent
   */
  triggerGallery(){
    if (this.compAssetData.gallery["length"] > 0){
      this.$emit("trigger-gallery",this.compAssetData.gallery)
    }
  }

  /**
   * Triggers the parent to remove this miniature from the list
   */
  triggerRemoveFromList(){
    this.$emit("trigger-remove-from-list",this.assetData.folderPath)
  }

  /**
   * Triggers an update of filter list on the parent
   */
  triggerQuickSearchInput(filterValue: string){
    this.$emit("trigger-quick-search-input", filterValue)
  }


  /**
   * Updates the current asset status into backup and sets the path
   */
  updateIntoBackup(){
    const updateData = {
      status: "backup",
      oldPath: this.assetData.folderPath,
      folderPath: `${this.mkPaths.mkBackupAssets}\\${this.assetData.folderName}`,
      configPath: `${this.mkPaths.mkBackupAssets}\\${this.assetData.folderName}\\mythKeeperSettings.json`
    }

    this.$emit("trigger-update-asset-data", updateData)
  }

  /**
   * Updates the current asset status into active and sets the path
   */
  updateIntoActive(){

    const updateData = {
      status: "active",
      oldPath: this.assetData.folderPath,
      folderPath: `${this.mkPaths.wdAssets}\\${this.assetData.folderName}`,
      configPath: `${this.mkPaths.wdAssets}\\${this.assetData.folderName}\\mythKeeperSettings.json`
    }

    this.$emit("trigger-update-asset-data", updateData)
  }


  /* ---------------------------------------- */
  /* ------------METHODS: DELETE------------ */
  /* ---------------------------------------- */


  /**
   * Check if the asset is backed up.
   * If yes, just delete it.
   * If not, pop a dialog and ask what to do.
   * Doesnt file if Expert mode is allowed
   */
  deleteCheck(){

    const backupExists:boolean = BackupManagerMK.checkBackupSingle(this.assetData.folderName, this.mkPaths)

    //Trigger popup if expert mode is allowed, otherwise just delete
    if (!backupExists && !this.storeGetIsExpertModeAllowed){
      this.deleteDialog()
    }

    // If backup exists or expert mode is on, then just delete current version and don't popup an overlay
    else{
      this.deleteAsset()
    }
  }

  /**
   * Open a dialog unless a backup exists AND Expert mode is disabled
   * Otherwise just deletes the asset and swaps it to backup mode
   */
  deleteDialog(){

    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: this.$t.assetMiniature.overlayTexts.deleteAsset.title,
      contents: this.$t.assetMiniature.overlayTexts.deleteAsset.contents,
      actions: [
        {
          title: this.$t.assetMiniature.overlayTexts.deleteAsset.actions.close,
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: this.$t.assetMiniature.overlayTexts.deleteAsset.actions.backupAndDelete,
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param: {
            functionName: "deleteAssetAndBackup",
            data: {}
          }
        },
        {
          title: this.$t.assetMiniature.overlayTexts.deleteAsset.actions.delete,
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param: {
            functionName: "deleteAsset",
            data: {}
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)

  }

  /**
   * Creates a backup and then deletes an asset
   * @see deleteAsset
   * @see backupCreate
   */
  async deleteAssetAndBackup(){
    await this.backupCreate(true)
    this.deleteAsset()
  }

  /**
   * Deletes and asset
   * Runs a in a work window via background.js
   * @param suppressAWN {boolean} Determines if the notification is shown at the end of the process.
   */
  async deleteAsset(suppressAWN: boolean = false){

    await new Promise((resolve) => {
      // Lock asset
      this.storeAddComponentLock(this.assetData.folderPath)

      // Set new task for the store and also set it locally for updates and removal later
      const newTask = this.commitNewTask(this.$t.assetMiniature.taskTexts.deleteAsset, this.compAssetData.title)

      // Prepare command
      const command : interfaceBackgroundRenderWork = {
        command: "deleteAsset-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          folderName: this.assetData.folderName,
          mkPaths: this.mkPaths,
          safeDelete: this.storeGetIsSafeDeleteAllowed
        }
      }

      // Send to command to the backend
      ipcRenderer.send("asynchronous-message", command)

      // Set timer for reporting
      const reportTimer = setInterval(() => {
        const workList = remote.getCurrentWindow()["workList"]

        let taskIndex: number = -1

        workList.forEach((singleTask: interfaceBackgroundRenderWork, index)=> {
          if (singleTask.taskID === command.taskID) {taskIndex = index}
        })

        if (taskIndex !== -1) {
          this.updateTask(newTask, workList[taskIndex].progress)
        } else {

          // Cleanup and removal of the task from the tasklist
          clearInterval(reportTimer)
          this.updateTask(newTask, 100)
          this.removeTask(newTask)

          // Unlock asset
          this.storeRemoveComponentLock(this.assetData.folderPath)

          if (!suppressAWN) {
            //@ts-ignore
            this.$awn.success(this.$t.assetMiniature.awn.success.assetDelete(this.compAssetData.title))
          }
          resolve()
        }
      }, 1000)
    })

    const backupExists:boolean = BackupManagerMK.checkBackupSingle(this.assetData.folderName, this.mkPaths)

    // If the backup exists after deletion, switch the status to backup
    if (backupExists) {
      this.updateIntoBackup()
    }
    // Otherwise remove asset from the list
    else {
      this.triggerRemoveFromList()
    }

  }


  /* ---------------------------------------- */
  /* ------------METHODS: BACKUP------------ */
  /* ---------------------------------------- */


  /**
   * Checks if the backup version of the asset exists
   */
  backupCheck(){
    const backupExists:boolean = BackupManagerMK.checkBackupSingle(this.assetData.folderName, this.mkPaths)

    // Trigger popup if expert mode is allowed
    if (backupExists && !this.storeGetIsExpertModeAllowed){
      this.backupDialog()
    }
    // Otherwise just overwrite
    else{
      this.backupCreate()
    }
  }

  /**
   * Checks if the expert mode is allowed
   */
  backupDeleteCheck(){

    // Trigger popup if expert mode is NOT allowed
    if (!this.storeGetIsExpertModeAllowed){
      this.backupDeleteDialog()
    }
    // Otherwise just delete
    else{
      this.backupDelete()
    }
  }

  /**
   * Open a dialog if the backup already exists AND Expert mode is disabled
   * Otherwise flat out override the backup or makes a new one
   */
  backupDialog(){

    // Set current version data if they exist
    const currentVersion = (this.compAssetData.version)
      ? this.compAssetData.version
      : this.$t.assetMiniature.placeholders.assetVersion

    // Set placeholder
    let backupVersion = this.$t.assetMiniature.placeholders.assetVersion

    // Set backup version path
    const backUpVersionPath = `${this.mkPaths.mkBackupAssets}\\${this.assetData.folderName}\\mythKeeperSettings.json`

    // Check if backup version data exist or not
    if(fs.existsSync(backUpVersionPath)){

      try {
        //@ts-ignore
        const backupSettings = JSON.parse(fs.readFileSync(backUpVersionPath))

        if(backupSettings.basicInformation !== undefined && backupSettings.basicInformation.version !== undefined){
          backupVersion = backupSettings.basicInformation.version
        }
      }
      catch(err) {}
    }

    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: this.$t.assetMiniature.overlayTexts.backupAsset.title +this.compAssetData.title,
      contents: this.$t.assetMiniature.overlayTexts.backupAsset.contents(currentVersion,backupVersion) ,
      actions: [
        {
          title: this.$t.assetMiniature.overlayTexts.backupAsset.actions.close,
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: this.$t.assetMiniature.overlayTexts.backupAsset.actions.overwrite,
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param:  {
            functionName: "backupCreate",
            data: {}
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)
  }

  /**
   * Open a dialog if the Expert mode is disabled
   * Otherwise flat out deletes the file
   */
  backupDeleteDialog(){

    // Overlay dialog contents
    const overlayContents: overlayActionsInterface = {
      componentID: this.getComponentID(),
      title: this.$t.assetMiniature.overlayTexts.deleteBackupAsset.title+this.compAssetData.title,
      contents:this.$t.assetMiniature.overlayTexts.deleteBackupAsset.contents,
      actions: [
        {
          title: this.$t.assetMiniature.overlayTexts.deleteBackupAsset.actions.close,
          classes: "q-btn--outline -noBG",
          action: "closeModal"
        },
        {
          title: this.$t.assetMiniature.overlayTexts.deleteBackupAsset.actions.deleteBackup,
          classes: "",
          action: "storeSetOverLayTriggerAction",
          param:  {
            functionName: "backupDelete",
            data: {}
          }
        }
      ]
    }

    // Trigger dialog
    this.triggerChoiceDialog(overlayContents)
  }

  /**
   * Delete the current backup
   */
  async backupDelete(suppressAWN: boolean = false){
    await new Promise((resolve) => {
      // Lock asset
      this.storeAddComponentLock(this.assetData.folderPath)

      // Set new task for the store and also set it locally for updates and removal later
      const newTask = this.commitNewTask(this.$t.assetMiniature.taskTexts.deleteBackupAsset, this.compAssetData.title)

      const command : interfaceBackgroundRenderWork = {
        command: "deleteBackupAsset-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          folderName: this.assetData.folderName,
          mkPaths: this.mkPaths,
          safeDelete: this.storeGetIsSafeDeleteAllowed
        }
      }

      ipcRenderer.send("asynchronous-message", command)

      // Set timer for reporting
      const reportTimer = setInterval(() => {
        const workList = remote.getCurrentWindow()["workList"]

        let taskIndex: number = -1

        workList.forEach((singleTask: interfaceBackgroundRenderWork, index)=> {
          if (singleTask.taskID === command.taskID) {taskIndex = index}
        })

        if (taskIndex !== -1) {

          this.updateTask(newTask, workList[taskIndex].progress)

        } else {

          // Cleanup and removal of the task from the tasklist
          clearInterval(reportTimer)
          this.updateTask(newTask, 100)
          this.removeTask(newTask)

          // Unlock asset
          this.storeRemoveComponentLock(this.assetData.folderPath)

          if (!suppressAWN) {
            //@ts-ignore
            this.$awn.success(this.$t.assetMiniature.awn.success.assetDeleteBackup(this.compAssetData.title))
          }
          resolve()
        }

      }, 1000)
    })
    this.triggerRemoveFromList()
  }

  /**
   * Restores the current backup
   */
  async backupRestore(suppressAWN: boolean = false){

    await new Promise((resolve) => {
      // Lock asset
      this.storeAddComponentLock(this.assetData.folderPath)

      // Set new task for the store and also set it locally for updates and removal later
      const newTask = this.commitNewTask(this.$t.assetMiniature.taskTexts.restoreBackupAsset, this.compAssetData.title)

      const command: interfaceBackgroundRenderWork = {
        command: "restoreBackupAsset-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          folderName: this.assetData.folderName,
          mkPaths: this.mkPaths
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

          // Unlock asset
          this.storeRemoveComponentLock(this.assetData.folderPath)

          if (suppressAWN !== true) {
            //@ts-ignore
            this.$awn.success(this.$t.assetMiniature.awn.success.assetRecover(this.compAssetData.title))
          }

          resolve()

        }

      }, 1000)
    })

    // Update asset data to active after it is restored
    this.updateIntoActive()

  }

  /**
   * Create a backup
   * Runs a in a work window via background.js
   * @param suppressAWN {boolean} Determines if the notification is shown at the end of the process.
   */
  async backupCreate(suppressAWN: boolean = false){
    await new Promise((resolve) => {
      // Lock asset
      this.storeAddComponentLock(this.assetData.folderPath)

      // Set new task for the store and also set it locally for updates and removal later
      const newTask = this.commitNewTask(this.$t.assetMiniature.taskTexts.backupAsset, this.compAssetData.title)


      const command: interfaceBackgroundRenderWork = {
        command: "backupAsset-work",
        status: "active",
        progress: 0,
        taskID: newTask.uniqueTaskID,
        data: {
          folderName: this.assetData.folderName,
          mkPaths: this.mkPaths
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

          // Unlock asset
          this.storeRemoveComponentLock(this.assetData.folderPath)

          if (!suppressAWN) {
            //@ts-ignore
            this.$awn.success(this.$t.assetMiniature.awn.success.assetBackup(this.compAssetData.title))
          }
          resolve()
        }
      }, 1000)
    })
  }

}

</script>

<style scoped lang="sass">
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

        &:before
          content: ""
          +M_AbsoluteFullCover
          transition: box-shadow 0.3s $transition-DefaultType

        &:hover
          &:before
            box-shadow: inset 0 0 3px 5px rgba($themeCol-text,0.7)

      &__fileDetails
        font-family: "Friz Quadrata", sans-serif
        position: absolute
        left: 5px
        bottom: 5px
        background-color: rgba($themeCol-ElementBackground, 0.6)
        border-radius: 4px
        padding: 1px 8px
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
      .tags
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

    &__basicInfoWrapper
      box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
      width: calc(100% - 250px)
      height: 250px
      border-radius: 0 4px 4px 0
      z-index: 1

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

      .description
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

</style>

