<template lang="html">
  <div class="wiki">
    <h1 id="mythkeeper-author-guide">
      Mythkeeper author guide
    </h1>
    <h2 id="foreword">
      Foreword
    </h2>
    <p>Hello and welcome to the Mythkeeper author guide. </p>
    <p>This guide is meant primarily for assets, theme and brush authors and/or distributors who wish to publicize their work in a way that is compatible with Mythkeeper software.</p>
    <p>In this guide, you will detailed information about the structure of the folders and other useful information accompanied by image-guides and examples.</p>
    <p>Mythkeeper is a fairly versatile software when it comes to processing your packed items:</p>
    <ul>
      <li>Assets can be packed in three different ways in order to make them compatible. However, only one of the methods is recommended and we strongly discourage to even consider using the last one at all.</li>
      <li>Themes can also be packed in three different ways - yet again; one is recommended and the others not so much.</li>
      <li>Brushes should be packed exclusively via the described method below as they lack the rigid folder structure of assets or the unique file formats of themes - therefore a special approach is needed.</li>
      <li>We also added a possibility to pack whole packages with multiple assets, themes and brushes. However, if this feature is used, a very strict approach must be followed to ensure the software will be able to process it.</li>
    </ul>
    <h2 id="conventions-rules">
      Conventions &amp; rules
    </h2>
    <ul>
      <li><strong>Mythkeeper can handle ONLY .zip file formats. DO NOT use .rar, .tar or any similar.</strong></li>
      <li>
        <strong>When naming your top-level folder, make ABSOTELLY 100% CERTAIN that you name it something no other author EVER should - we recommend a combination of content and the author&#39;s name:</strong><ul>
          <li>Examples (author first, item name second):</li>
          <li>&quot;Elvanos - Cliffs&quot;</li>
          <li>&quot;Zalkenai - Orc Settlements&quot;</li>
          <li>&quot;Nexoness - Avoro, Gates of hell additions&quot;</li>
        </ul>
      </li>
      <li><strong>Naming your low-level folder in a similar manner as the top folder.</strong></li>
      <li>
        <strong>When packing assets, use method 1 for packaging and avoid using method 2 if you can.</strong><ul>
          <li>Never use method 3. We only mention it in order to show people how NOT to pack their items.</li>
        </ul>
      </li>
    </ul>
    <p>
      <strong>A picture explaining what we mean by &quot;low&quot; and &quot;top&quot; level folders</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MK-folders.jpg">
    </p>

    <h2 id="how-to-pack-assets">
      How to pack - ASSETS
    </h2>
    <h3 id="method-1-recommended">
      Method 1 - Recommended
    </h3>
    <p>Packing your whole asset pack inside another assets folder in order to be extracted directly to Wonderdraft main user data folder.</p>
    <ul>
      <li>
        <p><strong>You may pack multiple asset folders inside the &quot;assets&quot; folder. Mythkeeper will allow selective installation of the zip&#39;s contents to the user.</strong></p>
      </li>
      <li>
        <p><strong>If you pack your asset this way, please keep in mind that MK will ONLY unpack the FIRST directory it finds inside the assets folder and will delete all non-directory files. If you pack any licenses, install notes or anything of such kind next to the folder, it will get lost along the way!</strong></p>
      </li>
    </ul>

    <p>
      <strong>A picture of what your asset folder should look like</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod1.jpg">
    </p>

    <p>
      <strong>A picture of what the zip folder should look like if you were to open it manually</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod1-unpack.jpg">
    </p>

    <h3 id="method-2">
      Method 2
    </h3>
    <p>Packing your whole asset along with the top-level directory of it inside a ZIP archive.</p>
    <p>
      <strong>A picture of what your asset folder should look like</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod2.jpg">
    </p>

    <p>
      <strong>A picture of what the zip folder should look like if you were to open it manually</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod2-unpack.jpg">
    </p>
    <h3> Method 3 - Not recommended (do not do this)</h3>
    <p>Packaging the asset contents without a top-level directory.</p>
    <ul>
      <li>
        <p><strong>We DO NOT suggest this method, it is dangerous and can lead to unforeseen consequences when unpacking!</strong></p>
      </li>
      <li>
        <p><strong>If your asset is packed this way, we HEAVILY suggest adding the top-level directory to make it more stable!</strong></p>
      </li>
    </ul>
    <p>
      <strong>A picture of what your asset folder should look like</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod3.jpg">
    </p>

    <p>
      <strong>A picture of what the zip folder should look like if you were to open it manually</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod3-unpack.jpg">
    </p>
    <h2 id="how-to-pack-themes">
      How to pack - THEMES
    </h2>
    <h3 id="method-1-2">
      Method 1 &amp; 2
    </h3>
    <p>Exactly the same as assets - the sole change is the lack of existence of the sub-folder since themes do not support those.</p>
    <ul>
      <li>
        <p>Method 1 wraps the main theme file with a top-level folder and &quot;themes&quot; folder above it.</p>
        <ul>
          <li><strong>You may pack multiple theme folders inside the &quot;themes&quot; folder. Mythkeeper will allow selective installation of the zip&#39;s contents to the user.</strong></li>
        </ul>
      </li>
      <li>
        <p>Method 2 doesn&#39;t add the &quot;themes&quot; folder, but still adds the top-level folder.</p>
      </li>
    </ul>
    <h3 id="method-3">
      Method 3
    </h3>
    <ul>
      <li>A simple &quot;.wonderdraft_theme&quot; file.</li>
      <li>If you don&#39;t want to, there is no need to package anything specially. Just export the theme out of Wonderdraft and let someone install that file directly thought Mythkeeeer.</li>
    </ul>
    <h2 id="how-to-pack-brushes">
      How to pack - BRUSHES
    </h2>
    <p>Packing brushes is done exactly as method 1 of packing assets, except for the fact, that the &quot;assets&quot; folder is replaced by the &quot;brushes&quot; folder.</p>
    <p><strong>Please note that this is THE ONLY viable method of how to pack brushes since they lack the rigid folder structure of assets.</strong></p>
    <p>
      <strong>A picture of what your brushes folder should look like</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod-brushes.png">
    </p>

    <p>
      <strong>A picture of what the zip folder should look like if you were to open it manually</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod-brushes-unpack.png">
    </p>
    <h2 id="how-to-pack-packages">
      How to pack - PACKAGES
    </h2>
    <p>With the update, Mythkeeper now offers a possibility to pack multiple asset packs, multi themes and/or multi brushes in one big pack. Theoretically, you can ship an unlimited amount of items in one single zip file.</p>
    <p>We believe this will be most useful for collections from the same author or theme makers who wish to pack custom paths, textures, fonts and similar along with their themes.</p>
    <p>However, if you find some other use for this feature, by all means, experiment - only the sky is the limit!</p>
    <p>If you use this option as an author/distributor, please keep in mind that the ONLY method of how to get this work is to hollow method 1 from each of the previously mentions sections.</p>

    <p>
      <strong>A picture of what your package should look like</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod-package.png">
    </p>

    <p>
      <strong>A picture of what the zip folder should look like if you were to open it manually</strong>
    </p>
    <p>
      <img src="@/assets/authorGuide/MKmethod-package-unpack.png">
    </p>


    <h2>The config file and metafiles</h2>
    <h3 id="the-whats-and-whys-">
      The &quot;whats&quot; and &quot;whys&quot;
    </h3>
    <p>MK comes with a custom system of one big config file and a custom directory you can choose to pack along with your items. This gives a number of advantages that both the user and the author (you) will get for investing the extra time to set it up properly:</p>
    <ul>
      <li>You can name your item in any way you want it displayed in the manager. If you do not fill this, it will just show as the directory name.</li>
      <li>
        You may include your author name, so the user knows who made the item and allow your name to be filtered later on once the functionality is added.<ul>
          <li>If you are merely a distributor and not the actual author, you may separately include details about both you and the author.</li>
        </ul>
      </li>
      <li>You may include any contact info in the metafile: A website, an email; even a donation URL - all goes!</li>
      <li>
        You may include the license link or a file in your pack along with information if your item can be used commercially. Alternatively, you can pack a demo version of it and include a link where the user can buy the full version of your item.<ul>
          <li>In case using your item has some additional requirements or you don&#39;t want to you just want to include a commentary - you can! You can pack a separate small TXT or PDF file on top of the license.</li>
        </ul>
      </li>
      <li>
        You may include a preview image of your item that will show the user what to roughly expect (use 250x250px png or jpg image for the best preview experience).<ul>
          <li>You may include a whole gallery of preview images for advanced preview if you want to show a real-world usage of your item in action!</li>
        </ul>
      </li>
      <li>You may include a version of your item so the user can track which version of the item they have installed - very helpful when used in combination with naming your zip files with a version number at the end (elvanos-cliffs-2.0.zip)</li>
      <li>You may also include a description of your item along with tags, so your item is easy to find via a built-in filter functionality.</li>
    </ul>
    <h3 id="an-example-of-a-folder-structure">
      An example of a folder structure
    </h3>
    <p>
      <img src="@/assets/authorGuide/MK-metafiles.jpg">
    </p>
    <h3 id="an-example-of-the-config-file">
      An editable example of the config file
    </h3>

    <p>
      <codemirror
        v-model="MKConfig"
        :options="cmOptions"
      />
    </p>

    <p>If you are having trouble navigating the code, we suggest usingVSCode free text editor for editing.</p>

    <p>
      <q-btn
        outline
        :ripple="false"
        class="q-mt-md"
        color="primary"
        @click="openURL('https://code.visualstudio.com/')"
      >
        Get VSCode from the official website
      </q-btn>
    </p>

    <h3 id="detailed-info-about-the-different-settings-inside-the-config-file">
      Detailed info about the different settings inside the config file
    </h3>

    <p>
      Right next to the author guide on right in the top navigation bar of the guides!
    </p>

    <h2 id="an-example-of-a-fully-packed-asset-that-is-mythkeeper-compatible">
      An example of a fully packed asset that is Mythkeeper compatible
    </h2>

    <p>
      <q-btn
        outline
        :ripple="false"
        class="q-mt-md"
        color="primary"
        @click="openURL('https://www.cartographyassets.com/assets/mk-elvanos-mountain-pack.13/download')"
      >
        An example asset to either get inspired from or to copy the structure from or get inspired by
      </q-btn>
    </p>
  </div>
</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"
// Decorators & Vue base + VUEX Decorators
import {Component} from "vue-property-decorator"


  @Component
export default class AuthorGuide extends BaseClass {


  cmOptions = {
    tabSize: 4,
    mode: "text/javascript",
    theme: "monokai",
    line: true,
    lineWrapping: true
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

}
</script>


<style lang="sass">
  @import '../../assets/sass/globals'

  .wiki
    margin: 0 20px 50px 20px
    font-size: 15px

    h1
      font-family: Frozito, sans-serif
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
