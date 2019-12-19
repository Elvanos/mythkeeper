/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


/* ---------- Sub-Section: LIBS ---------- */

import Vue from "vue"
import Vuex from "vuex"
import * as vuexElectron from "vuex-electron"


/* ---------- VUEX Module: APP SETTINGS ---------- */

// Paths
import pathProfileBase from "@/store/_appSettings/_pathProfileBase"
import pathUserFolder from "@/store/_appSettings/_pathUserFolder"
import pathCustomAssetsFolder from "@/store/_appSettings/_pathCustomAssetsFolder"

// Allowances
import allowanceStartUpTooltips from "@/store/_appSettings/_allowanceStartUpTooltips"
import allowanceSafeDeletion from "@/store/_appSettings/_allowanceSafeDeletion"
import allowanceRichTooltips from "@/store/_appSettings/_allowanceRichTooltips"
import allowanceProfile from "@/store/_appSettings/_allowanceProfile"
import allowanceExpertMode from "@/store/_appSettings/_allowanceExpertMode"
import allowanceDisabledModulesVisibility from "@/store/_appSettings/_allowanceDisabledModulesVisibility"


/* ---------- VUEX Module: APP UI ---------- */

import appUI from "@/store/_appUI/_appUI"


/* ---------- VUEX Module: COMPONENT LOCK ---------- */

import componentLock from "@/store/_componentLock/_componentLock"


/* ---------- VUEX Module: PROFILES ---------- */

import profiles from "@/store/_profiles/_profiles"


/* ---------- VUEX Module: TASKS ---------- */

import tasks from "@/store/_tasks/_tasks"

/* ---------- VUEX Module: INSTALLATION QUEUE ---------- */

import installQueue from "@/store/_installQueue/_installQueue"


/* ---------- VUEX Module: TRANSLATIONS ---------- */

import translations from "@/store/translations/_translations"


/* --------------------------------- */
/* ------------VUEX STORE---------- */
/* --------------------------------- */
let vuexStore: any = null

const addVuex = () => {
  try {
    Vue.use(Vuex)
    vuexStore = new Vuex.Store({

      plugins: [
        vuexElectron.createPersistedState(),
        //vuexElectron.createSharedMutations()
      ],

      modules:{

        // App settings
        pathProfileBase,
        pathUserFolder,
        pathCustomAssetsFolder,
        allowanceStartUpTooltips,
        allowanceSafeDeletion,
        allowanceRichTooltips,
        allowanceProfile,
        allowanceExpertMode,
        allowanceDisabledModulesVisibility,

        // App UI
        appUI,

        // Component lock
        componentLock,

        // Profiles
        profiles,

        // Tasks
        tasks,

        // Installation queue
        installQueue,

        // Translations
        translations

      }

    })
  }catch(e){
    addVuex()
  }

}

addVuex()

export default vuexStore

