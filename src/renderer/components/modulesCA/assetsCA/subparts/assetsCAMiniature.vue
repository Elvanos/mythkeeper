<template>
    <div class="assetsCAMiniature" :class="{incompatible: isMKCompatible}">

        <div class="topLine" :class="{incompatible: isMKCompatible}">
            <div class="title" v-tooltip.top-start="assetData.title">
                {{assetData.title}}
            </div>

            <div class="author" v-on:click="emitSearchChange(assetData.username)"
                 v-tooltip.top-start="`Search for: ${assetData.username}`">

                <div class="name">
                    {{assetData.username}}
                </div>
                <div class="icon">

                    <slot v-if="assetData.User.avatar_urls.s !== null">
                        <img :src="assetData.User.avatar_urls.s">
                    </slot>

                    <slot v-if="assetData.User.avatar_urls.s === null">
                        <div class="backupAvatar" :style="`background-color:${authorBackupColor}`">
                            {{authorBackupAvatar}}
                        </div>
                    </slot>

                </div>

            </div>

        </div>

        <div class="imageLine">
            <div class="previewImage">

                <slot v-if="assetData.icon_url !== null">
                    <img :src="assetData.icon_url" v-tooltip.top-start="`${assetData.title} preview`">
                </slot>

                <slot v-if="assetData.icon_url === null">
                    <img class="placeholder" src="~@/assets/images/icons/placeholderSymbol.png"
                         v-tooltip.top-start="`No preview`">
                </slot>

            </div>

            <div class="detailsSection">

                <div class="extraInfo">

                    <div class="category" v-on:click="emitSearchChange(assetData.Category.title)"
                         v-tooltip.top-start="`Search for: ${assetData.Category.title}`">
                        {{assetData.Category.title}}
                    </div>

                    <div class="prefix" :style="`background-color:${assetPrefixColor}`"
                         v-on:click="emitSearchChange(assetData.prefix)"
                         v-tooltip.top-start="`Search for:  ${assetData.prefix}`">
                        {{assetData.prefix}}
                    </div>


                </div>

                <div class="communityInfo">
                    <div class="rating" :class="{incompatible: isMKCompatible}" v-tooltip.top-start="`Average rating: ${assetData.rating_avg}/5`">
                        <div class="stars">
                            <div class="overlay" :style="`width: ${ratingWidth};`"></div>
                        </div>

                        <div class="reviews">
                            {{assetData.rating_count}} {{grammarRatingsMultiple}}
                        </div>
                    </div>
                    <div class="downloads" :class="{incompatible: isMKCompatible}">
                        <div class="amount">
                            {{assetData.download_count}}
                        </div>
                        <div class="subtitle">
                            downloads
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="textContent">
            <div class="description">
                <div class="title">Description:</div>
                <div class="content">{{assetData.tag_line}}</div>
            </div>
            <div class="tags">
                <div class="title">Tags:</div>
                <div class="content">
                    <div v-if="assetData.tags.length > 0" class="tag" v-for="tag in assetData.tags" :key="tag"
                         v-tooltip.top-start="`Search for: ${tag}`"
                         v-on:click="emitSearchChange(tag)">
                        {{ tag }}
                    </div>
                    <slot v-if="assetData.tags.length === 0">
                        <div class="filler">
                            None
                        </div>
                    </slot>

                </div>
            </div>
        </div>

        <div class="divider" :class="{incompatible: isMKCompatible}"></div>

        <div class="textContent controlRow">
            <div class="dates">
                <div class="lastUpdate">
                    <div class="title">Last update:</div>
                    <div class="content">{{dateFormatLastUpload}}</div>
                </div>
                <div class="firstUpload">
                    <div class="title">First upload:</div>
                    <div class="content">{{dateFormatFirstUpload}}</div>
                </div>
            </div>
            <div class="controlGroup" :class="{incompatible: isMKCompatible}">

                <slot v-if="!isInstalled && !isInstalledBackup && !isMKCompatible">
                    <div class="downloadButton -download" v-on:click="downloadAsset">
                        Download <span class="sprite menu-articles-import"></span>
                    </div>
                </slot>

                <slot v-if="!isInstalled && !isInstalledBackup && isMKCompatible">
                    <div class="downloadButton -download incompatible" v-on:click="downloadIncompatible">
                        Download <span class="sprite menu-articles-import"></span>
                    </div>
                </slot>

                <slot v-if="(isInstalled || isInstalledBackup) && isUpdated === false">
                    <div class="downloadButton -update" v-on:click="downloadAsset">
                        Update <span class="sprite page-multi"></span>
                    </div>
                </slot>

                <slot v-if="(isInstalled || isInstalledBackup) && isUpdated">
                    <div class="downloadButton -installed">
                        Installed <span class="sprite general-check"></span>
                    </div>
                </slot>

                <div class="moreInfo" v-on:click="openCALink"
                     v-tooltip.top-start="`View <b>${assetData.title}</b> on Cartography Assets website`">
                    More information
                </div>

            </div>
        </div>


    </div>

</template>

<script>

   require('vue2-animate/dist/vue2-animate.min.css')
   const cheerio = require('cheerio')
   const moment = require('moment')

   const fs = require('fs-extra')
   const path = require('path')
   const download = require('@jinphen/download2')


   export default {
      name: "assetsCAMiniature",
      components: {},
      props: {
         assetData: Object,
         showInstalled: {
            default: true,
            type: Boolean
         }
      },
      data: function () {
         return {
            isInstalled: false,
            isInstalledBackup: false,
            isUpdated: false
         }
      },
      computed: {
         isMKCompatible(){
            console.log(this.$props.assetData.custom_fields.assetmanager)
            return this.$props.assetData.custom_fields.assetmanager === undefined || this.$props.assetData.custom_fields.assetmanager.yes !== 'yes'

         },
         authorBackupAvatar() {
            return this.$props.assetData.username.slice(0, 1)
         },
         lastInstalledCAAsset() {
            this.retrieveVersion()
            this.checkIfInstalled()
            return this.$store.getters.getRecentlyInstalledCAAsset
         },
         downloadSingleAsset() {
            return this.$store.getters.getMultiFileTempData
         },
         assetPrefixColor() {
            let str = this.$props.assetData.prefix
            return this.convertStringToColor(str)
         },
         authorBackupColor() {
            let str = this.$props.assetData.username
            return this.convertStringToColor(str)
         },
         ratingWidth() {
            const ratingWidth = (this.$props.assetData.rating_avg * 2) * 10
            return ratingWidth + '%'
         },
         dateFormatFirstUpload() {
            return moment(this.$props.assetData.resource_date, 'X').format('D. MMM. YYYY, h:mm a')
         },
         dateFormatLastUpload() {
            return moment(this.$props.assetData.last_update, 'X').format('D. MMM. YYYY, h:mm a')
         },
         grammarRatingsMultiple() {
            if (this.$props.assetData.rating_count === 1) {
               return 'rating'
            } else {
               return 'ratings'
            }

         }
      },
      mounted: function () {
         this.checkIfInstalled()
         this.retrieveVersion()
      },
      watch: {
         showInstalled: function (newVal, oldVal) {
            if (newVal === false && this.isUpdated && (this.isInstalled || this.isInstalledBackup )) {
               this.$emit('hideChild', this.$props.assetData.resource_id, this.isUpdated)
            }
         },
         lastInstalledCAAsset: function (newVal, oldVal) {
         },
         downloadSingleAsset: function (newVal, oldVal) {
            if (newVal.assetID === this.$props.assetData.resource_id) {
               this.downloadAsset(event, newVal.downloadPath)
            }

         },
      },
      methods: {
         downloadIncompatible(){
            this.$dialog
                .confirm('This asset is marked as incompatible with Mythkeeper by their author.<br>Are you certain?',
                    {
                       okText: 'Intall anyway'
                    })
                .then(() => {
                   this.downloadAsset()
                })
                .catch(() => {
                })
         },
         downloadAsset(event, inputUrl) {

            // Set input URL
            let url
            const tempFolder = this.$store.getters.getAssetsFolder + '/tempMKDownload/'
            if (inputUrl === undefined) {
               url = 'https://www.cartographyassets.com/assets/' + this.$props.assetData.resource_id + '/download'
            } else {
               url = inputUrl
            }

            // Run download script
            this.$store.dispatch('disableApp')
                .then(() => {

                   const tempJSON = {
                      vendors: {
                         cartographyassetsID: this.$props.assetData.resource_id,
                         cartographyassetsVersion: this.$props.assetData.last_update
                      },
                      newData: true
                   }

                   if (fs.existsSync(tempFolder)
                   ) {
                      fs.removeSync(tempFolder)
                   }

                   setTimeout(() => {
                      fs.mkdirSync(tempFolder)


                      download(url, tempFolder).then(({data, filename}) => {

                         // If multi-file
                         if (filename === 'download.null') {

                            if (fs.existsSync(tempFolder)
                            ) {
                               fs.removeSync(tempFolder)
                            }

                            const $ = cheerio.load(data)
                            const fileRows = $('.p-body-main .contentRow-main')
                            const filesArray = []

                            fileRows.each((i, elm) => {


                               const rowPair = {
                                  assetID: this.$props.assetData.resource_id,
                                  fileName: $(elm).find('h3').text(),
                                  downloadPath: 'https://www.cartographyassets.com' + $(elm).find('a').attr('href')
                               }

                               if (rowPair.fileName.includes('.zip')) {
                                  filesArray.push(rowPair)
                               }

                            })


                            if (filesArray.length > 1) {
                               this.$store.dispatch('overlayMultifileSetArray', filesArray)
                               this.$store.dispatch('overlayMultifileEnable')
                            } else {
                               this.downloadAsset(null,filesArray[0].downloadPath)
                            }

                         }
                         // if Single file
                         else {
                            this.$store.dispatch('updateAssetTempData', tempJSON).then(() => {
                                   this.$store.dispatch('unpackNewAsset', tempFolder + filename)
                                }
                            )
                         }


                      });

                   }, 250)
                })


         },
         checkIfInstalled() {
            const assetID = this.$props.assetData.resource_id

            let assetListData = this.$store.getters.getListAssetsData

            assetListData = assetListData.filter(singleAssetData =>
                singleAssetData !== false
                &&
                singleAssetData.vendors !== undefined
                &&
                singleAssetData.vendors.cartographyassetsID === assetID
            )

            // If we found an already installed match
            if (assetListData.length > 0) {
               if (assetListData[0].status === 'normal') this.isInstalled = true
               if (assetListData[0].status === 'backup') this.isInstalledBackup = true

            }
         }
         ,
         retrieveVersion() {
            const assetID = this.$props.assetData.resource_id
            const assetVersion = this.$props.assetData.last_update

            let assetListData = this.$store.getters.getListAssetsData

            assetListData = assetListData.filter(singleAssetData =>
                singleAssetData !== false
                &&
                singleAssetData.vendors !== undefined
                &&
                singleAssetData.vendors.cartographyassetsID === assetID
                &&
                singleAssetData.vendors.cartographyassetsVersion === assetVersion
            )
            if (assetListData.length > 0) {
               // If we found the matching version
               this.isUpdated = true
            }
         }
         ,
         emitSearchChange(searchChange) {
            this.$emit('searchChange', searchChange)
         }
         ,
         convertStringToColor(str) {
            let hash = 0
            let colour = '#'

            for (let i = 0; i < str.length; i++) {
               hash = str.charCodeAt(i) + ((hash << 5) - hash)
            }

            for (let i = 0; i < 3; i++) {
               let value = (hash >> (i * 8)) & 0xFF
               colour += ('00' + value.toString(16)).substr(-2)
            }
            return colour
         }
         ,
         openCALink() {
            this.$electron.shell.openExternal('https://www.cartographyassets.com/assets/' + this.$props.assetData.resource_id)
         }
         ,
      }
   }
</script>

<style scoped lang="sass">

    .assetsCAMiniature
        background-color: #151516
        color: white
        margin: 30px 30px 30px 30px
        width: 400px
        border-radius: 2px
        display: flex
        flex-direction: column

        transition: 0.5s all

        &.incompatible
            background-color: #693333

        .divider
            background-color: #000
            height: 20px
            margin-top: auto

            &.incompatible
                background-color: #500b0b

        .topLine
            padding: 5px 10px
            display: flex
            align-items: center
            justify-content: space-between
            background-color: #050807
            position: relative

            &.incompatible
                background-color: #500b0b

            .title
                font-size: 17.5px
                white-space: nowrap
                overflow: hidden
                text-overflow: ellipsis
                flex-grow: 1
                flex-shrink: 0
                width: 80px

            .author
                display: flex
                align-items: center
                margin-left: 20px
                background-color:

                padding: 5px 10px
                background-color: #282829
                border-radius: 5px
                cursor: pointer
                transition: 0.3s $transition-DefaultType background-color

                &:hover
                    background-color: lighten(#363638, 10%)

                *
                    cursor: pointer

                .icon
                    flex-shrink: 0
                    width: 25px
                    height: 25px
                    margin-left: 7.5px

                    img
                        width: 25px
                        height: 25px
                        border-radius: 3px

                    .backupAvatar
                        display: flex
                        justify-content: center
                        align-items: center
                        width: 25px
                        height: 25px
                        border-radius: 3px
                        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000

                .name
                    font-size: 13px
                    cursor: pointer

        .imageLine
            display: flex

            .previewImage
                flex-shrink: 0
                background-image: url('~@/assets/images/backgrounds/assetMiniatureBackground.png')

                height: 96px
                width: 96px

                display: flex
                justify-content: center
                align-items: center
                border-right: 1px solid #262627
                border-top: 1px solid #262627

                img
                    width: 100%

                    &.placeholder
                        padding: 20%
                        width: 80%
                        height: 80%

            .detailsSection
                flex-grow: 1

                .extraInfo
                    display: flex
                    font-size: 12px
                    align-items: center
                    justify-content: flex-end
                    font-weight: 600
                    flex-grow: 1
                    padding: 10px

                    .prefix
                        padding: 5px 5px
                        color: #fff
                        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
                        border-radius: 5px
                        margin-left: 5px
                        cursor: pointer
                        transition: 0.3s $transition-DefaultType opacity
                        opacity: 0.8

                        &:hover
                            opacity: 1

                    .category
                        padding: 5px 5px
                        background-color: #363638
                        border-radius: 5px
                        cursor: pointer
                        transition: 0.3s $transition-DefaultType background-color

                        &:hover
                            background-color: lighten(#363638, 10%)

                .communityInfo
                    display: flex

                    .rating
                        flex-basis: 50%
                        background-color: #000
                        padding: 5px 0 5px
                        display: flex
                        align-items: center
                        justify-content: center
                        flex-direction: column

                        &.incompatible
                            background-color: #500b0b

                        .reviews
                            color: gold
                            font-size: 15px

                        .stars
                            position: relative
                            margin-bottom: 4px

                            -webkit-mask-image: url(~@/assets/images/icons/starRating.png), none
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

                    .downloads
                        display: flex
                        align-items: center
                        justify-content: center
                        flex-direction: column
                        flex-basis: 50%
                        background-color: #000
                        border-left: 1px solid #262627

                        &.incompatible
                            background-color: #500b0b

                        .amount
                            font-size: 20px

                        .subtitle
                            font-size: 15px

        .textContent
            padding: 10px

            .title
                font-weight: 600
                font-size: 15px
                margin-bottom: 5px

            .lastUpdate
                font-size: 14px
                color: #848989

            .firstUpload
                margin-top: 10px
                font-size: 14px
                color: #848989

            .description
                font-size: 14px
                font-weight: 400

            .tags
                margin-top: 10px
                margin-bottom: -5px

                .filler
                    font-size: 14px
                    font-weight: 400

                .tag
                    font-size: 14px
                    display: inline-block
                    padding: 3px 5px
                    background-color: #363638
                    border-radius: 5px
                    cursor: pointer
                    transition: 0.3s $transition-DefaultType background-color
                    margin-right: 5px
                    margin-bottom: 5px

                    &:hover
                        background-color: lighten(#363638, 10%)

        .controlRow
            display: flex
            padding: 0

            .dates
                flex-basis: 50%
                padding: 10px 0 10px 10px

                .title
                    font-size: 13.5px

                .content
                    font-size: 13px

            .controlGroup
                flex-basis: 50%
                display: flex
                flex-direction: column
                justify-content: center
                align-items: center

                background-color: #1e1e20

                padding: 10px 10px 10px 0

                border-left: 1px solid #000

                &.incompatible
                    background-color: #844040

                .moreInfo
                    margin-top: 10px
                    font-size: 13px
                    text-decoration: underline
                    cursor: pointer
                    color: #848989

                .downloadButton
                    font-size: 18px
                    padding: 7.5px 15px
                    border-radius: 5px
                    cursor: pointer
                    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
                    transition: 0.3s $transition-DefaultType background-color
                    margin-bottom: 5px

                    display: flex
                    justify-content: center
                    align-items: baseline

                    span
                        margin-left: 5px
                        filter: drop-shadow(1px 1px 0 #000)
                        cursor: pointer

                    &.-download
                        background-color: #41a018

                        &:hover
                            background-color: lighten(#41a018, 5%)

                        &.incompatible
                            background-color: #ee2100

                            &:hover
                                background-color: lighten(#ee2100, 5%)

                    &.-update
                        background-color: #0086a0

                        span
                            transform: rotate(180deg)
                            filter: drop-shadow(-1px -1px 0 #000)

                        &:hover
                            background-color: lighten(#0086a0, 5%)

                    &.-installed
                        background-color: #3e3e40
                        cursor: default

                        span
                            cursor: default

</style>
