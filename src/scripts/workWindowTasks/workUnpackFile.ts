/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import {ipcRenderer} from "electron"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"

// Scripts
import InstallManagerMK from "@/scripts/fileManagers/installManagerMK"


/* ------------------------------------ */
/* ------------MAIN FUNCTION---------- */
/* ------------------------------------ */


const workUnpackFile = async (workData: interfaceBackgroundRenderWork) => {

  // Backup the actual files
  if(workData.data){

    // Make new instance
    const unpackManager = new InstallManagerMK(workData.data.mkPaths, workData.data.timestamp )

    // Set timer for reporting
    const reportTimer = setInterval(() => {
      workData.status = "update"
      workData.progress = unpackManager.getUnpackProgress()
      ipcRenderer.send("asynchronous-message", workData)
    }, 1000)

    // Wait for the unpacker to finish
    await unpackManager.unpackFile(workData.data.installationType)

    // Cleanup and removal of the task from the tasklist
    clearInterval(reportTimer)

    workData.progress = 100
    workData.status = "finished"

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", workData)

  }

  // If the data isn't set for some reason, terminate and throw an orderly error.
  else{
    const newCommand: interfaceBackgroundRenderWork = {
      taskID: workData.taskID,
      status: "finished",
      progress: 0,
      command: "ERROR IN: unpackFile-work"
    }

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", newCommand)
  }


}

export default workUnpackFile
