<template lang="html">
  <div>
    <div class="wiki">
      <h1>
        Mythkeeper user guide
      </h1>
      <h2 id="wiki_an_important_foreword">
        An IMPORTANT foreword
      </h2>
      <p>Please keep in mind that this software is a community hobby project, so please take into account the following:</p>
      <ul>
        <li>We tried our very hardest to make the software as easy to use as we could - therefore every silly button in the whole app has an excruciatingly detailed tooltip attached to it with a detailed explanation of what it does (can be turned off via Settings once you start finding it obnoxious).</li>
        <li>It was developed as a side-activity of a few people from the community.</li>
        <li>While we tried our best, it is possible that the problem might have some glitches or bugs we simply didn't find. If you stumble into one, please report it to us on the Cartography Assets website, Cartography Assets discord or on the GitHub of Mythkeeper.</li>
        <li>
          <strong>Make sure to backup your current Wonderdraft user folder!</strong>
          <ul>
            <li>We tried our best to make sure it doesn't eat your maps, but you know... hobby projects. :)</li>
          </ul>
        </li>
        <li>If you have a suggestion or an idea on how to improve the program, feel free to let us know in the same way as reporting bugs.</li>
      </ul>
      <h2 id="wiki_f.a.q.">
        F.A.Q.
      </h2>
      <h3 id="wiki_what_is_mythkeeeper.3F">
        What is Mythkeeeper?
      </h3>
      <p>Mythkeeper is a community asset manager for Wonderdraft's user-made content. </p>
      <p>This means it is open-source software written in code that is accessible for the public and can be viewed or edited for personal needs or out of sheer curiosity.</p>
      <h3 id="wiki_what_does_mythkeeper_do.3F">
        What does Mythkeeper do?
      </h3>
      <p>Mythkeeper allows you to install, delete, back-up and overall manage assets along with using Wonderdraft.</p>
      <p>On top of it, we also added a partial theme and brush support management to the new version.</p>
      <p>If that hasn't blown your mind yet: We also support direct download and automatic updating from the Cartography Assets website and a brand new feature called Profiles.</p>
      <h3 id="wiki_do_i_need_any_special_account.2Fregistration_to_run_mythkeeper.3F">
        Do I need any special account/registration to run Mythkeeper?
      </h3>
      <p>No! Mythkeeper does not use any account system as of now - you install it, run it and use it as you see fit.</p>
      <h3 id="wiki_do_i_need_a_copy_of_wonderdraft_installed_to_use_mythkeeper.3F">
        Do I need a copy of Wonderdraft installed to use Mythkeeper?
      </h3>
      <p>Technically no, but you will likely find yourself in a spot where the software serves no purpose as no modules will be allowed without a valid installation of Wonderdraft.</p>
      <h3 id="wiki_will_this_work_with_the_custom_user_folder.3F_i_don.27t_want_to_have_500gb_of_assets_on_my_system_ssd.">
        Will this work with the custom user folder? I don't want to have 500GB of assets on my system SSD.
      </h3>
      <p>Yes! We added support for custom user folders in this update!</p>
      <h3 id="wiki_will_the_software_auto-update.3F">
        Will the software auto-update?
      </h3>
      <p>Unfortunately no, but we are looking into adding this functionality in the future update at some point.</p>
      <h3 id="wiki_does_this_cost_anything_in_any_way.2C_shape_or_form.3F">
        Does this cost anything in any way, shape or form?
      </h3>
      <p>Nope, all free. If you are feeling very generous after extensive use; feel free to drop us a buck or two on Patreon.</p>
      <h3 id="wiki_do_you_collect_any_user_information.2Ftrack_activity.2Frun_analytics_inside_the_software.3F">
        Do you collect any user information/track activity/run analytics inside the software?
      </h3>
      <p>I know it is hard to believe in 2019, but no; we don't. If you don't believe your own eyes, feel free to check out GitHub for the source code to see for yourself.</p>
      <p>The software is completely free, no strings attached what so ever.</p>

      <h2 id="wiki_a_few_principles_of_the_program">
        A few principles of the program
      </h2>
      <ul>
        <li><p><strong>Mythkeeper never truly deletes any of your assets except for overwriting with newer version or when you disable the safe deletion mode in the settings</strong>. Instead, it packs them in ZIP format in case you ever change your mind and want to retrieve them for reinstallation later.</p></li>
        <li><p><strong>Mythkeeper DOES NOT merge asset folders: When you are informed that something already exists if you chose to install anyway, the original file WILL be deleted irreversibly!</strong></p></li>
        <li>
          <p><strong>Your files can exist in three states within the app:</strong>
          <ul>
            <li>
              <strong>Active</strong> - Normal Wonderdraft asset folders in the Wonderdraft's user folder.

              <ul>
                <li>Assets can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft\assets</li>
                <li>Themes can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft\themes</li>
                <li>Brushes can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft\brushes</li>
              </ul>
            </li>
            <li>
              <strong>Backup</strong> - These files are moved folders from the previously mentioned type. They will not show in Wonderdraft when you launch it, but Mythkeeper can still work with them.

              <ul>
                <li>Assets can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft_mythKeeper\backup\assets</li>
                <li>Themes can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft_mythKeeper\backup\themes</li>
                <li>We don't currently allow for backup of brushes</li>
              </ul>
            </li>
            <li>
              <strong>Deleted</strong> - These files have been removed both from normal AND backup directories and have been packed into smaller ZIP archive folders. They can always be retrieved via Restore asset function inside Mythkeeper.

              <ul>
                <li>Assets can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft_mythKeeper\deleted\assets</li>
                <li>Themes can be found here: C:\Users&lt;YOUR USER NAME&gt;\AppData\Roaming\Wonderdraft_mythKeeper\deleted\themes</li>
                <li>We don't currently allow for deletion of brushes via the program</li>
              </ul>
            </li>
          </ul>
          </p>
        </li>
        <li><p><strong>Unified folder structure of assets and themes</strong> - All assets and themes that are Mythkeeper compatible will come in prebuild way. If the asset package isn't up to the standards, then Mythkeeper will inform of this and ask you if you still wish to install (even if the result will likely not work).</p></li>
      </ul>
      <h2 id="wiki_using_mythkeeper">
        Using Mythkeeper
      </h2>
      <h3 id="wiki_basic_explanation">
        Basic explanation
      </h3>
      <p>Mythkeeper comes packed with five base modules that can be toggled via the left control column - The welcomes screen, the asset module, the theme module, the Cartography Assets module and finally the profiles module (needs to allowed via Settings.)</p>
      <p>On top of these, the left control column also contains a Settings button which opens an overlay lightbox with setting related to how the app functions.</p>
      <p>At the very bottom, you can find three small buttons - force refresh of the whole app (if something goes REALLY wrong), developer tools (in case you want to keep under the hood) and guides (opens a guide menu for those who are lost, curious or just uncertain).</p>
      <h3 id="wiki_profiles">
        Profiles
      </h3>
      <p>Profiles are a new feature that we added to Mythkeeper after many requests from different users.</p>
      <p>This new feature allows you to create non-overlapping, unique directories that each holds a separate set of themes, assets, and brushes.</p>
      <p>Each of these can be easily swapped in and out like a memory card by a selection of the desired profiles and a mere push of a button in seconds.</p>
      <p>This allows the user to have separate setups for cities, caves, tabletop games, continent maps, etc. without having to load all themes and assets into Wonderdraft at once - therefore drastically improving the performance (the obvious downside being more space getting used by Mythkeeper in order to make separate folders for all profiles; with possible duplicates).</p>
    </div>
  </div>
</template>

<script lang="ts">

// Base class
import BaseClass from "@/scripts/classes/classBase"

// Decorators & Vue base + VUEX Decorators
import { Component, Prop } from "vue-property-decorator"


@Component
export default class UserGuide extends BaseClass {
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
