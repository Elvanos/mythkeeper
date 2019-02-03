<template>
    <div class="imageZoom" v-if="isImageZoomedIn" v-on:click="closeZoom">

        <div class="inner">
            <img :src="imgSrc">
        </div>


    </div>
</template>

<script>

   export default {
      name: "imageZoom",
      components: {},
      computed: {
         isImageZoomedIn: function () {
            return this.$store.getters.getOverlayZoomState
         },
         imgSrc: function () {
            return this.$store.getters.getOverlayZoomSRC
         }
      },
      methods: {
         closeZoom: function () {
            this.$store.dispatch('overlayDisableZoom')
         }
      }

   }
</script>

<style lang="sass" scoped>
    .imageZoom
        position: fixed
        height: 100vh
        width: 100vw
        z-index: 190000
        display: flex
        justify-content: center
        align-items: center
        background-color: rgba(0, 0, 0, 0.85)
        cursor: zoom-out
        overflow: auto
        +M_scrollbars($size: 10px, $foreground-color: #444342)

        *
            cursor: zoom-out

        .inner
            img
                max-width: 100%

</style>
