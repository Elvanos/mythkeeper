/* ------------------------------------ */
/* --------------IMPORTS-------------- */
/* ------------------------------------ */


// Import all background windows we might use
import workBackupAsset from "@/scripts/workWindowTasks/workBackupAsset"
import workDeleteAsset from "@/scripts/workWindowTasks/workDeleteAsset"
import workDeleteBackupAsset from "@/scripts/workWindowTasks/workDeleteBackupAsset"
import workRestoreBackupAsset from "@/scripts/workWindowTasks/workRestoreBackupAsset"
import workUnpackFile from "@/scripts/workWindowTasks/workUnpackFile"
import workInstallFile from "@/scripts/workWindowTasks/workInstallFile"
import workDownloadFile from "@/scripts/workWindowTasks/workDownloadFile"



// Import electron
import {remote, webContents, app, ipcRenderer} from "electron"

// Import VUE, store and base APP component
import Vue from "vue"
import store from "./store/store"
import axios from "axios"
import VueAxios from "vue-axios"
import App from "./App.vue"

import VueCodemirror from "vue-codemirror"
import "codemirror/mode/javascript/javascript.js"


// require styles
import "codemirror/lib/codemirror.css"
import "codemirror/theme/monokai.css"

// Animate css
import "animate.css/animate.css"

// @ts-ignore
import VueAWN from "vue-awesome-notifications"

// Quasar
import "./quasar"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"


/* --------------------------------- */
/* --------------SETUP-------------- */
/* --------------------------------- */

const isDevelopment = process.env.NODE_ENV !== "production"


const windowType = remote.getCurrentWindow()["windowType"]


/* --------------------------------- */
/* ------------APP WINDOW---------- */
/* --------------------------------- */


if (windowType === "appWindow") {

  Vue.use(VueAxios, axios)

  Vue.use(VueCodemirror)

  Vue.use(VueAWN, {
    icons: {
      enabled: false
    }
  })


  // Disable tips
  Vue.config.productionTip = false

  Vue.filter("capitalize", function (value:string) {
    if (!value) {return ""}
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })

  Vue.filter("uppercase", function (value:string) {
    if (!value) {return ""}
    return value.toUpperCase()
  })

  // Run app
  new Vue({
    store,
    render: h => h(App)
  }).$mount("#app")

}


/* --------------------------------- */
/* ------------WORK WINDOW---------- */
/* --------------------------------- */


if (windowType === "workWindow") {


  // Set the communication channel
  setInterval(()=>{
    processWorkload()
  },1000)

  const processWorkload = () => {
    const workCommands : interfaceBackgroundRenderWork[] = remote.getCurrentWindow()["workList"]
    console.log(workCommands)

    workCommands.forEach((singleCommand: interfaceBackgroundRenderWork ) => {

      // Process only active commands... in case non-active somehow sneak in
      if (singleCommand.status === "active") {

        // Handle backupAsset-work
        if (singleCommand.command === "backupAsset-work" ) {
          workBackupAsset(singleCommand)
        }

        // Handle deleteBackupAsset-work
        if (singleCommand.command === "deleteBackupAsset-work" ) {
          workDeleteBackupAsset(singleCommand)
        }
        // Handle deleteBackupAsset-work
        if (singleCommand.command === "deleteAsset-work" ) {
          workDeleteAsset(singleCommand)
        }

        // Handle restoreBackupAsset-work
        if (singleCommand.command === "restoreBackupAsset-work" ) {
          workRestoreBackupAsset(singleCommand)
        }

        // Handle unpackFile-work
        if (singleCommand.command === "unpackFile-work" ) {
          workUnpackFile(singleCommand)
        }

        // Handle installFile-work
        if (singleCommand.command === "installFile-work" ) {
          workInstallFile(singleCommand)
        }

        // Handle installFile-work
        if (singleCommand.command === "downloadItem-work" ) {
          workDownloadFile(singleCommand)
        }


        // Let the server know this specific command is being taken care off
        const reply: interfaceBackgroundRenderWork = singleCommand
        reply.status = "accepted"
        ipcRenderer.send("asynchronous-message", reply)
      }

    })

  }


}




