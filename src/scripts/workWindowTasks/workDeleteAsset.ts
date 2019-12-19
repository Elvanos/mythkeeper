/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import {ipcRenderer} from "electron"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"

// Scripts
import DeleteManagerMK from "@/scripts/fileManagers/deleteManagerMK"


/* ------------------------------------ */
/* ------------MAIN FUNCTION---------- */
/* ------------------------------------ */


const workDeleteAsset = async (workData: interfaceBackgroundRenderWork) => {

  // Make new instance
  const deleteManager = new DeleteManagerMK()

  // Backup the actual files
  if(workData.data){

    // Set timer for reporting
    const reportTimer = setInterval(() => {
      workData.status = "update"
      workData.progress = deleteManager.getDeleteProgress()
      ipcRenderer.send("asynchronous-message", workData)
    }, 1000)

    // Wait for the delete to finish
    await deleteManager.deleteSingle(workData.data.folderName, workData.data.mkPaths, workData.data.safeDelete)

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
      command: "ERROR IN: deleteAsset-work"
    }

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", newCommand)
  }

}
export default workDeleteAsset
