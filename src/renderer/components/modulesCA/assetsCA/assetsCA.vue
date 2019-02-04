<template>

    <div class="wrapper">

        <div class="filters">

            <div class="caLogo" v-tooltip.bottom-end="`Visit Cartographyassets.com`" v-on:click="openCALink">

            </div>

            <h2>
                Filters
            </h2>

            <div class="filterPair">
                <label for="filterSortByCA">Sort by</label>
                <v-select
                        :transition="`zoomLeft`"
                        id="filterSortByCA"
                        v-on:input="filterList"
                        v-model="filters.sortBy.input"
                        :options="filters.sortBy.base"/>
            </div>

            <div class="filterPair">
                <label for="filterSortOrderCA">Sort order</label>
                <toggle-button
                        id="filterSortOrderCA"
                        :width="200"
                        :height="30"
                        :color="{checked: '#88e098', unchecked: '#50b0b2'}"
                        v-model="filters.sortBy.sortOrderDESC"
                        v-on:change="filterList"
                        :labels="{checked: 'Descending', unchecked: 'Ascending'}"

                />
            </div>

            <div class="filterPair">
                <div class="resetButton"
                     v-tooltip.right="`Clear this filter`"
                     v-on:click="resetFieldString('search')">
                    <div class="sprite general-remove"></div>
                </div>


                <label for="filterSearchTextCA">Search
                    <span class="sprite general-info-red"
                          v-tooltip.bottom-end="`
                            <b>Quick searches at the same time in:</b>
                             <br>categories,
                             <br>prefixes
                             <br>tags,
                             <br>taglines
                             <br>authors,
                             <br>titles
                             `">

                    </span>
                </label>
                <input
                        class="filterInput"
                        id="filterSearchTextCA"
                        v-model="filters.search"
                        v-on:keyup="filterList"

                />
            </div>

            <div class="filterPair">
                <div class="resetButton"
                     v-tooltip.right="`Clear this filter`"
                     v-on:click="resetFieldArray('authors')">
                    <div class="sprite general-remove"></div>
                </div>

                <label for="filterAuthorsCA">Authors</label>
                <v-select
                        id="filterAuthorsCA"
                        :transition="`zoomLeft`"
                        multiple
                        :close-on-select="false"
                        v-on:input="filterList"
                        v-model="filters.authors.input"
                        :options="filters.authors.base"/>
            </div>

            <div class="filterPair">
                <label for="filterTagsModeCA">Tag filter mode</label>
                <toggle-button
                        id="filterTagsModeCA"
                        :width="200"
                        :height="30"
                        :color="{checked: '#88e098', unchecked: '#50b0b2'}"
                        v-model="filters.tags.allPresentMode"
                        v-on:change="filterList"
                        :labels="{checked: 'All selected', unchecked: 'Any of the selected'}"

                />
            </div>

            <div class="filterPair">
                <div class="resetButton"
                     v-tooltip.right="`Clear this filter`"
                     v-on:click="resetFieldArray('tags')">
                    <div class="sprite general-remove"></div>
                </div>
                <label for="filterTagsCA">Tags</label>
                <v-select
                        id="filterTagsCA"
                        multiple
                        :transition="`zoomLeft`"
                        :close-on-select="false"
                        v-on:input="filterList"
                        v-model="filters.tags.input"
                        :options="filters.tags.base"/>
            </div>


            <div class="filterPair">
                <label for="filterInstalledCA">Show already installed</label>
                <toggle-button
                        id="filterInstalledCA"
                        :width="200"
                        :height="30"
                        :color="{checked: '#83bd5a', unchecked: '#a0a5b2'}"
                        v-model="filters.installed"
                        v-on:change="filterList"
                        :labels="{checked: 'Yes', unchecked: 'No'}"

                />
            </div>

            <div class="filterPair">
                <label for="filterCommercialUseCA">Commercial use</label>
                <toggle-button
                        id="filterCommercialUseCA"
                        :width="200"
                        :height="30"
                        :color="{checked: '#83bd5a', unchecked: '#a0a5b2'}"
                        v-model="filters.commercialUse"
                        v-on:change="filterList"
                        :labels="{checked: 'Yes', unchecked: 'No'}"

                />
            </div>

            <div class="filterPair extended">
                <label for="filterRatingCA">Rating</label>
                <vueSlider
                        id="filterRatingCA"
                        v-model="filters.rating.input"
                        v-on:callback="filterList"

                        :min="filters.rating.base.min"
                        :max="filters.rating.base.max"
                        :processStyle='{"backgroundColor": "#83bd5a"}'
                        :bgStyle='{"backgroundColor": "#a0a5b2"}'
                        :tooltipDir='["bottom","bottom"]'
                        :tooltipStyle='[
                            {"backgroundColor": "transparent", "borderColor": "transparent"},
                            { "backgroundColor": "transparent", "borderColor": "transparent"}
                        ]'

                />
            </div>

            <div class="filterPair">
                <label for="filterMKSupportCA">Compatibility
                    <span class="sprite general-info-red"
                          v-tooltip.bottom-end="`By default we show only assets marked by their authors as Mythkeeper compatible. You can override this behavior by turning this switch off. <br> If you do so, we cannot guarantee that the other assets will work properly or that it will not affect your Wonderdraft asset folder in negative way.<br><br><b>Proceed with caution!</b>`">

                    </span>
                </label>
                <toggle-button
                        id="filterMKSupportCA"
                        :width="200"
                        :height="30"
                        :color="{checked: '#12bd10', unchecked: '#b22727'}"
                        v-model="filters.mkCompatible"
                        v-on:change="filterList(true)"
                        :labels="{checked: 'Only compatible', unchecked: 'All assets'}"

                />
            </div>


        </div>


        <div class="grid">
            <transition-group name="animateList" tag="span">
                <assetsCAMiniature
                        class="animateListItem"
                        v-for="singleAsset in filteredAssetList"
                        :key="`singleAsset-${singleAsset.resource_id}`"
                        :assetData="singleAsset"
                        :showInstalled="filters.installed"

                        v-on:hideChild="hideChild"
                        v-on:searchChange="changeSearch"

                />
            </transition-group>
        </div>



    </div>

</template>

<script>

   import assetsCAMiniature from './subparts/assetsCAMiniature'
   import vueSlider from 'vue-slider-component'



   export default {
      name: "assetsCA",
      components: {
         assetsCAMiniature,
         vueSlider
      },
      data: function () {
         return {
            fetchedAssetList: [],
            filteredAssetList: [],
            filters: {
               sortBy: {
                  sortOrderDESC: true,
                  input: 'Downloads',
                  base: [
                     'Downloads',
                     'Rating',
                     'Last update',
                     'Newest',
                     'Title'

                  ]
               },
               authors: {
                  input: [],
                  base: []
               },
               tags: {
                  input: [],
                  base: [],
                  allPresentMode: true
               },
               rating: {
                  input: [0, 5],
                  base: {
                     min: 0,
                     max: 5
                  }
               },
               search: '',
               commercialUse: true,
               installed: true,
               mkCompatible: true,
               isCompatible: true
            }

         }
      },
      mounted: function () {
         this.retrievePagesFromCA()
      },
      methods: {
         openCALink() {
            this.$electron.shell.openExternal('https://www.cartographyassets.com/')
         },
         retrievePagesFromCA() {
            this.$store.dispatch('disableApp')

            let pageNum = 1
            let assetList = []

            const cyclePages = () => {
               this.$http.get(
                   `https://www.cartographyassets.com/api/resources?with_posts&page=${pageNum}`,
                   {
                      headers: {
                         'XF-Api-Key': '3NY1F9gFZ_Agmp9FLfiy8US17kcKHDGn'
                      }
                   }
               )
                   .then((response) => {
                          pageNum++

                          assetList = assetList.concat(response.data.resources)

                          if (pageNum - 1 < response.data.pagination.last_page) {
                             cyclePages()
                          } else {
                             this.$store.dispatch('enableApp')
                             this.getListAndSetFilterBase(assetList)
                          }

                       }
                   ).catch((err) => {
                      console.log(err)

                      this.$store.dispatch('setCurrentModuleCA', false)
                      this.$awn.alert("Attempt to connect to Cartographyassets.com has failed.")
                   }
               )
            }


            cyclePages()


         },
         getListAndSetFilterBase(assetList) {

            const CAIDlist = {

               // Mythkeeper
               mythkeeper: [73],

               // Wonderdraft
               themes: [48],

               // Mapforge
               mapforge: [63],

               // Photoshop
               photoshop: [6],

               // Battlemaps
               battlemaps: [69, 70, 71]

            }

            // Filter out non-compatible
            assetList = assetList
                .filter(singleAsset => {

                       return !CAIDlist.themes.includes(singleAsset.resource_category_id)
                           &&
                           !CAIDlist.battlemaps.includes(singleAsset.resource_category_id)
                           &&
                           !CAIDlist.mapforge.includes(singleAsset.resource_category_id)
                           &&
                           !CAIDlist.photoshop.includes(singleAsset.resource_category_id)
                           &&
                           !CAIDlist.mythkeeper.includes(singleAsset.resource_category_id)
                    }
                )



            this.fetchedAssetList = assetList

            this.$store.dispatch('enableApp')

            this.filterList(true)


            // Category function for the future, if needed
            /*this.$http.get(" https://www.cartographyassets.com/api/index.php?resource-categories/").then((response) => {
            })*/

         },
         filterList(refresh) {
            let assetList = this.fetchedAssetList

            // Filter the list by MK compatibility checkbox
            if (this.filters.mkCompatible === true) {
            assetList = assetList
                .filter((singleAsset) => {

                   // Get the field
                   let MKtest = false
                   let MKtestFields = singleAsset.custom_fields


                   // Check if the field exists AND if the value field exists
                   if (MKtestFields.assetmanager !== undefined && MKtestFields.assetmanager.yes !== undefined && MKtestFields.assetmanager.yes === 'yes') {
                      MKtest = true
                   }

                   return MKtest
                })
            }


            if (refresh === true) {

               this.filters.tags.base = []
               this.filters.authors.base = []
               this.filters.tags.input = []
               this.filters.authors.input = []

               // Build authors & tag base filters
               assetList.forEach(singleAsset => {
                  if (!this.filters.authors.base.includes(singleAsset.username)) this.filters.authors.base.push(singleAsset.username)


                  if (Array.isArray(singleAsset.tags)) {
                     singleAsset.tags.forEach(tag => {
                        if (!this.filters.tags.base.includes(tag)) {
                           this.filters.tags.base.push(tag)
                        }
                     })
                  }
               })


               this.filters.tags.base = this.filters.tags.base.sort()
               this.filters.authors.base = this.filters.authors.base.sort()

            }


            // Filter by child being manually hidden
            if (this.filters.installed === false) {
               assetList = assetList.filter(singleAsset => singleAsset.isHidden !== true)
            }

            // Filter by search
            if (this.filters.search.length > 0) {
               assetList = assetList.filter((singleAsset) => {

                  let hasSearchTerm = false
                  const searchTerm = this.filters.search.toLowerCase()

                  if (
                      singleAsset.username.toLowerCase().includes(searchTerm)
                      ||
                      singleAsset.title.toLowerCase().includes(searchTerm)
                      ||
                      singleAsset.tag_line.toLowerCase().includes(searchTerm)
                      ||
                      singleAsset.prefix.toLowerCase().includes(searchTerm)
                      ||
                      singleAsset.Category.title.toLowerCase().includes(searchTerm)
                  ) {
                     hasSearchTerm = true
                  }


                  if (Array.isArray(singleAsset.tags)) {
                     singleAsset.tags.forEach(tag => {
                        if (tag.includes(searchTerm)) {
                           hasSearchTerm = true
                        }
                     })
                  }


                  return hasSearchTerm
               })
            }


            // Filter by rating
            assetList = assetList.filter(singleAsset => this.filters.rating.input[0] <= singleAsset.rating_avg && this.filters.rating.input[1] >= singleAsset.rating_avg)


            // Filter by authors
            if (this.filters.authors.input.length > 0) {
               assetList = assetList.filter(singleAsset => this.filters.authors.input.includes(singleAsset.username))
            }

            // Filter by commercial use
            if (this.filters.commercialUse === false) {
               assetList = assetList.filter((singleAsset) => {

                  // Get the field
                  let commercialUse = false
                  let commercialUseField = singleAsset.custom_fields


                  // Check if the field exists AND if the value field exists
                  if (commercialUseField.license !== undefined && commercialUseField.license === 'commercial') {
                     commercialUse = true
                  }

                  return commercialUse
               })
            }

            // Filter by tags
            if (this.filters.tags.input.length > 0) {

               assetList = assetList.filter((singleAsset) => {

                      let hasTags = false
                      let tempTagList = []


                      if (Array.isArray(singleAsset.tags)) {

                         // Only if all are present
                         if (this.filters.tags.allPresentMode) {
                            singleAsset.tags.forEach(tag => {
                               if (this.filters.tags.input.includes(tag)) {
                                  tempTagList.push(tag)
                               }
                            })

                            tempTagList = tempTagList.sort()

                            if (String(tempTagList) === String(this.filters.tags.input)) {
                               hasTags = true
                            }
                         }
                         // If at least one is present
                         else {

                            singleAsset.tags.forEach(tag => {
                               if (this.filters.tags.input.includes(tag)) {
                                  hasTags = true
                               }
                            })

                         }
                      }
                      return hasTags
                   }
               )
            }

            // Sort by number of downloads
            if (this.filters.sortBy.input === 'Downloads') {
               assetList.sort((a, b) => {
                  return a.download_count - b.download_count
               })
            }

            // Sort by rating
            if (this.filters.sortBy.input === 'Rating') {
               assetList.sort((a, b) => {
                  return a.rating_avg - b.rating_avg
               })
            }

            // Sort by update date
            if (this.filters.sortBy.input === 'Last update') {
               assetList.sort((a, b) => {
                  return a.last_update - b.last_update
               })
            }

            // Sort by newest submission
            if (this.filters.sortBy.input === 'Newest') {
               assetList.sort((a, b) => {
                  return a.resource_date - b.resource_date
               })
            }

            // Sort by title
            if (this.filters.sortBy.input === 'Title') {
               assetList.sort((a, b) => {

                  a = a.title.toLowerCase()
                  b = b.title.toLowerCase()

                  return a.localeCompare(b)

               })
            }

            if (this.filters.sortBy.sortOrderDESC) {
               assetList.reverse()
            }

            //console.log(assetList)

            this.filteredAssetList = assetList
         },
         hideChild(id, isUpdated) {
            this.fetchedAssetList = this.fetchedAssetList.map(singleAsset => {

               if (singleAsset.resource_id === id && isUpdated) {
                  singleAsset.isHidden = true
               }
               return singleAsset
            })
            this.filterList()

         },
         changeSearch(searchTerm) {
            this.filters.search = searchTerm
            this.filterList()
         },
         resetFieldArray(fieldName) {
            this.filters[fieldName].input = []
         },
         resetFieldString(fieldName) {
            this.filters[fieldName] = ''
            this.filterList()
         },
      }
   }
</script>

<style scoped lang="sass">

    .wrapper

        .filters
            position: fixed
            background-color: rgba(21, 21, 21, 0.9)
            left: 110px
            top: 60px
            bottom: 60px
            width: 200px
            padding: 30px 25px
            overflow-y: auto
            overflow-x: visible
            +M_scrollbars($size: 10px, $foreground-color: #444342)

            .caLogo
                position: absolute
                background-image: url(~@/assets/images/vendorLogos/caLogo.png)
                width: 45px
                height: 45px
                background-size: contain
                background-repeat: no-repeat
                cursor: pointer
                right: 15px
                top: 22.5px

                transition: 0.3s $transition-DefaultType all

                filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))

                &:hover
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))

            h2
                font-size: 22px
                color: #fff
                margin-top: 0

            .filterPair
                margin-bottom: 15px
                position: relative

                &.extended
                    margin-bottom: 30px

                .filterInput
                    outline: none
                    border: 1px solid
                    background-color: #a0a5b2
                    padding: 8px 15px
                    border-radius: 3px
                    width: 170px
                    cursor: pointer
                    font-size: 15.5px
                    color: #000
                    font-weight: 500

                .resetButton
                    position: absolute
                    right: 0
                    top: -2px
                    cursor: pointer
                    z-index: 1
                    *
                        cursor: pointer
                        filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(1)

                label
                    display: block
                    font-size: 15.5px
                    color: white
                    padding-bottom: 5px

                    .sprite
                        margin-left: 10px

        .grid
            width: calc(100% - 220px)
            padding: 0 30px
            margin-left: auto
            margin-top: -30px
            margin-right: -50px

            > span
                display: flex
                flex-wrap: wrap

            .animateListItem
                transition: all 0.75s

            .animateList-enter, .animateList-leave-to
                opacity: 0
                transform: translateY(30px)

            .animateList-leave-active
                position: absolute


</style>
