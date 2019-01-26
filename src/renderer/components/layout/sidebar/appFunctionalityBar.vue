<template>
    <div class="appFunctionalityBar">



        <div class="settings -info" v-tooltip.top-start="`Open the starting guide`" @click=loadGuide></div>

        <div class="settings -refresh" v-tooltip.top-start="`Refresh the whole app`" @click=refreshApp></div>

        <div class="settings -gear" v-tooltip.top-start="`Wanna peak under the hood? <br> This toggles developer tools`" @click=toggleDevTools></div>

    </div>
</template>

<script>
   const remote = require('electron').remote;


   export default {
      name: "appFunctionalityBar",
      computed: {
      },
      methods:{
         refreshApp: function () {
            remote.getCurrentWindow().reload()
         },
         toggleDevTools(){
            remote.getCurrentWindow().toggleDevTools()
         },
         loadGuide(){
            this.$store.dispatch('openSidebar')
            this.$store.dispatch('setCurrentModule', false)
         }
      }
   }
</script>

<style lang="sass" scoped>
    .appFunctionalityBar
        // Display
        z-index: 9999999
        display: flex
        position: absolute

        // Sizing & positioning
        height: 30px
        bottom: 0
        left: 0
        right: 0
        align-items: center

        // Background
        background-color: #444342

    .settings
        // Sizing & positioning
        width: 15px
        height: 15px
        cursor: pointer
        margin: 15px

        // Background
        background-size: contain

        &.-info
            // Background
            background-image: url('~@/assets/images/icons/info.svg')

        &.-gear
            // Background
            background-image: url('~@/assets/images/icons/gear-wheel-in-black.svg')

        &.-refresh
            // Background
            background-image: url('~@/assets/images/icons/refresh-button.svg')

</style>
