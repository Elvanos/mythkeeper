<template lang="pug">
  .OverlayChoiceDialog.overlayContainer

    .row

      // Title
      .col-12.q-mb-lg
        h3
          | {{ storeGetOverLayContents.title }}

      // Text content
      .col-12
        p.OverlayChoiceDialog__contents(
          v-html='storeGetOverLayContents.contents')

      // Table
      .col-12.q-mb-lg
        q-table(
          class="my-sticky-header-column-table"
          title="Download Variations"
          :data="storeGetOverLayContents.downloadItems"
          :columns="tableHeader"
          row-key="fileName"
          selection="single"
          dark
          :selected.sync="parameterOutput"
          hide-bottom
          virtual-scroll
          :pagination.sync="tablePagination"
          :rows-per-page-options="[0]"
        )


      // Button row for actions
      .row.full-width.justify-end.q-mt-xl
        .col-auto(
          v-for='action in storeGetOverLayContents.actions'
          :key='action.id'
        )

          q-btn(
            class="q-ml-lg"
            color="primary"
            :class='action.classes + " -bigButton"'

            :label="action.title"
            @click='processRequest(action.action, action.param)'

           )


</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"


@Component
export default class OverlayDownloadChoiceDialog extends BaseClass {

  //@ts-ignore
  parameterOutput: any[] = []

  tablePagination = {
    rowsPerPage: 0
  }

  tableHeader = [
    {
      name: "desc",
      required: true,
      label: "File Name",
      align: "left",
      field: row => row.fileName,
      format: val => `${val}`,
      sortable: true
    }
  ]

  created() {
    this.storeSetIsCloseableOverlay(true)
  }

  processRequest(toRunFunction: any, param?:any){


    if (this.parameterOutput.length === 0 && toRunFunction !== "closeModal") {

      //@ts-ignore
      this.$awn.warning("You must select a file to download!")
      return
    }

    if (param) {
      param.data = this.parameterOutput[0].downloadPath
    }


    //@ts-ignore
    this[toRunFunction](param)

    if (toRunFunction !== "closeModal"){
      this.closeModal()
    }
  }

}
</script>

<style lang="sass">
  .my-sticky-header-column-table

    .q-table__top
      display: none

    .q-table__middle
      max-height: 490px

    tr:first-child th
      position: sticky
      top: 0
      opacity: 1 /* opacity is important */
      z-index: 2 /* higher than z-index for td below */
      background: #000000 /* bg color is important; just specify one */

    tr:first-child th:first-child
      z-index: 3 /* highest z-index */

    td:first-child
      z-index: 1

    td:first-child, th:first-child
      position: sticky
      left: 0

</style>
