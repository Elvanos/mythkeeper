<template lang="pug">
  .TaskList

    // Task list control button
    div(
      :class="[\
        'TaskList__counter',\
        {'-hasTasks': taskList.length > 0}\
      ]"
      @click='toggleTaskList')

      | {{ taskList.length }}

      q-tooltip(
        v-if='!taskListVisibility'
        :delay="300"
        transition-show="jump-down"
        transition-hide="jump-up")

        b Toggle task list with a click.

        template(v-if='taskList.length > 0')
          br
          br
          b Current tasks:
          br

          table
            tr(
              v-for='task in taskList'
              :key='task.uniqueTaskID')

              td {{ task.progress }}
                template(v-if="typeof task.progress !== 'string'") %

              td
                | |&nbsp;&nbsp;&nbsp;{{ task.taskDescription }}:&nbsp;
                b {{ task.taskName }}

    // Task list content
    transition(
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut")

      div(
        v-show='taskListVisibility === true'
        class="TaskList__inner")

        .TaskList__inner__noTasks(v-if='taskList.length === 0')
          | There are currently no tasks running

        .TaskList__inner__title(v-if='taskList.length > 0')
          | Tasks

        .TaskList__inner__scrollableElement(v-if='taskList.length > 0')

          .TaskList__inner__scrollableElement__task(
            v-for='task in taskList'
            :key='task.uniqueTaskID')

            .TaskList__inner__scrollableElement__task__text

              span.TaskList__inner__scrollableElement__task__text__description
                | {{ task.taskDescription }}:

              span.TaskList__inner__scrollableElement__task__text__name
                | {{ task.taskName }}

              .TaskList__inner__scrollableElement__task__text__progress
                | {{ task.progress }}
                template(v-if="typeof task.progress !== 'string'") %

            template(
              v-if="typeof task.progress !== 'string'"
            )
              q-linear-progress(
                :value="task.progress/100"
                )

</template>

<script lang="ts">
//Base class
import BaseClass from "@/scripts/classes/classBase"

// Interfaces
import taskInterface from "@/scripts/interfaces/_interfaceTask"

// Decorators & Vue base + VUEX Decorators
import { Component, Watch } from "vue-property-decorator"
import { Getter, Action } from "vuex-class"


@Component
export default class TaskList extends BaseClass {

  taskList : taskInterface[] = []

  taskListVisibility: boolean = false


  @Watch("storeGetTaskList", { immediate: true, deep: true })
  updateTaskList(){
    // Load tasklist into local data and refresh it if it changes
    this.taskList = this.storeGetTaskList
  }

  toggleTaskList(){

    // Hide Task list
    if(this.taskListVisibility){
      this.taskListVisibility = false
    }

    // Show task list
    else{
      this.taskListVisibility = true
    }

  }



}

</script>

<style lang="sass">
@import '../../assets/sass/globals'

.TaskList
  -webkit-app-region: no-drag
  position: fixed
  right: 25px
  top: 28px
  z-index: 10

  *
    -webkit-app-region: no-drag


  &:before
    border-radius: 8px

  &__counter
    position: absolute
    right: -15px
    top: -15px
    z-index: 2

    display: flex
    justify-content: center
    align-items: center
    min-width: 30px
    height: 30px
    padding: 0 2.5px

    transition: 0.3s $transition-DefaultType color, 0.3s $transition-DefaultType border, 0.3s $transition-DefaultType filter
    background-color: $themeCol-taskBG
    border: 2px solid rgba($themeCol-text, 0.5)
    color: rgba($themeCol-text, 0.5)
    font-size: 18px
    font-weight: 600

    filter: inherit
    cursor: pointer

    &.-hasTasks
      color: $themeCol-titles
      border-color: $themeCol-titles

      &:hover
        filter: drop-shadow(0px 0px 10px rgba($themeCol-iconActive, 1))


  &__inner
    +MK_elementBackground('../../assets/images/MKbackgroundElements.png')
    border-radius: 10px
    box-shadow: 3px 3px 19px rgba(0, 0, 0, 0.68)
    border: 2px solid $themeCol-elementBorder

    min-width: 350px
    padding: 15px 20px 25px 20px
    display: flex
    flex-direction: column

    // Sidebar + side padding + this element padding
    max-width: calc(100vw - 150px - 50px - 30px)

    z-index: 1
    position: relative
    max-height: calc(100vh - 75px)

    &:before
      border-radius: 8px

    &__title
      font-family: Frozito, sans-serif
      font-size: 35px
      line-height: 1.3
      z-index: 5
      color: $themeCol-titles

    &__noTasks
      font-size: 16px
      text-align: center
      font-weight: 600
      color: $themeCol-text
      padding: 20px 20px 10px
      opacity: 0.8

    &__scrollableElement
      overflow: auto
      max-height: 100%
      padding-right: 15px
      margin-right: -10px

      +M_scrollbars(5px, $themeCol-titles,rgba($themeCol-text, 0.5))

      &__task
        margin-bottom: 20px

        &:last-child
          margin-bottom: 0

        &__text
          position: relative
          margin-bottom: 5px
          padding-right: 70px

          font-size: 16px
          color: $themeCol-taskText

          &__description
            opacity: 0.8
            margin-right: 5px

          &__name
            font-weight: 700

          &__progress
            font-size: 14px
            opacity: 0.7

            +M_VerticalCenterAbsolute
            right: 0


  // Adjust vendor
  .slideUp
    transition: 0.6s $transition-DefaultType opacity, 0.6s $transition-DefaultType height !important
    opacity: 0.3
    &[aria-expanded='true']
      opacity: 1

</style>
