/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import {ipcRenderer} from "electron"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"

// Scripts
import DownloadManagerMK from "@/scripts/fileManagers/downloadManagerMK"


/* ------------------------------------ */
/* ------------MAIN FUNCTION---------- */
/* ------------------------------------ */


const workDownloadFile = async (workData: interfaceBackgroundRenderWork) => {

  // Backup the actual files
  if(workData.data){

    // Make new instance
    const downloadManager = new DownloadManagerMK()

    // Set timer for reporting
    const reportTimer = setInterval(() => {
      workData.status = "update"
      workData.progress = downloadManager.getDownloadProgress()
      ipcRenderer.send("asynchronous-message", workData)
    }, 1000)

    // Wait for the unpacker to finish
    const downloadResult = await downloadManager.downloadFile(workData.data)

    // Cleanup and removal of the task from the tasklist
    clearInterval(reportTimer)

    workData.progress = 100
    workData.status = "finished"
    workData.data.response = downloadResult

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", workData)

  }

  // If the data isn't set for some reason, terminate and throw an orderly error.
  else{
    const newCommand: interfaceBackgroundRenderWork = {
      taskID: workData.taskID,
      status: "finished",
      progress: 0,
      command: "ERROR IN: downloadItem-work"
    }

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", newCommand)
  }


}

export default workDownloadFile
