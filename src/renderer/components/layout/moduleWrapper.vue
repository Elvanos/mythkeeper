<template>
    <div class="moduleWrapper">

        <component :is="activeModule">
            {{activeModule}}
        </component>


    </div>
</template>

<script>

   import assets from '../modules/assets/assets'
   import themes from '../modules/themes/themes'
   import profiles from '../modules/profiles/profiles'
   import caClient from '../modules/caClient/caClient'



   export default {
      name: "moduleWrapper",
      components: {
         assets,
         themes,
         profiles,
         caClient
      },
      computed: {
         activeModule() {
            console.log(this.$store.getters.getCurrentModule)
            return this.$store.getters.getCurrentModule
         }
      }

   }
</script>

<style lang="sass" scoped>
    .moduleWrapper
        overflow: auto
        margin-top: 63px
        +M_scrollbars($size: 10px, $foreground-color: #444342)

</style>
