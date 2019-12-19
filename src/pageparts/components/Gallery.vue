<template lang="pug">

  .Gallery

    q-carousel(
      animated
      arrows
      v-model='slide'
      :ripple="false"
      thumbnails
      :fullscreen.sync="fullscreen"
      infinite)

      q-carousel-slide(
        imageList
        v-for='(image,index) in imageListProcessed'
        :key=index
        :name='index'
        :img-src='image')
        img(:src="image")

      template(v-slot:control)
        q-carousel-control(position='bottom-right' :offset='[18, 18]')
          q-btn(
            round
            glossy
            outline
            color="secondary"
            text-color='primary'
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click='fullscreen = !fullscreen')

            q-tooltip(
              :delay="300"
              anchor="center left"
              self="center right"
              transition-show="jump-left"
              transition-hide="jump-right")

              template(v-if="fullscreen")
                | Exit fullscreen mode

              template(v-else)
                | Enter fullscreen mode

</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop } from "vue-property-decorator"


@Component
export default class Gallery extends BaseClass {

  slide:number = 0
  fullscreen:boolean = false

  @Prop() readonly imageList!: string[]

  imageListProcessed: string[] = []

  mounted () {

    this.imageListProcessed = this.imageList.map((single) => {
      single = single.replace(/\\/g,"/")
      return single
    })
  }



}
</script>

<style lang="sass">
@import '../../assets/sass/globals'

.Gallery
  width: calc(100vw - 150px - 180px)

  .q-carousel
    height: calc(100vh - 300px)

  .q-panel-parent
    overflow: visible

  .q-carousel__slides-container

    img
      background-image: url("../../assets/images/lightboxBackground.png")
      background-size: cover

  .q-carousel__slide
    padding: 0
    background-image: none !important
    display: flex
    justify-content: center
    align-items: center

    img
      max-width: 100%
      max-height: 100%

  .q-carousel__control.q-btn
    background-color: transparent !important

    &:hover
      background-color: transparent !important

  .q-carousel__control.q-carousel__navigation.q-carousel__navigation--thumbnails
    bottom: -85px

    img
      background-image: url("../../assets/images/lightboxBackground.png")


</style>
