<template lang="html">
  <div>
    <div class="wiki">
      <h1 id="detailsaboutthemythkeeperjsonfile">
        Details about the mythKeeper.json file
      </h1>

      <h2 id="whatisthejsonfileitsrules">
        What is the ".json" file &amp; its rules
      </h2>

      <p>A ".json" file stands for JavaScript Object Notation: It is a data format file used to reliably and easily transfer data around between different programs. Mythkeeper uses this format because it is one of the most common data formats in the world and is easy to edit even for a non-technically capable user who can follow a few simple rules.</p>

      <p>
        <q-btn
          outline
          :ripple="false"
          class="q-mt-md"
          color="primary"
          @click="openURL('https://www.w3schools.com/whatis/whatis_json.asp')"
        >
          Read about the basics of JSON formatting and rules
        </q-btn>
      </p>


      <h2 id="mythkeeperjsondocumentation">
        mythKeeper.json details & interactive editor
      </h2>

      <p><strong>This part assumes you are either familiar with JSON format or read through the previous section thoroughly!</strong></p>

      <h3>
        An editable example of the config file.
      </h3>

      <p>
        <codemirror
          v-model="MKConfig"
          :options="cmOptions"
        />
      </p>

      <h3>
        mythKeeper.json documentation - Code version
      </h3>

      <p>
        <codemirror
          v-model="MKconfigDocs"
          :options="cmOptionsDocs"
        />
      </p>

      <h3>
        mythKeeper.json documentation - Image version
      </h3>

      <p>
        <q-btn
          outline
          :ripple="false"
          class="q-mt-md"
          color="primary"
          @click="openURL('https://i.imgur.com/U1HewHo.png')"
        >
          View the file in image form online
        </q-btn>
      </p>
    </div>
  </div>
</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop } from "vue-property-decorator"


@Component
export default class ConfigFileGuide extends BaseClass {

  cmOptions = {
    tabSize: 4,
    mode: "text/javascript",
    theme: "monokai",
    line: true,
    lineWrapping: true
  }

  cmOptionsDocs = {
    tabSize: 4,
    mode: "text/javascript",
    theme: "monokai",
    line: true,
    lineWrapping: true,
    readOnly: "nocursor"
  }

  MKConfig = `
    {
      "basicInformation": {

        "name": "Your Item Name",

        "version": "1.0",

        "author": {
          "exists": true,
          "name": "Your author name",
          "mail": "your@email.com",
          "url": "http://www.yourwebsite.com",
          "donationURL": "http://www.yourdonationwebsite.com"
        },

        "distributor": {
          "exists": true,
          "name": "Distributor name",
          "mail": "distributor@email.com",
          "url": "http://www.distributorwebsite.com",
          "donationURL": "http://www.distributordonationwebsite.com"
        },

        "commercialUse": true,

        "commercialURL": false,

        "license": {
          "hasLicense": true,
          "type": "CC BY 4.0",
          "localFile": false,
          "externalLink": true,
          "commentary": false
        },

        "tags": [
          "tag1",
          "tag2"
        ],

        "description": "My awesome pack of awesomeness<br>It is really good!"
      }
    }
  `

  MKconfigDocs:string= `
  {
    "basicInformation": {

        // Name of your asset. We suggest filling this.
        "name": "Elvanos - Cliffs",

        // A version number enclosed in quotes. Can be any number you desire. Mostly to help both you and the user to figure out which version of your asset they have installed.
        "version": "2.0",

        "author": {

            // Can be either false or true, depending on if the author is known or not. This option does not use quotes.
            "exists": true,

            // Name of the author.
            "name": "Elvanos",

            // E-mail of the author. Can be set to false if no email is provided; in which case, quotes are to be omitted.
            "mail": "elvanos@testerino.com",

            // Website of the author. Can be set to false if no url is provided; in which case, quotes are to be omitted.
            "url": "https://www.patreon.com/elvanos",

            // Donation website of the author. Can be set to false if no url is provided; in which case, quotes are to be omitted.
            "donationURL": "https://www.patreon.com/elvanos"
        },
        "distributor": {
            // Can be either false or true, depending on if the distributor is known or not. This option does not use quotes.
            "exists": true,

            // Name of the distributor.
            "name": "Elvanos",

            // E-mail of the distributor. Can be set to false if no email is provided; in which case, quotes are to be omitted.
            "mail": "elvanos@testerino.com",

            // Website of the distributor. Can be set to false if no url is provided; in which case, quotes are to be omitted.
            "url": "https://www.patreon.com/elvanos",

            // Donation website of the distributor. Can be set to false if no url is provided; in which case, quotes are to be omitted.
            "donationURL": "https://www.patreon.com/elvanos"
        },

        // Can be either ture or false depending if the item can be used commercially or not.
        "commercialUse": true,

        // If the author/distributor offers a paid version of the items, the url can be provided here. Otherwise should be set to false if no url is provided; in which case, quotes are to be omitted.
        "commercialURL": false,

        "license": {

            // Can be either true or false based on if the item has any license provided or not. This option does not use quotes.
            "hasLicense": true,

            // Type of license provided for the item.
            // List of currenbtly supported automatic license:
              // CC BY 4.0
              // CC BY-SA 4.0
              // CC BY-ND 4.0
              // CC BY-NC 4.0
              // CC BY-NC-SA 4.0
              // CC BY-NC-ND 4.0
            // Any other types Can be also included, but Mythkeeper will be unable to automatically match them to the proper web licenses, in which case the author/distributor either needs Google search for it or a local version of the license needs to be packed with the item.
            // Otherwise should be set to false if no url is provided; in which case, quotes are to be omitted.
            "type": "CC BY 4.0",

            // Can be either true or false based on if the item has a license file packed with it or not. This option does not use quotes.
            // "localFile" and "externalLink" CAN NOT be set to true at the same time!
            "localFile": false,

            // Can be either true or false based on if a web version of the license should be provided instead. This option does not use quotes.
            // "localFile" and "externalLink" CAN NOT be set to true at the same time!
            "externalLink": true,

            // Can be either true or false based on if the item has a commentary file packed with it or not. This option does not use quotes.
            "commentary": true
        },

        // A list of tags belonging to the items; any number is allowed, but we don't suggest over 6-10.
        // The last tag is not to have the "," symbol behind it!
        // If NO tags are provided, please just fill in "[]" and leave it empty. DO NOT delete the whole thing!
        "tags": [
            "terrain",
            "cliffs",
            "texture",
            "tints",
            "stylized",
            "colorable",
            "non-colorable"
        ],

        // A description of the item. Accepts HTML tags like <br>.
        // Please keep in mind that the text has to minimized - you MAY NOT use line breaks for the purposes of the config file!
        "description": "A cliff pack with hand-drawn outlines and textured backgrounds; mostly made for Wonderdraft (comes packed via the Wonderdraft system), but usable anywhere else (all files come as PNGs).<br><br>Comes in 6 color tints:<br>- Default<br>- Default Bleak<br>- Arctic<br>- Arctic Bleak<br>- Sandy<br>- Vegetation<br><br>On top of it, also contains a black/white version for custom Wonderdraft coloring - fully functional!<br><br>Created in mind to best work with the following theme: https://www.cartographyassets.com/assets/elvanoss-wonderdraft-theme-ralia.50/"
    }
  }
`
}
</script>


<style lang="sass">
  @import '../../assets/sass/globals'

  .wiki
    margin: 0 20px 50px 20px
    font-size: 15px

    h1
      font-family: Frozito,sans-serif
      font-size: 45px
      letter-spacing: 1.2px
      font-weight: 600
      margin: 30px 0
      line-height: 1.4
      color: $themeCol-titles

    h2
      font-size: 34px
      font-weight: 500
      margin: 45px 0 15px
      line-height: 1.4
      color: $themeCol-titlesGlow


    h3
      font-size: 22px !important
      margin: 0 0 0 10px !important

    > p
      margin-left: 30px

    > ul
      margin-left: 10px

    li
      margin-top: 5px
      margin-bottom: 5px


</style>

<style lang="sass">
  .CodeMirror
    height: auto !important

    .CodeMirror-vscrollbar
      display: none !important
</style>
