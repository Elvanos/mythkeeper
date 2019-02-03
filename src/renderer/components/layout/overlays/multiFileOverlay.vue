<template>
    <div class="multiFilePopup" v-if="isShown">
        <div class="overlayContentWrapper">

            <div class="title">
                Cartography Assets has more than one files connected to this download link.
                <br>
                <br>

                Which file should MythKeeper download?
            </div>

            <div class="buttonWrap">
                <div class="downloadButton" v-for="singleButton in buttonArray" v-on:click="downloadFile(singleButton)">
                    {{singleButton.fileName}} <span class="sprite menu-articles-import"></span>
                </div>

            </div>

            <div class="cancel" @click="closeOverlay">
                Cancel action
            </div>
        </div>
    </div>

</template>

<script>

   export default {
      name: "multiFilePopup",

      computed: {
         isShown() {
            return this.$store.getters.getOverlayMultiFileIsShown

         },
         buttonArray() {
            return this.$store.getters.getOverlayMultiFileArray
         }
      },
      methods:{
         closeOverlay(){
            this.$store.dispatch('overlayMultifileDisable')
            this.$store.dispatch('enableApp')
            this.$awn.warning('Asset installation canceled by the user.')
         },
         downloadFile(downloadData){
            this.$store.dispatch('overlayMultifileDisable')
            this.$store.dispatch('updateMultifileTempData',downloadData)
         }
      }

   }
</script>

<style lang="sass" scoped>

    .multiFilePopup
        position: fixed
        height: 100vh
        width: 100vw
        z-index: 210000
        display: flex
        justify-content: center
        align-items: center
        background-color: rgba(0, 0, 0, 0.8)
        //pointer-events: none

        .overlayContentWrapper
            padding: 50px
            border-radius: 3px
            display: flex
            flex-direction: column
            align-items: center
            background-color: #151516
            color: white
            width: 750px

            .title
                font-size: 18px
                text-align: center
                line-height: 1.6
                padding-bottom: 50px

            .cancel
                background-color: #363638
                border-radius: 5px
                margin-top: 50px
                padding: 10px 30px
                cursor: pointer
                transition: 0.3s $transition-DefaultType background-color

                &:hover
                    background-color: lighten(#363638, 10%)

            .downloadButton
                font-size: 16px
                padding: 10px 0
                width: 500px
                border-radius: 5px
                cursor: pointer
                text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
                transition: 0.3s $transition-DefaultType background-color
                margin-bottom: 20px
                background-color: #41a018

                display: flex
                justify-content: center
                align-items: baseline

                &:hover
                    background-color: lighten(#41a018, 5%)
                span
                    margin-left: 5px
                    filter: drop-shadow(1px 1px 0 #000)
                    cursor: pointer


</style>
