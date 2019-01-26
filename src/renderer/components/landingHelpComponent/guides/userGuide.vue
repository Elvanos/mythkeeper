<template>
    <div>
        <h1 id="welcometothemythkeeperguideforusers">Welcome to the Mythkeeper guide for users!</h1>

        <p>If you are a Wonderdraft user and you keep eyeing all those fancy custom assets but aren't sure how to
            install them or if you are a person who has so many assets installed that you don't even know what is what
            anyone, this is the guide for you!</p>

        <hr/>

        <p><strong>PLEASE KEEP IN MIND that this guide is for custom ASSETS only; Mythkeeper DOES NOT support custom
            themes yet. These will work ONLY for assets that normally go strictly into the "assets" directory!</strong>
        </p>

        <p><strong>ALSO PLEASE KEEP IN MIND that while Mythkeeper will do its best to help you install the asset if the
            author packed it flat out wrong, there is only so much it can do!</strong></p>

        <hr/>

        <h2 id="installation">Installation</h2>

        <p>Installing Mythkeep is very easy!
            Just go to the link below on Cartography Assets and download the installer and install it like any other
            Windows program.
            If you ever want to remove it, just use the programs &amp; apps management as with any other software.</p>

        <p><strong>PLEASE NOTE: Mythkeeper is currently ONLY available for Windows platform. There will be MacOS and
            Linux versions later down the line!</strong></p>

        <h3 id="downloadmythkeeperhttpswwwcartographyassetscomassetsmythkeeperassetmanager68">
            <span class="link" v-on:click="openURL('https://www.cartographyassets.com/assets/mythkeeper-asset-manager.68/')">
                DOWNLOAD MYTHKEEPER</span> - Read below
        </h3>
        <p>
            You obviously don't have to do this, since you are in the program right now, but if you ever want to check for a newer version, the link is the same.
        </p>

        <h2 id="afewprinciplesoftheprogram">A few principles of the program</h2>

        <ul>
            <li><p><strong>Mythkeeper never truly deletes any of your assets except for overwriting with newer
                version</strong>. It packs them in ZIP format in case you ever change your mind and want to retrieve
                them for reinstallation later.</p></li>

            <li><p><strong>Mythkeeper DOES NOT merge asset folders: When you are informed that something already exists
                if you chose to install anyway, the original file WILL be deleted irreversibly!</strong></p></li>

            <li><p><strong>Your files can exist in three states within the app:</strong></p>

                <ul>
                    <li><p><strong>Active</strong> - Normal Wonderdraft asset folders in the Wonderdraft's user folder.
                    </p>

                        <ul>
                            <li>Can be found here: C:\Users\&#60;YOUR USER
                                NAME&#62;\AppData\Roaming\Wonderdraft\assets
                            </li>
                        </ul>
                    </li>

                    <li><p><strong>Backup</strong> - These files are moved folders from the previously mentioned type.
                        They will not show in Wonderdraft when you launch it, but Mythkeeper can still work with them.
                    </p>

                        <ul>
                            <li>Can be found here: C:\Users\&#60;YOUR USER NAME&#62;\AppData\Roaming\Wonderdraft_mythKeeper\backup\assets</li>
                        </ul>
                    </li>

                    <li><p><strong>Deleted</strong> - These files have been removed both from normal AND backup
                        directories and have been packed into smaller ZIP archive folders. They can always be retrieved
                        via Restore asset function inside Mythkeeper.</p>

                        <p>
                        <ul>
                            <li>Can be found here: C:\Users\&#60;YOUR USER NAME&#62;\AppData\Roaming\Wonderdraft_mythKeeper\deleted\assets</li>
                        </ul>

                        <p></p></li>
                </ul>

                <p></p>
                <p>
            <li><p><strong>Unified folder structure of assets</strong> - all assets that are Mythkeeper compatible will
                come in prebuild way. If the asset package isn't up to the standards, then Mythkeeper will inform of
                this and ask you if still wish to install.</p></li>

            <p>
                <li>
            <p>You will find a mostly offline of this guide inside Mythkeeper as well!</p></li>
        </ul>


        <hr/>

        <h2 id="usingmythkeeper">Using Mythkeeper</h2>

        <h3 id="theintroscreen">The intro screen</h3>

        <p>An image with explanations of what different things on the intro
            screen do

            <img src="~@/assets/images/guides/userguide/mkstartScreen.jpg">
        </p>



        <h3 id="theassetsscreen">The Assets screen</h3>

        <p>An image with explanations of what different things on the Assets
            module screen do
            <img src="~@/assets/images/guides/userguide/moduleAssets.jpg" >

        </p>
    </div>


</template>

<script>

   export default {
      name: "userGuide",

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

            const targetElement = event.target
            if (targetElement.classList.contains('isZoomed')) {
               targetElement.classList.remove("isZoomed")
            } else {
               targetElement.classList.add("isZoomed")
            }
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
                position: fixed
                top: 0
                left: -2px
                width: 90%
                cursor: zoom-out
</style>


