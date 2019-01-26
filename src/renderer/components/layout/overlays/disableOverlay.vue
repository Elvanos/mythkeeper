<template>
    <div class="disableOverlay" v-if="appStatus === false">
        <div class="overlayContentWrapper">
            <div class="spinnerWrapper">
                <Spinner name="circle"/>
            </div>
            <div class="overlayMessage">Processing request</div>
        </div>

    </div>
</template>

<script>

   export default {
      name: "disableOverlay",
      components: {},
      computed: {
         appStatus() {
            return this.$store.getters.getAppStatus
         }
      },
      methods: {
         closeZoom: function () {

         }
      }

   }
</script>

<style lang="sass" scoped>
    .disableOverlay
        position: fixed
        height: 100vh
        width: 100vw
        z-index: 200000
        display: flex
        justify-content: center
        align-items: center

        .overlayContentWrapper
            background-image: url('~@/assets/images/backgrounds/topBarBackground.jpg')
            background-size: cover
            padding: 50px
            border-radius: 5px
            display: flex
            flex-direction: column
            align-items: center
            border: 2px solid rgba(0, 0, 0, 0.5)

            .overlayMessage
                font-family: "Elementary Gothic", sans-serif
                font-size: 18px
                font-weight: 600
                color: #fff
                letter-spacing: 3px
                filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7))

            .spinnerWrapper
                margin-bottom: 20px
                > div
                    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))
                    color: #dcdcdc
                    width: 75px
                    height: 75px


</style>
