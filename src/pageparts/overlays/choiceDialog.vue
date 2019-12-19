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
export default class OverlayChoiceDialog extends BaseClass {

  created() {
    this.storeSetIsCloseableOverlay(true)
  }

  processRequest(toRunFunction: any, param?:string){
    //@ts-ignore
    this[toRunFunction](param)

    if (toRunFunction !== "closeModal"){
      this.closeModal()
    }
  }

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
.OverlayChoiceDialog
  width: 700px

  &__contents
    color: $themeCol-titles
    padding: 5px


</style>
