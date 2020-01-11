"use strict"

/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import {app, protocol, BrowserWindow, ipcMain, remote} from "electron"
import {createProtocol, installVueDevtools} from "vue-cli-plugin-electron-builder/lib"
import path from "path"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"


/* ------------------------------------ */
/* ------------CORE SETTINGS---------- */
/* ------------------------------------ */


declare const __static: string
const isDevelopment = process.env.NODE_ENV !== "production"

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: "app", privileges: { secure: true, standard: true } }])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appWindow: BrowserWindow
let workWindow: BrowserWindow

/* --------------------------------- */
/* ------------APP WINDOW---------- */
/* --------------------------------- */


function createAppWindow () {


  appWindow = new BrowserWindow({
    show: false,
    icon: path.join(__static, "icon.png"),
    frame: false,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      webSecurity: false
    }
  })
  appWindow.setMenu(null)
  appWindow.maximize()
  appWindow.show()
  appWindow["windowType"] = "appWindow"
  appWindow["workList"] = []

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    appWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) {appWindow.webContents.openDevTools()}
  } else {
    createProtocol("app")
    // Load the index.html when not in development
    appWindow.loadURL("app://./index.html")
  }

  appWindow.on("closed", () => {
    app.quit()
  })
}


/* ---------------------------------- */
/* ------------WORK WINDOW---------- */
/* ---------------------------------- */


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


function createWorkWindow () {

  workWindow = new BrowserWindow(
    {
      show: false,
      webPreferences: {
        nodeIntegration: true,
        experimentalFeatures: true,
        webSecurity: false
      }
    })

  workWindow.setMenu(null)
  workWindow["windowType"] = "workWindow"
  workWindow["workList"] = []

  if (process.env.WEBPACK_DEV_SERVER_URL) {

    // Load the url of the dev server if in development mode
    workWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)

    if (!process.env.IS_TEST){
      workWindow.show()
      workWindow.webContents.openDevTools()
    }
  }
  else {
    createProtocol("app")

    // Load the index.html when not in development
    workWindow.loadURL("app://./index.html")

  }

}


/* -------------------------------- */
/* ------------APP START---------- */
/* -------------------------------- */



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }

  }
  createAppWindow()
  createWorkWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment || process.env.IS_TEST) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit")
      {app.quit()}

    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}


/* -------------------------------------------------- */
/* ------------CROSS WINDOW COMMUNICATION---------- */
/* -------------------------------------------------- */


ipcMain.on("asynchronous-message", async (event, commandInput: interfaceBackgroundRenderWork) => {

  /**
   * Logging of commands to see what is coming in the backend.
   * Only while in dev mode.
   */
  if (isDevelopment || process.env.IS_TEST) {
    console.log(`
    \nRenderer request: ${commandInput.command}\nWith status: ${commandInput.status}\nWith progress: ${commandInput.progress}%\n`)
  }


  /**
   * Process new tasks
   */
  if (commandInput.status === "active") {

    // Add work task to the both windows
    appWindow["workList"].push(commandInput)
    workWindow["workList"].push(commandInput)

    return
  }

  /**
   * Process updates to tasks
   */
  if (commandInput.status === "update") {

    // Filter out the task we are looking for and change its progress based on ID
    let taskIndex: number = -1
    appWindow["workList"].forEach((singleTask: interfaceBackgroundRenderWork, index)=> {
      if (singleTask.taskID === commandInput.taskID) {taskIndex = index}
    })
    appWindow["workList"][taskIndex].progress = commandInput.progress

    return
  }


  /**
   * If the work windows accepted the task, remove it from the work list
   */
  if (commandInput.status === "accepted") {

    // Filter out the task we are looking for and remove it from the list
    let taskIndex: number = -1
    workWindow["workList"].forEach((singleTask: interfaceBackgroundRenderWork, index)=> {
      if (singleTask.taskID === commandInput.taskID) {taskIndex = index}
    })
    workWindow["workList"].splice( taskIndex, 1)

    return

  }

  /**
   * Process finished tasks
   */
  if (commandInput.status === "finished") {

    // After the rendered finishes, clean the work task from the list
    let taskIndex: number = -1
    appWindow["workList"].forEach((singleTask: interfaceBackgroundRenderWork, index)=> {
      if (singleTask.taskID === commandInput.taskID) {taskIndex = index}
    })
    appWindow["workList"].splice( taskIndex, 1)

    return

  }

  /**
   * If we get something usual (somehow), log an error.
   */
  console.log("Unknown renderer request: " + commandInput.command + "with status: " + commandInput.status)

})
