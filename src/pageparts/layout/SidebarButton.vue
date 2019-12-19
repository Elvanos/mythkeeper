<template lang="pug">
  div(
    v-if='!disabled || (storeGetAreDisabledModulesShowing && disabled)'
    :class="[\
      { '-disabled': computedDisabledButton || storeGetTaskList.length !== 0},\
      'SidebarButton',\
      computedActiveButton\
    ]"
    @click='storeSetCurrentModule')

    div(:class='computedModuleName')

    q-tooltip(
      v-if='computedDisabledButton'
      :delay="300"
      anchor="center right"
      self="center left"
      transition-show="jump-right"
      transition-hide="jump-left")

      | Module unavailable.
      br
      | Consider re-checking if Mythkeeper settings are set properly (icon below).

    | {{ heading }}

</template>

<script lang="ts">
//Libs
import fs from "fs-extra"
const isValidPath = require("is-valid-path")

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop, PropSync } from "vue-property-decorator"
import { Getter,Action } from "vuex-class"


@Component
export default class SidebarButton extends BaseClass {

  @Prop() readonly title!: string
  @Prop() readonly heading!: string
  @Prop({default: "disabled"}) readonly modulename !: string

  @Getter storeGetActiveModule !: string
  @Action storeSetActiveModule !: (args: string) => void

  @Action storeSetOverlayVisibility !: (args: boolean) => void

  @Getter storeGet_PATH_userFolder !: string

  @Getter storeGetIsProfilesModuleAllowed !: boolean

  @Getter storeGetAreDisabledModulesShowing !: boolean

  disabled : boolean = false
  get computedDisabledButton(){
    if (
      // If path is valid
      !fs.existsSync(this.storeGet_PATH_userFolder)
      ||
      // If the path is NOT a valid folder path
      !isValidPath(this.storeGet_PATH_userFolder)
      ||
      // If Profiles module isn't allowed in settings
      (this.modulename === "profiles" && !this.storeGetIsProfilesModuleAllowed ))
    {
      this.disabled = true
      return "-disabled"
    }
    else{
      this.disabled = false
      return false
    }
  }

  get computedActiveButton(){
    if (this.storeGetActiveModule === this.modulename )
    {return "-active"}
    else
    {return false}
  }


  get computedModuleName () {
    return "SidebarButton__icon SidebarButton__icon--" + this.modulename
  }

  storeSetCurrentModule(){
    if (!this.disabled) {
      this.storeSetActiveModule(this.modulename)
      this.storeSetOverlayVisibility(false)

    }
  }


}

</script>

<style scoped lang="sass">
@import '../../assets/sass/globals'

.SidebarButton
  color: $themeCol-text
  font-size: 18px
  font-weight: 700

  display: flex
  flex-direction: column
  align-items: center
  width: 100px

  margin-bottom: 35px

  cursor: pointer
  transition: filter 0.3s $transition-DefaultType, color 0.3s $transition-DefaultType

  +Q_customMaxHeight(830px)
    font-size: 16px
    margin-bottom: 30px

  &.-disabled
    color: rgb(84, 84, 84) !important
    filter: none !important
    cursor: not-allowed

    .SidebarButton
      &__icon
        background-color: rgb(84, 84, 84) !important

  &:hover
    filter: drop-shadow(0px 0px 10px rgba($themeCol-titlesGlow, 0.55))
    color: $themeCol-titlesGlow

    .SidebarButton
      &__icon
        background-color: $themeCol-iconGlow

  &.-active
    color: $themeCol-titles !important

    .SidebarButton
      &__icon
        background-color: $themeCol-iconActive !important

  &__icon
    background-repeat: no-repeat
    background-size: contain
    background-position: center
    margin-bottom: 7px
    position: relative
    transition: background-color 0.3s $transition-DefaultType
    mask-repeat: no-repeat
    mask-size: contain
    mask-position: center
    width: 100%

    background-color: #fff


    &--assets
      mask-image: url(../../assets/images/moduleAssets.png)
      height: 45px

      +Q_customMaxHeight(830px)
        height: 35px

    &--themes
      mask-image: url(../../assets/images/moduleThemes.png)
      height: 40px

      +Q_customMaxHeight(830px)
        height: 30px

    &--profiles
      mask-image: url(../../assets/images/moduleProfiles.png)
      height: 40px

      +Q_customMaxHeight(830px)
        height: 30px

    &--worldbuilding
      mask-image: url(../../assets/images/moduleWorldbuilding.png)
      height: 45px

      +Q_customMaxHeight(830px)
        height: 35px

    &--mapping
      mask-image: url(../../assets/images/moduleMapping.png)
      height: 45px

      +Q_customMaxHeight(830px)
        height: 35px

    &--caclient
      mask-image: url(../../assets/images/logoCaClient.svg)
      height: 45px

      +Q_customMaxHeight(830px)
        height: 35px

</style>
