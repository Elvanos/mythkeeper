<template lang="pug">
  .GallerySlider.overlayContainer

    Gallery(
      :image-list='storeGetOverLayContents')

</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"

// Components
import Gallery from "@/pageparts/components/Gallery.vue"

@Component({
  components: {
    Gallery
  }
})
export default class GallerySlider extends BaseClass {

  created() {
    this.storeSetIsCloseableOverlay(true)
  }

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'
.GallerySlider

</style>

<style lang="sass">
  .App__overlay

</style>
