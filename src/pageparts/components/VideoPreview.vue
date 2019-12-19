<template lang="pug">

  .VideoPreview(
    ref='videoWrapper'
    :style='computedStyles')

    .VideoPreview__button

</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component } from "vue-property-decorator"



@Component
export default class VideoPreview extends BaseClass {

  wrapperHeight: number = 0
  wrapperWidth: any = null
  get computedStyles(){
    return {
      width: `${this.wrapperWidth}px`,
      height: `${this.wrapperHeight}px`
    }
  }

  mounted(){
    //@ts-ignore
    window.addEventListener("resize", this.calculateHeight())
    this.calculateHeight()
  }

  beforeDestroy(){
    window.removeEventListener("resize", this.calculateHeight)
  }

  calculateHeight(){
    this.wrapperWidth = null

    //@ts-ignore
    this.wrapperWidth = this.$refs.videoWrapper.clientWidth
    this.wrapperHeight = Math.round(( this.wrapperWidth/16)*9)

  }

}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.VideoPreview
  position: relative
  width: 100%

  cursor: pointer
  background-color: $themeCol-ElementBackground
  box-shadow: inset 0px 0px 5px 8px rgba(#000000,1)

  transition: filter 0.3s $transition-DefaultType


  &:before
    content: ''
    +M_AbsoluteFullCover
    transition: box-shadow 0.3s $transition-DefaultType
    box-shadow: inset 0 0 3px 6px rgba($themeCol-text,1)

  &:hover
    filter: drop-shadow(0px 0px 10px rgba($themeCol-titlesGlow, 0.55))

    &:before
      box-shadow: inset 0 0 3px 6px rgba($themeCol-titles,1)

    .VideoPreview
      &__button
        border-color: $themeCol-iconActive
        background-color: rgba($themeCol-ElementBackgroundAlt, 0.6)

        &:before
          border-color: transparent transparent transparent $themeCol-iconActive

  &__button
    +M_CenterAbsolute
    border: 4px solid $themeCol-text
    border-radius: 50%
    padding: 30px
    transition: border 0.3s $transition-DefaultType, background-color 0.3s $transition-DefaultType

    &:before
      content: ''
      +M_CenterAbsolute
      transition: border 0.3s $transition-DefaultType
      right: calc(50% - 4px)
      border-style: solid
      border-width: 15px 0 15px 22.5px
      border-color: transparent transparent transparent $themeCol-text

</style>
