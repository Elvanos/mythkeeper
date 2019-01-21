<template>
    <div class="appFunctionalityBar">

        <div class="settings -gear" v-tooltip.top-start="`Settings`" @click=toggleDevTools></div>

    </div>
</template>

<script>
   const remote = require('electron').remote;


   export default {
      name: "appFunctionalityBar",
      computed: {
      },
      methods:{
         toggleDevTools(){
            remote.getCurrentWindow().toggleDevTools()
         }
      }
   }
</script>

<style lang="sass" scoped>
    .appFunctionalityBar
        // Display
        display: flex
        position: absolute
        z-index: 3

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

        &.-gear
            // Background
            background-image: url('~@/assets/images/icons/gear-wheel-in-black.svg')

</style>
