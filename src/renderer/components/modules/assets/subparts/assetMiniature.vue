<template>
    <div class="assetMiniature" :class="{hasSettings: hasSettings}">
        <div class="titleInfo">
            <div class="title" :title="assetName">
                {{assetName}}
            </div>
            <div class="version" :title="`Version: ${assetVersion}`" v-if="assetVersion.length > 0">
                {{configJSON.basicInformation.version}}
            </div>
        </div>
        <div class="content">
            <div class="preview" :title="assetPreviewTitle">
                <img :src="assetPreview">
            </div>
            <div class="textDetails">

                <div class="detailBlock">
                    <div class="contactLine">
                        <div class="miniTitle">
                            <slot v-if="assetAuthorName !== assetDistributorName">
                                Author:
                            </slot>

                            <slot v-if="assetAuthorName === assetDistributorName">
                                Author & distributor:
                            </slot>

                        </div>
                        <div class="contactIcons">

                            <div
                                    v-if="assetAuthorMail"
                                    :title="`Send author an e-mail: ${assetAuthorMail}`"
                                    v-on:click="openURL(assetAuthorMail)"
                                    class="icon sprite footer-mail">

                            </div>

                            <div
                                    v-if="assetAuthorUrl"
                                    :title="`Visit author's website: ${assetAuthorUrl}`"
                                    v-on:click="openURL(assetAuthorUrl)"
                                    class="icon sprite general-file-html">

                            </div>

                            <div
                                    v-if="assetAuthorDonationURL"
                                    :title="`Donate to the author: ${assetAuthorDonationURL}`"
                                    v-on:click="openURL(assetAuthorDonationURL)"
                                    class="icon sprite general-donate">

                            </div>

                        </div>
                    </div>
                    <div class="textLine">
                        {{assetAuthorName}}
                    </div>
                </div>

                <div class="detailBlock" v-if="assetAuthorName !== assetDistributorName">
                    <div class="contactLine">
                        <div class="miniTitle">Distributor:</div>
                        <div class="contactIcons">

                            <div
                                    v-if="assetDistributorMail"
                                    :title="`Send distributor an e-mail: ${assetDistributorMail}`"
                                    v-on:click="openURL(assetDistributorMail)"
                                    class="icon sprite footer-mail">

                            </div>

                            <div
                                    v-if="assetDistributorUrl"
                                    :title="`Visit distributor's website: ${assetDistributorUrl}`"
                                    v-on:click="openURL(assetDistributorUrl)"
                                    class="icon sprite general-file-html">

                            </div>

                            <div
                                    v-if="assetDistributorDonationURL"
                                    :title="`Donate to the distributor: ${assetDistributorDonationURL}`"
                                    v-on:click="openURL(assetDistributorDonationURL)"
                                    class="icon sprite general-donate">

                            </div>

                        </div>
                    </div>
                    <div class="textLine">
                        {{assetDistributorName}}
                    </div>
                </div>

                <div class="detailBlock">
                    <div class="contactLine">
                        <div class="miniTitle">
                            Short description:
                        </div>
                    </div>
                    <div class="textLine -tagline">
                        {{assetTagline}}
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>

<script>

   const fs = require('fs')
   const chokidar = require('chokidar')
   import placeholderSymbol from '../../../../assets/images/icons/placeholderSymbol.png'

   export default {
      name: "assetMiniature",
      props: {
         folder: String

      },
      data: function () {
         return {
            configJSON: {},
            hasSettings: false,
            configFileWatched: false,

            assetName: this.$props.folder,
            assetVersion: '',
            assetPreview: placeholderSymbol,
            assetPreviewTitle: 'No preview',

            assetAuthorName: 'N/A',
            assetAuthorMail: false,
            assetAuthorUrl: false,
            assetAuthorDonationURL: false,

            assetDistributorName: 'N/A',
            assetDistributorMail: false,
            assetDistributorUrl: false,
            assetDistributorDonationURL: false,

            assetTagline: 'N/A'


         }
      },
      mounted: function () {
         this.getConfigFile()
         this.watchConfigFile()
      },
      methods: {
         openURL(link) {
            this.$electron.shell.openExternal(link)
         },
         watchConfigFile() {
            const userDataFolder = this.$store.getters.getUserDataFolder
            const configPath = userDataFolder + '/Wonderdraft/assets/' + this.$props.folder + '/mythKeeperSettings.json';

            let configFileWatcher = chokidar.watch(configPath, {
               persistent: true
            });

            configFileWatcher.on('add', path => console.log(
                this.getConfigFile()
            ))

            configFileWatcher.on('change', path => console.log(
                this.getConfigFile()
            ))

            configFileWatcher.on('unlink', path => console.log(
                this.hasSettings = false
            ));

         },
         getConfigFile() {
            const userDataFolder = this.$store.getters.getUserDataFolder

            const configPath = userDataFolder + '/Wonderdraft/assets/' + this.$props.folder + '/mythKeeperSettings.json';


            if (fs.existsSync(configPath)) {
               this.hasSettings = true
               this.configJSON = JSON.parse(fs.readFileSync(configPath, 'utf8'))
               this.reloadAssetData()
            }
         },
         reloadAssetData() {
            const userDataFolder = this.$store.getters.getUserDataFolder
            if (this.configJSON.basicInformation !== undefined) {

               const metaFilesPath = userDataFolder + '/Wonderdraft/assets/' + this.$props.folder + '/metafiles/';

               // Get basic info
               this.assetName = this.configJSON.basicInformation.name
               this.assetVersion = this.configJSON.basicInformation.version
               this.assetPreviewTitle = this.assetName

               // Get preview image
               if (fs.existsSync(metaFilesPath + 'preview.jpg')) {
                  this.assetPreview = metaFilesPath + 'preview.jpg'
               }
               if (fs.existsSync(metaFilesPath + 'preview.png')) {
                  this.assetPreview = metaFilesPath + 'preview.png'
               }

               // Get author info
               if (this.configJSON.basicInformation.author && this.configJSON.basicInformation.author.exists) {

                  if (this.configJSON.basicInformation.author.name) {
                     this.assetAuthorName = this.configJSON.basicInformation.author.name
                  }

                  if (this.configJSON.basicInformation.author.mail) {
                     this.assetAuthorMail = this.configJSON.basicInformation.author.mail
                  }

                  if (this.configJSON.basicInformation.author.url) {
                     this.assetAuthorUrl = this.configJSON.basicInformation.author.url
                  }

                  if (this.configJSON.basicInformation.author.donationURL) {
                     this.assetAuthorDonationURL = this.configJSON.basicInformation.author.donationURL
                  }
               }

               // Get distributor info
               if (this.configJSON.basicInformation.distributor && this.configJSON.basicInformation.distributor.exists) {

                  if (this.configJSON.basicInformation.distributor.name) {
                     this.assetDistributorName = this.configJSON.basicInformation.distributor.name
                  }

                  if (this.configJSON.basicInformation.distributor.mail) {
                     this.assetDistributorMail = this.configJSON.basicInformation.distributor.mail
                  }

                  if (this.configJSON.basicInformation.distributor.url) {
                     this.assetDistributorUrl = this.configJSON.basicInformation.distributor.url
                  }

                  if (this.configJSON.basicInformation.distributor.donationURL) {
                     this.assetDistributorDonationURL = this.configJSON.basicInformation.distributor.donationURL
                  }
               }

               // Get tagline
               if (this.configJSON.basicInformation.tagLine) {
                  this.assetTagline = this.configJSON.basicInformation.tagLine

               }
            }

         }
      }
   }
</script>

<style lang="sass" scoped>
    .assetMiniature
        font-family: "Montserrat", sans-serif
        width: 400px
        height: 350px
        background-color: rgba(43, 43, 43, 0.9)
        margin: 50px
        color: #fff
        border-radius: 3px
        letter-spacing: 1.5px
        padding: 15px

        &.hasSettings
            .titleInfo
                .title
                    color: #a8d790

        .icon
            cursor: pointer

        .titleInfo
            display: flex
            justify-content: space-between
            align-items: flex-end
            padding-bottom: 10px

            .title
                font-family: "Elementary Gothic", sans-serif
                font-size: 14px
                font-weight: 600
                white-space: nowrap
                overflow: hidden
                text-overflow: ellipsis
                width: 245px
                flex-shrink: 0
                color: #d7896c

            .version
                font-family: "Elementary Gothic", sans-serif
                color: #8f9298
                font-size: 12px

        .content
            display: flex

            .preview
                width: 150px
                height: 150px
                background-image: url('~@/assets/images/backgrounds/assetMiniatureBackground.png')

                display: flex
                justify-content: center
                align-items: center
                flex-shrink: 0

                img
                    max-height: 80%
                    max-width: 80%

            .textDetails
                padding-top: 5px
                padding-left: 15px
                flex-grow: 1

                .detailBlock
                    margin-bottom: 15px

                    .contactLine
                        display: flex
                        flex-grow: 1
                        justify-content: space-between
                        margin-bottom: 2px

                        .miniTitle
                            font-family: "Titania", sans-serif
                            font-size: 13px
                            color: #b8b8b8

                        .contactIcons
                            display: flex

                            .icon
                                margin-left: 7px
                                transform: scale(0.85)

                    .textLine
                        font-size: 16px

                        &.-tagline
                            font-size: 13px
</style>
