<template>
    <div class="caOverlay" v-if="activeCAModule !== false">
        <div
                v-if="false"
                class="closeTrigger"
             v-on:click="closeCAOverlay">

        </div>

        <div class="closeButton" v-on:click="closeCAOverlay" v-tooltip.bottom-end="`Close CA client`">
            <div class="sprite general-remove"></div>
        </div>
        <div class="inner">
            <component class="content" :is="activeCAModule">
                {{activeCAModule}}
            </component>
        </div>

    </div>
</template>

<script>

    import assetsCA from '../../modulesCA/assetsCA/assetsCA'

   export default {
      name: "caOverlay",
      components: {
         assetsCA
      },
      computed: {
         activeCAModule() {
            return this.$store.getters.getCurrentModuleCA
         }
      },
      methods: {
        closeCAOverlay(){
           this.$store.dispatch('setCurrentModuleCA', false)
        }
      }

   }
</script>

<style lang="sass" scoped>
    .caOverlay
        position: fixed
        height: 100vh
        width: 100vw
        z-index: 10000
        background-color: rgba(0, 0, 0, 0.85)
        display: flex
        justify-content: center

        .closeTrigger
            width: 100%
            height: 100%
            position: relative
            z-index: 5

        .closeButton
            position: fixed
            right: 45px
            top: 45px
            cursor: pointer
            z-index: 7
            padding: 5px

            *
                cursor: pointer

        .inner
            position: absolute
            z-index: 6
            width: calc(100vw - 300px)
            margin: 50px auto 50px auto
            padding: 50px
            max-height: calc(100vh - 200px)
            overflow-y: scroll
            overflow-x: auto
            +M_scrollbars($size: 10px, $foreground-color: #444342)


            &:before
                content: ''
                +M_AbsoluteFullCover
                left: 10px
                bottom: 5px
                position: fixed
                background-image: url('~@/assets/images/backgrounds/caClientBackground.png')
                background-position: center
                background-size: cover
                z-index: 1
                filter: blur(8px) sepia(25%)
                margin: 55px 115px 55px 105px

            &:after
                content: ''
                pointer-events: none
                +M_AbsoluteFullCover
                position: fixed
                z-index: 11
                margin: 50px 110px 50px 100px
                border: 10px solid
                border-right: none
                border-image: url('~@/assets/images/backgrounds/topBarBackground.jpg') 50 round


            .content
                position: relative
                z-index: 11
                overflow: hidden
                min-height: calc(100vh - 200px)

</style>

