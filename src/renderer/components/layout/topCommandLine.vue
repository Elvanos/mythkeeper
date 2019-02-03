<template>


    <component v-if="hasModule"
               class="topCommandLine"
               :is="activeModule"
               :class="{ '-collapsed': !isOpened}">
        {{activeModule}}
    </component>

</template>

<script>
   import assetsCL from '../modules/assets/assetsCL'
   import themesCL from '../modules/themes/themesCL'
   import profilesCL from '../modules/profiles/profilesCL'

   export default {
      name: "topCommandLine",
      components: {
         assetsCL,
         themesCL,
         profilesCL
      },
      computed: {
         hasModule() {
            return this.$store.getters.getCurrentModule
         },
         activeModule() {
            return this.hasModule + 'CL'
         },
         isOpened() {
            return this.$store.getters.getAppBarStatus
         }
      },
   }
</script>

<style lang="sass" scoped>
    .topCommandLine
        position: absolute
        background-image: url('~@/assets/images/backgrounds/topBarBackground.jpg')
        background-size:
        //height: 30px
        padding: 10px 15px
        left: 0
        right: 0
        z-index: 1
        top: 0
        margin-top: -30px
        border-bottom: 1px solid rgba(45, 21, 5, 0.7)
        box-shadow: 0 5px 30px 0px rgba(0, 0, 0, 0.5)

        transition: 0.6s $transition-DefaultType margin

        display: flex
        justify-content: flex-end

        &.-collapsed
            margin-top: 0

</style>
