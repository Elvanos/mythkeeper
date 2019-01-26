<template>


    <div class="landingHelpComponent">

        <div class="inner">


            <div class="intro" v-if="!this.guideOpened">
                <h1>
                    Welcome to the Mythkeeper,
                </h1>
                <h4>
                    A fan-made asset manager for an awesome map making software called Wonderdraft!
                </h4>

                <br>


                <h4>
                    I hope you will enjoy this software as much as I enjoyed making it, minus all the blood and tears
                    poured into it, and it will help you make even better map than you have been making until now!
                </h4>
                <h3>
                    - Elvanos
                </h3>

                <br>
                <br>
                <br>


                <h2 style="color: #db0000">IMPORTANT: Since this is a beta version, I suggest backing up your whole
                    Wonderdraft user folder manually BEFORE using this.</h2>

                <br>
                <br>
                <br>

                <div class="guideWrapper">
                    <div class="guideButton" v-on:click="openGuide('userGuide')">
                        User guide
                    </div>
                    <div class="guideButton" v-on:click="openGuide('authorGuide')">
                        Asset author guide
                    </div>
                    <div class="guideButton" v-on:click="openGuide('mythKeeperJson')">
                        Config file guide
                    </div>
                </div>

            </div>

            <div class="guideBlock" v-if="this.guideOpened">
                <div class="guideButton -inlineBLock" v-on:click="closeGuide">
                    Close guide
                </div>

                <component v-on:guide-change="openGuide" :is="activeGuide" class="guideSingleWrapper">
                    {{activeGuide}}
                </component>

                <div class="guideButton -inlineBLock" v-on:click="closeGuide">
                    Close guide
                </div>


            </div>


        </div>


    </div>
</template>

<script>
   import userGuide from './guides/userGuide'
   import mythKeeperJson from './guides/mythKeeperJson'
   import authorGuide from './guides/authorGuide'



   export default {
      name: "landingHelpComponent",
      components: {
         userGuide,
         mythKeeperJson,
         authorGuide
      },
      data: function () {
         return {
            guideOpened: false,
            currentGuide: null

         }
      },
      computed: {
         activeGuide() {
            return this.currentGuide
         }
      },
      methods: {
         openGuide: function (currentGuide) {
            this.guideOpened = true
            this.currentGuide = currentGuide
         },
         closeGuide: function () {
            this.guideOpened = false
         }
      }
   }
</script>

<style lang="sass" scoped>
    .landingHelpComponent
        $outerPadding: 50px
        display: flex
        background-color: rgba(43, 43, 43, 0.9)
        position: fixed
        z-index: 200
        top: 0
        right: 0
        bottom: 0
        width: calc(100vw - 460px)
        padding: $outerPadding $outerPadding $outerPadding $outerPadding
        -webkit-backface-visibility: hidden
        overflow-x: visible
        overflow-y: auto
        +M_scrollbars($size: 10px, $foreground-color: #444342)



        .inner
            margin: auto
            max-width: 1200px
            border: 10px solid
            padding: 50px
            border-image: url('~@/assets/images/backgrounds/topBarBackground.jpg') 50 round
            background-color: rgb(50, 50, 50)
            color: white

        .guideWrapper
            display: flex
            justify-content: space-around

        .guideSingleWrapper
            padding: 50px 0


        .guideButton
            text-align: center
            cursor: pointer

            font-family: 'Elementary Gothic', sans-serif
            font-size: 14px
            font-weight: 500
            text-shadow: 0 0 10px rgba(228, 228, 228, 0.75)
            color: #e4e4e4
            transition: $transition-DefaultType 0.3s all, $transition-DefaultType 0.3s color, $transition-DefaultType 0.3s margin, linear 0.3s width

            letter-spacing: 4px
            white-space: nowrap

            // Sizing & positioning
            padding: 15px 30px
            //width: 240px
            margin-left: 0

            // Background
            background-image: url('~@/assets/images/backgrounds/buttonBackground.png')
            background-size: 250px 65px

            // Border
            border: 1px solid rgba(45, 21, 5, 0.7)

            // Other
            cursor: pointer
            border-radius: 3px
            // box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75)
            filter: sepia(65%)

            &:hover
                // Text settings
                color: #ffffff

                // Other
                filter: sepia(0%)

            &.-inlineBLock
                display: inline-block
                float: right

</style>
