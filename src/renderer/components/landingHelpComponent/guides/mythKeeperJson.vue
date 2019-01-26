<template xmlns="http://www.w3.org/1999/html">


    <div>
        <p><strong><span class="link"
                         v-on:click="openGuideOnParent('authorGuide')">Back to Mythkeeper creator guide</span></strong>
        </p>

        <h1 id="detailsaboutthemythkeeperjsonfile">Details about the mythKeeper.json file</h1>

        <h2 id="whatisthejsonfileitsrules">What is the ".json" file &amp; its rules</h2>

        <p>A ".json" file stands for JavaScript Object Notation: It is a data format file used to reliably and easily
            transfer data around between different programs. Mythkeeper uses this format because it is one of the most
            common data formats in the world and is easy to edit even for a non-technically capable user who can follow
            a few simple rules.</p>

        <p>
            <span class="link" v-on:click="openURL('https://www.w3schools.com/whatis/whatis_json.asp')">
           Read about the basics of JSON formatting and rules</span></p>

        <h2 id="mythkeeperjsondocumentation">mythKeeper.json documentation</h2>

        <p><strong>This part assumes you are either familiar with JSON format already or read through the previous
            section already!</strong></p>

        <p>An image link to the full explanation how to deal with each line of
            the file properly
            <img class="zoomIn" v-on:click="zoomImage" src="~@/assets/images/guides/mythkeeperjson/json.jpg">
        </p>
    </div>


</template>

<script>

   export default {
      name: "mythKeeperJson",

      data: function () {
         return {}
      },
      methods: {
         openURL(link) {
            this.$electron.shell.openExternal(link)
         },
         openGuideOnParent(guide) {
            this.$emit('guide-change', guide)
         },
         zoomImage(event){
            const targetElementSrc = event.target.src
            this.$store.dispatch('overlayZoomSetSRC', targetElementSrc).then(() => {
               this.$store.dispatch('overlayEnableZoom')
            })
         }
      }

   }
</script>

<style lang="sass" scoped>

    span.link
        color: #2fdaff
        cursor: pointer

    p
        line-height: 1.4

    li
        margin: 5px 0

    img
        margin: 20px 0
        border: 1px solid black
        border-radius: 5px
        display: block
        max-width: 100%

        &.zoomIn
            transition: $transition-DefaultType 0.3s all
            cursor: zoom-in

            &.isZoomed
                z-index: 10
                position: absolute
                top: 0
                left: -2px
                width: 100%
                cursor: zoom-out
</style>


