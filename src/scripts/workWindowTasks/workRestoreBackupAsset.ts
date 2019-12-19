/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// Libs
import {ipcRenderer} from "electron"

// Interfaces
import interfaceBackgroundRenderWork from "@/scripts/interfaces/_interfaceBackgroundRenderWork"

// Scripts
import BackupManagerMK from "@/scripts/fileManagers/backupManagerMK"


/* ------------------------------------ */
/* ------------MAIN FUNCTION---------- */
/* ------------------------------------ */


const workRestoreBackupAsset = async (workData: interfaceBackgroundRenderWork) => {

  // Make new instance
  const backupManager = new BackupManagerMK()

  // Backup the actual files
  if(workData.data){

    // Set timer for reporting
    const reportTimer = setInterval(() => {
      workData.status = "update"
      workData.progress = backupManager.getRestoreProgress()
      ipcRenderer.send("asynchronous-message", workData)
    }, 1000)

    // Wait for the restore to finish
    await backupManager.restoreSingle(workData.data.folderName, workData.data.mkPaths)

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
      command: "ERROR IN: restoreBackupAsset-work"
    }

    // Signal the main background process that we are done
    ipcRenderer.send("asynchronous-message", newCommand)
  }

}
export default workRestoreBackupAsset
