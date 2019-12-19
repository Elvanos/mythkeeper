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
          title="Contents of the package"
          :data="parameterInput.extractionQueue"
          :columns="tableHeader"
          row-key="name"
          selection="multiple"
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

import interfaceInstallerQueueMember from "@/scripts/interfaces/_interfaceInstallerQueueMember"


@Component
export default class OverlayChoiceDialog extends BaseClass {

  parameterInput = {} as interfaceInstallerQueueMember
  parameterOutput: any[]= []

  tablePagination = {
    rowsPerPage: 0
  }

  tableHeader = [
    {
      name: "desc",
      required: true,
      label: "Name",
      align: "left",
      field: row => row.name,
      format: val => `${val}`,
      sortable: true
    },
    { name: "type", align: "center", label: "Type", field: "type", sortable: true },
    { name: "exists", align: "center", label: "Already installed", field: "alreadyExists", sortable: true },
    { name: "installedVersion", align: "center", label: "Current version", field: "installedVersion"},
    { name: "newVersion", align: "center", label: "Installer version", field: "newVersion"},

  ]

  created() {
    this.storeSetIsCloseableOverlay(false)
    this.parameterInput = this.storeGetOverLayTriggerParameter
    this.parameterOutput = this.parameterInput.extractionQueue

  }

  processRequest(toRunFunction: any, param?:string){

    // Check what user checked in the checkbox field and if not found, set it as "false" for installation
    this.parameterInput.extractionQueue.forEach((singleInput, index)=>{

      const foundValue = this.parameterOutput.find((singleOutput)=>{
        return singleInput.name === singleOutput.name
      })

      if (!foundValue) {
        this.parameterInput.extractionQueue[index].willInstall = false
      }

    })

    if (this.parameterOutput.length === 0 && toRunFunction !== "closeModal") {

      //@ts-ignore
      this.$awn.warning("You must select at least file to continue!")
      return
    }

    // Run the installation or cancel the install land silently clean up after us
    this.storeSetOverLayTriggerParameter(this.parameterInput)
    this[toRunFunction](param)
    this.closeModal()

  }

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
.OverlayChoiceDialog
  width: 1000px

  &__contents
    color: $themeCol-titles
    padding: 5px


</style>

<style lang="sass">
  .my-sticky-header-column-table

    .q-table__top
      display: none

    .q-table__middle
      max-height: calc(100vh - 655px)

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
