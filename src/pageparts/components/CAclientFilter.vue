<template lang="pug">

.CAclientFilter
  span.quickSearchTopBar
    q-select(
      filled
      clearable
      :disable="!filterActive || storeGetTaskList.length !== 0"
      class="-dense"
      ref='quickSearch'

      use-input
      hide-selected
      fill-input
      input-debounce="0"

      v-model='allSearch'
      :options='autocompleteAllSearch'
      label='Quick-search'

      @input="returnFilterValues"
      @filter="filterQuickSearch")

      template(v-slot:option='scope')
        q-item(v-bind='scope.itemProps' v-on='scope.itemEvents')
          q-item-section(avatar)
            q-icon(:name='scope.opt.icon')
          q-item-section
            q-item-label {{ scope.opt.value }}
              q-item-label(caption) {{ scope.opt.description }}

      q-icon(
        name="help")

        q-tooltip(
          :delay="300"
          transition-show="jump-down"
          transition-hide="jump-up")

          | This filter is unique, since it searches in all the search fields available at once.
          br
          | Mythkeeper will do it's best to suggest relevant results.
          br
          br
          b
            u This filter overwrites all other filter options as long as it has something written in it!
          br
          br
          | You can also filter whole categories by using the keywords
          br
          b "Mythkeeper Compatibility"
          br
          b "Item installation state"
          br
          b "Uploader"
          br
          b "Tag"
          br
          b "Prefix"
          br
          b "Category"
          br
          b "License"
          br
          b "Commercial use"
          br
          b "Asset name"
          br
          br
          b Be aware that due to the wild-card nature of this search, some results might not be optimal.

  //Filter bundle
  span.filtersWrapper

    // Button Dropdown - Filters
    q-btn-dropdown(
      v-model="filterVisibility"
      :disabled='!filterActive || storeGetTaskList.length !== 0'
      label="Filters"
      :content-class="'componentMenuDropdown'"

      :class="[\
      {'-active' : filterVisibility},\
      {'q-highlight-pass': computedFiltersHaveInput}\
      ]"
      outline
      class="q-ml-md"
      color="primary"
      :ripple="false"
    )

      // Filter list
      .filtersWrapper
        .filtersWrapper__dropdown

          // All search filter
          .filtersWrapper__dropdown__inner
            .filtersWrapper__dropdown__inner__content

              // Filter row
              .row.q-col-gutter-x-md.q-col-gutter-y-lg

                // Title
                .col-12
                  h3 Download filters

                // FILTER - Quick search
                .col-7
                  q-select(
                    filled
                    clearable
                    ref='quickSearchInner'

                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"

                    v-model='allSearch'
                    :options='autocompleteAllSearch'
                    label='Quick-search'

                    @input="returnFilterValues"
                    @filter="filterQuickSearch"
                  )

                    template(v-slot:prepend)
                      q-icon(name="search")

                    template(v-slot:option='scope')
                      q-item(v-bind='scope.itemProps' v-on='scope.itemEvents')
                        q-item-section(avatar)
                          q-icon(:name='scope.opt.icon')
                        q-item-section
                          q-item-label {{ scope.opt.value }}
                            q-item-label(caption) {{ scope.opt.description }}

                    q-icon(
                      name="help")

                      q-tooltip(
                        :delay="300"
                        transition-show="jump-down"
                        transition-hide="jump-up")

                        | This filter is unique, since it searches in all the search fields available at once.
                        br
                        | Mythkeeper will do it's best to suggest relevant results.
                        br
                        br
                        b
                          u This filter overwrites all other filter options as long as it has something written in it!
                        br
                        br
                        | You can also filter whole categories by using the keywords
                        br
                        b "Mythkeeper Compatibility"
                        br
                        b "Item installation state"
                        br
                        b "Author or distributor"
                        br
                        b "Tag"
                        br
                        b "Prefix"
                        br
                        b "Category"
                        br
                        b "License"
                        br
                        b "Commercial use"
                        br
                        b "Asset name"
                        br
                        br
                        b Be aware that due to the wild-card nature of this search, some results might not be optimal.

                // FILTER - Sort by
                .col-5
                  q-select(
                    filled
                    @input="returnFilterValues"
                    v-model="selectedSorting"
                    :options="sortingList"
                    label="Sorting")

                    template(v-slot:prepend)
                      q-icon(name="swap_vert")

                // FILTER - Uploaders
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterAuthor"
                    :disable="filterContents.authors.length === 0"

                    v-model="selectedAuthors"
                    :options="autocompleteAuthorList"
                    label="Uploaders")

                    template(v-slot:prepend)
                      q-icon(name="person")

                // FILTER - License
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterLicense"
                    :disable="filterContents.licenses.length === 0"

                    v-model="selectedLicenses"
                    :options="autocompleteLicenseList"
                    label="License")

                    template(v-slot:prepend)
                      q-icon(name="description")

                // FILTER - Commercial use
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterCommercialUse"
                    :disable="filterContents.commercialUses.length === 0"

                    v-model="selectedCommercialUse"
                    :options="autocompleteCommercialUseList"
                    label="Commercial use")

                    template(v-slot:prepend)
                      q-icon(name="attach_money")

                // FILTER - MK Compatbility
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterCompatibleMK"
                    :disable="filterContents.compatibleMK.length === 0"

                    v-model="selectedCompatibleMK"
                    :options="autocompleteCompatibleMK"
                    label="Mythkeeper compatibility")

                    template(v-slot:prepend)
                      q-icon(name="mdi-help-rhombus-outline")

                // FILTER - Installation states
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterInstallationState"
                    :disable="filterContents.installationState.length === 0"

                    v-model="selectedInstallationState"
                    :options="autocompleteInstallationStateList"
                    label="Installation state")

                    template(v-slot:prepend)
                      q-icon(name="mdi-file-settings-variant-outline")

                // FILTER - Categories
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterCategory"
                    :disable="filterContents.categories.length === 0"

                    v-model="selectedCategories"
                    :options="autocompleteCategoryList"
                    label="Categories")

                    template(v-slot:prepend)
                      q-icon(name="mdi-cards")

                // FILTER - Prefixes
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterPrefix"
                    :disable="filterContents.prefixes.length === 0"

                    v-model="selectedPrefixes"
                    :options="autocompletePrefixList"
                    label="Prefixes")

                    template(v-slot:prepend)
                      q-icon(name="mdi-terrain")

                // FILTER - Tags
                .col-6
                  q-select(
                    filled
                    multiple
                    use-chips
                    clearable

                    use-input
                    fill-input
                    input-debounce="0"

                    @input="returnFilterValues"
                    @filter="filterTags"
                    :disable="filterContents.tags.length === 0"

                    v-model="selectedTags"
                    :options="autocompleteTagList"
                    label="Tags")

                    template(v-slot:prepend)
                      q-icon(name="local_offer")

  // Checkbox - Quick toggle filters
  span.q-ml-xs
    q-checkbox(
      v-model="filterActive"
      @input="returnFilterValues"
      :disable='storeGetTaskList.length !== 0')

      q-tooltip(
        :delay="300"
        transition-show="jump-down"
        transition-hide="jump-up")

        b Quick-toggle if filters are active or not


</template>

<script lang="ts">


/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs

// Interfaces
import CAFilterContentInterface from "@/scripts/interfaces/_interfaceCAFilterContent"

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, Watch } from "vue-property-decorator"


/* ------------------------------------ */
/* ------------VUE COMPONENT---------- */
/* ------------------------------------ */


@Component
export default class CAclientFilter extends BaseClass {


  /* ------------------------------ */
  /* ------------DATA-------------- */
  /* ------------------------------ */


  /**
   * Determines if the filters are taken into account when filtering the list of assets or not.
   */
  filterActive: boolean = true

  /**
   * Determines if the filter popup is opened or closed
   * @see toggleFilterVisibility
   */
  filterVisibility: boolean = false


  /**
   * List of authors for the autocomplete
   */
  autocompleteAuthorList: string[] = []

  /**
   * List of selected authors from the form
   */
  selectedAuthors: string[] = []


  /**
   * List of commercial uses for the autocomplete
   */
  autocompleteCommercialUseList: string[] = []

  /**
   * List of selected commercial uses from the form
   */
  selectedCommercialUse: string[] = []


  /**
   * List of licenses for the autocomplete
   */
  autocompleteLicenseList: string[] = []

  /**
   * List of selected licenses from the form
   */
  selectedLicenses: string[] = []


  /**
   * List of tags for the autocomplete
   */
  autocompleteTagList: string[] = []

  /**
   * List of selected tags from the form
   */
  selectedTags: string[] = []


  /**
   * List of compatibility for the autocomplete
   */
  autocompleteCompatibleMK: string[] = []

  /**
   * List of selected compatibility states from the form
   */
  selectedCompatibleMK: string[] = ["Compatible"]

  /**
   * List of installations states for the autocomplete
   */
  autocompleteInstallationStateList: string[] = []

  /**
   * List of selected installations states from the form
   */
  selectedInstallationState: string[] = []

  /**
   * List of prefixes for the autocomplete
   */
  autocompletePrefixList: string[] = []

  /**
   * List of selected prefixes from the form
   */
  selectedPrefixes: string[] = []

  /**
   * List of categories for the autocomplete
   */
  autocompleteCategoryList: string[] = []

  /**
   * List of selected categories from the form
   */
  selectedCategories: string[] = []

  /**
   * List of sorting directions for the autocomplete
   */
  sortingList: string[] = [
    "Last update - newest",
    "Last update - oldest",
    "Downloads - ascending (0 >> X)",
    "Downloads - descending (X >> 0)",
    "Uploaded - newest",
    "Uploaded - oldest",
    "Rating - lowest",
    "Rating - highest",
    "Alphabetical - ascending (A >> Z)",
    "Alphabetical - descending (Z >> A)",
  ]

  /**
   * Selected sorting direction from the form
   */
  selectedSorting: string = "Last update - newest"

  /**
   * Automatically generated fancy list for the quick search autocomplete
   * @see computedAllSearchList
   */
  autocompleteAllSearch: object[] = []

  /**
   * Selected quick search from the form
   */
  allSearch: any = ""

  /* ---------------------------------- */
  /* ------------COMPUTED-------------- */
  /* ---------------------------------- */


  /**
   * Generates the fancy dropdown for "Quick search" field
   * @see autocompleteAllSearch
   */
  get computedAllSearchList(){
    const compList: any[] = []

    // Add Authors
    this.filterContents.authors.forEach((single)=>{
      compList.push({value: single, icon: "person", label: single, description: "Uploader"})
    })

    // Add Commercial uses
    this.filterContents.commercialUses.forEach((single)=>{
      compList.push({value: single, icon: "attach_money", label: single, description: "Commercial use"})
    })

    // Add Licenses
    this.filterContents.licenses.forEach((single) => {
      compList.push({value: single, icon: "description", label: single, description: "License"})
    })

    // Add Compatibility states
    this.filterContents.compatibleMK.forEach((single)=>{
      compList.push({value: single, icon: "mdi-help-rhombus-outline", label: single, description: "MK Compatibility"})
    })

    // Add Installation states
    this.filterContents.installationState.forEach((single)=>{
      compList.push({value: single, icon: "mdi-file-settings-variant-outline", label: single, description: "Installation state"})
    })

    // Add Categories
    this.filterContents.categories.forEach((single)=>{
      compList.push({value: single, icon: "mdi-cards", label: single, description: "Category"})
    })

    // Add Prefixes
    this.filterContents.prefixes.forEach((single)=>{
      compList.push({value: single, icon: "mdi-terrain", label: single, description: "Prefix"})
    })

    // Add Tags
    this.filterContents.tags.forEach((single)=>{
      compList.push({value: single, icon: "local_offer", label: single, description: "Tag"})
    })

    // Add Asset names
    this.filterContents.names.forEach((single)=>{
      compList.push({value: single, icon: "image", label: single, description: "Asset name"})
    })

    // Assign all the search values to all possible options for the search
    this.autocompleteAllSearch = compList

    // Also keep the value in this computed data for later comparisons
    return compList

  }

  /**
   * Determines if the filters button is green or not
   * Sets to true or false depending on if it can find any inputs
   */
  get computedFiltersHaveInput(){

    // Assume there is nothing in the filters
    let activeFilters: boolean = false

    // Check if the values exist since Quasar sets then to "null" at clearing
    // Also check if there is anything IN the value, assuming it exists
    if (
      (this.selectedAuthors &&
        this.selectedAuthors.length > 0) ||

        (this.selectedCommercialUse &&
        this.selectedCommercialUse.length > 0) ||

        (this.selectedLicenses &&
        this.selectedLicenses.length > 0) ||

        (this.selectedCompatibleMK &&
            this.selectedCompatibleMK.length > 0) ||

        (this.selectedInstallationState &&
            this.selectedInstallationState.length > 0) ||

        (this.selectedTags &&
          this.selectedTags.length > 0) ||

        (this.selectedPrefixes &&
            this.selectedPrefixes.length > 0) ||

        (this.selectedCategories &&
            this.selectedCategories.length > 0) ||

        (this.allSearch &&
        this.allSearch.value.length > 0)

    ){

      // Set to true if we found any values
      activeFilters = true
    }

    return activeFilters
  }


  /* ------------------------------ */
  /* -----------VUE NATIVE------------- */
  /* ------------------------------ */


  /**
   * Native create
   */
  created(){
    this.returnFilterValues()
  }

  /* ------------------------------ */
  /* -----------PROPS------------- */
  /* ------------------------------ */


  /**
   * Data feed for the filters passed from parent module
   */
  @Prop() readonly filterContents!: CAFilterContentInterface

  /**
   * Data feed for quick search passed from parent module
   */
  @Prop() readonly filterQuickSearchUpdate!: string


  /* ------------------------------- */
  /* ------------WATCH-------------- */
  /* ------------------------------- */


  /**
   * Listens to changes on prop with the QuickSearch value
   * When detecting a change, force-update the model for QuickSearch
   */
  @Watch("filterQuickSearchUpdate")
  listenerFilterQuickSearchUpdate(){

    // Sets data in Quasar-friendly format
    this.allSearch = {
      value: this.filterQuickSearchUpdate,
      icon: "search",
      label: this.filterQuickSearchUpdate,
      description: "Current search"}

    // Return new filter data to the parent manually
    this.returnFilterValues()
  }


  /* -------------------------------- */
  /* ------------METHODS------------ */
  /* -------------------------------- */


  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterCommercialUse (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteCommercialUseList = this.filterContents.commercialUses.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterAuthor (val, update) {

    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteAuthorList = this.filterContents.authors.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })

  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterLicense (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteLicenseList = this.filterContents.licenses.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterCompatibleMK (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteCompatibleMK = this.filterContents.compatibleMK.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterInstallationState (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteInstallationStateList = this.filterContents.installationState.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterPrefix (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompletePrefixList = this.filterContents.prefixes.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterCategory (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteCategoryList = this.filterContents.categories.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterTags (val, update) {
    update(() => {
      const needle = val.toLowerCase()
      this.autocompleteTagList = this.filterContents.tags.filter((v) => {
        return v.toLowerCase().includes(needle)
      })
    })
  }

  /**
   * Triggers on the typing in the select component and populates the field with filtered results
   * Also attaches the current search string value as first option of the filter list and force-focuses it to emulate normal input behavior.
   * @param val {string} The value passed from the filter component
   * @param update {function} - Update function wrapper that gets passed from the filter component
   */
  filterQuickSearch (val, update) {
    update(() => {

      // Find all matching elements
      const needle = val.toLowerCase()

      this.autocompleteAllSearch = this.computedAllSearchList.filter((v) => {
        return v.value.toLowerCase().includes(needle) || v.description.toLowerCase().includes(needle)
      })


      // Append dummy "current search" element to the top of the list in order to make this select work like an actual search input
      const currentSearch: any = {value: val, icon: "search", label: val, description: "Current search"}

      this.autocompleteAllSearch.unshift(currentSearch)

      // Hacky solution, because it takes the filter to refresh the content a tiny second
      setTimeout(()=>{

        // Manually focus ONLY on the currently active input
        if(this.$refs.quickSearchInner && this.$refs.quickSearchInner["$el"].classList.contains("q-field--float")){
          this.$refs.quickSearchInner["setOptionIndex"](0)
        }

        // Manually focus ONLY on the currently active input
        if(this.$refs.quickSearch && this.$refs.quickSearch["$el"].classList.contains("q-field--float")){
          this.$refs.quickSearch["setOptionIndex"](0)
        }

      }, 10)



    })
  }

  /**
   * Toggles the filter dropdown
   * @see filterVisibility
   */
  toggleFilterVisibility(){
    this.filterVisibility = (this.filterVisibility) ? false : true
  }

  /**
   * Returns a full current filter value from all fields to the parent
   * Triggers "trigger-filter-input" emitter
   */
  returnFilterValues(){

    const currentFilters: CAFilterContentInterface = {
      names: [],
      tags: this.selectedTags,
      categories: this.selectedCategories,
      prefixes: this.selectedPrefixes,
      licenses: this.selectedLicenses,
      authors: this.selectedAuthors,
      compatibleMK: this.selectedCompatibleMK,
      installationState: this.selectedInstallationState,
      commercialUses: this.selectedCommercialUse,
      allSearch: this.allSearch,
      sorting: this.selectedSorting,
      filtersActive: this.filterActive
    }


    this.$emit("trigger-filter-input",currentFilters)
  }


}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'


.quickSearchTopBar
  width: 185px

.CAclientFilter
  display: flex
  align-items: center

// Filters
.filtersWrapper
  position: relative
  margin: -15px 0

  &__dropdown
    position: relative

    &__inner
      +MK_elementBackground('../../assets/images/MKbackgroundElementsAlt.png')
      border-radius: 2px 2px 5px 5px

      &:before
        border-radius: 2px 2px 5px 5px

      &__content
        position: relative
        padding: 40px 50px 80px
        width: 1000px
        z-index: 1

</style>
