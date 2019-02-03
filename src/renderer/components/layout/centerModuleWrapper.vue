<template>
    <div class="centerModuleWrapper" id="centerModuleWrapper">

        <component :is="activeModule">
            {{activeModule}}
        </component>


    </div>
</template>

<script>

   import assets from '../modules/assets/assets'
   import themes from '../modules/themes/themes'
   import profiles from '../modules/profiles/profiles'


   export default {
      name: "centerModuleWrapper",
      components: {
         assets,
         themes,
         profiles
      },
      computed: {
         activeModule() {
            return this.$store.getters.getCurrentModule
         }
      }

   }
</script>

<style lang="sass" scoped>
    .centerModuleWrapper
        overflow: auto
        margin-top: 63px
        +M_scrollbars($size: 10px, $foreground-color: #444342)

</style>
