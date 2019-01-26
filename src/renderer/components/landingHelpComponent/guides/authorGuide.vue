<template>
    <div>
        <h1 id="welcometothemythkeeperguideforthecustomassetcreators">Welcome to the Mythkeeper guide for the custom
            asset creators!</h1>

        <p>If you are an artist or a distributor that isn't certain how to pack their assets in order to make it
            compatible with Mythkeeper, this is the place for you!</p>

        <hr/>

        <p><strong>PLEASE KEEP IN MIND that this guide is for custom ASSETS only; Mythkeeper DOES NOT support custom
            themes yet. These will work ONLY for assets that normally go strictly into the "assets" directory!</strong>
        </p>

        <hr/>

        <h2 id="foreword">Foreword</h2>

        <p>Mythkeeper (further mentioned as MK) is a fairly versatile software when it comes to processing your packed
            assets. This means there 3 ways you can pack your assets to make them compatible, however one of the methods
            is preferred. In the same spirit; you can choose how much information you will pack with your asset to
            display to the user.</p>

        <h2 id="conventionsrules">Conventions &amp; rules</h2>

        <ul>
            <li><strong>Mythkeeper can handle ONLY .zip file formats. DO NOT use .rar, .tar or any similar.</strong>
            </li>

            <li><strong>When naming your top-level folder, make sure you name it something no other author will - a
                combination of content and the author's name is the best:</strong>


                <ul>
                    <li>Examples (author first, asset second):</li>

                    <li>"Elvanos - Cliffs"</li>

                    <li>"Zalkenai - Orc Settlements"</li>

                    <li>"Nexoness - Avoro, Gates of hell additions"</li>
                </ul>
            </li>

            <li><strong>Naming your low-level folder in a similar manner as the top folder.</strong></li>

            <li><strong>If possible, use method 1 for packaging and avoid using method 2. Use method 3 only if you are
                absolutely certain it is necessary</strong></li>

            <li><strong>A picture explaining what we mean by "low" and "top"
                level folders</strong>
                <img src="~@/assets/images/guides/authorGuide/MK-folders.jpg" @click="zoomImage" class="zoomIn">
            </li>



        </ul>

        <hr/>

        <h2 id="thethreepackagingmethodsforassets">The three packaging methods for assets</h2>

        <p><strong>Keep in mind that all these methods are viable, but if you aim for the best, most fool-proof method,
            stick to using the first method</strong></p>

        <hr/>

        <h3 id="method1recommended">Method 1 - RECOMMENDED</h3>

        <p>Packing your whole asset along with the top level directory of it inside a ZIP archive.</p>

        <p>The example folder structure in the following picture if one of the compatible assets with the correct folder
            structure.</p>

        <p>A picture of how your asset folder should look like
            <img src="~@/assets/images/guides/authorGuide/MKmethod1.jpg" @click="zoomImage" class="zoomIn">
        </p>


        <p>A picture of what the zip folder should look like if you were to open it manually
            <img src="~@/assets/images/guides/authorGuide/MKmethod1-unpack.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <hr/>

        <h3 id="method2notrecommended">Method 2 - NOT RECOMMENDED</h3>

        <p><strong>We DO NOT suggest this method, it is dangerous and can lead to unforeseen consequences when
            unpacking!</strong></p>

        <p><strong>If your asset is packed this way, we HEAVILY suggest adding the top level directory to make it more
            stable!</strong></p>

        <p>Packaging the asset contents without a top-level directory.</p>

        <p>The example folder structure in the following picture if one of the compatible assets with the correct folder
            structure.</p>

        <p>A picture of what your asset folder should look like
        <img src="~@/assets/images/guides/authorGuide/MKmethod2.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <p>A picture of what the zip folder should look like if you were to open it manually
             <img src="~@/assets/images/guides/authorGuide/MKmethod2-unpack.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <hr/>

        <h3 id="method3">Method 3</h3>

        <p>Packing your whole asset inside another assets folder in order to be extracted directly to Wonderdraft main
            user data folder.</p>

        <p>This way might be familiar mostly to theme makers as themes go into multiple directories.</p>

        <p><strong>If you pack your asset this way, please keep in mind that MK will ONLY unpack the FIRST directory it
            finds inside the assets folder and will delete all non-directory files. If you pack any licenses, install
            notes or anything of such kind next to the folder, it will get lost along the way!</strong></p>

        <p>The example folder structure in the following picture if one of the compatible assets with the correct folder
            structure.</p>

        <p>A picture of what your asset folder should look like
            <img src="~@/assets/images/guides/authorGuide/MKmethod3.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <p>A picture of what the zip folder should look like if you were to open it manually
             <img src="~@/assets/images/guides/authorGuide/MKmethod3-unpack.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <hr/>

        <h2 id="theconfigfileandmetafiles">The config file and metafiles</h2>

        <h3 id="thewhatsandwhys">The "whats" and "whys"</h3>

        <p><strong>An example of what an asset with properly filled in
            metadata looks like compared to one without it</strong>
            <img src="~@/assets/images/guides/authorGuide/configfiledifference.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <p><strong>!!!PLEASE NOTE THAT DIFFERENT AUTOMATIC LICENSE LINKS WILL BE ADDED TO MK IN THE NEAR
            FUTURE!!!</strong>
            Right now the user will get sent to Google in most cases with a search for the license you specify unless
            you decide to include a local copy of it in your metadata.</p>

        <p>MK comes with a custom system of one big config file and a custom directory you can choose to pack along with
            your asset. This gives a number of advantages that both the user and the author (you) will get for investing
            the extra time to set it up properly:</p>

        <ul>
            <li>You can name your asset in any way you want it displayed in the manager. If you do not fill this, it
                will just show as the directory name.
            </li>

            <li>You may include your author name, so the user knows who made the asset and allow your name to be
                filtered later on once the functionality is added.
            </li>

            <li>You may include any contact info in the metafile. Website, email, all goes.


                <ul>
                    <li>If you are a distributor of assets you didn't make, worry not! MK allows you to fill a separate
                        name and contact in for BOTH you AND the author so both of your contacts will show
                        independently.
                    </li>
                </ul>
            </li>

            <li>You may include the license link or a file in your pack along with information if your asset can be used
                commercially. Alternatively, you can pack a demo version of it and include a link where the user can buy
                the full version of your asset or a commercial license.


                <ul>
                    <li>In case using your assets has some additional requirements or you don't want to you just want to
                        include a commentary - you can! You can pack a separate small TXT or PDF file on top of the
                        license.
                    </li>
                </ul>
            </li>

            <li>You may include a preview image of your asset that will show the user what to roughly expect.


                <ul>
                    <li>You may include a whole gallery of preview images for advanced preview if you want to show a
                        real-world usage of your asset in action!
                    </li>
                </ul>
            </li>

            <li>You may include a version of your asset so the user can track which version of the asset he is currently
                on - very helpful when used in combination with naming your zip files with a version number at the end
                (elvanos-cliffs-2.0.zip)
            </li>

            <li>You may include both short and long description of your asset along with tags, so your asset is easy to
                find once a filter function has been added to MK.
            </li>
        </ul>

        <h3 id="anexampleofafolderstructure">An example of a folder structure</h3>

        <p>A picture of example folder structure with explanation
            <img src="~@/assets/images/guides/authorGuide/MK-metafiles.jpg" @click="zoomImage" class="zoomIn">
        </p>

        <h3 id="anexampleoftheconfigfile">An example of the config file</h3>

        <p><span class="link" v-on:click="openURL('https://drive.google.com/file/d/1AkQfLThpVHu13qAinfHdJFQrjY5pOGKB/view')">An example config file to either get inspired from or copy</span></p>

        <p>If you are having trouble navigating the code, we suggest using<span class="link" v-on:click="openURL('https://code.visualstudio.com/')"> VSCode
            free text editor </span>for editing.</p>

        <h3 id="detailedinfoaboutthedifferentsettingsinsidetheconfigfile">Detailed info about the different settings
            inside the config file</h3>

        <p><span class="link" v-on:click="openGuideOnParent('mythKeeperJson')">Detailed MK info file specs</span></p>

        <hr/>

        <h2 id="anexampleofafullypackedassetthatismythkeepercompatible">An example of a fully packed asset that is
            Mythkeeper compatible</h2>

        <p><span class="link" v-on:click="openURL('https://www.cartographyassets.com/assets/mk-elvanos-mountain-pack.13/download')">An example asset to
            either get inspired from or to copy the structure from</span></p>
    </div>


</template>

<script>

   export default {
      name: "authorGuide",

      data: function () {
         return {}
      },
      methods:{
         openURL(link) {
            this.$electron.shell.openExternal(link)
         },
         openGuideOnParent(guide){
            this.$emit('guide-change', guide)
         },
         zoomImage(event) {
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

</style>


