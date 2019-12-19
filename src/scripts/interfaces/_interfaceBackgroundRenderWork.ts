/**
 * A data structure for the background window worker process.
 *
 * @param command - A command for the backend work window. A list of available commands can be found in "main.ts" file at the core project level.
 * @param status - Determines the status of the request. Mostly used in "background.ts" file at the core project level.
 * @param taskID - Unique ID of the task. Automatically generates in "baseClass.ts"
 * @param progress - Numerical progress of the task being processed. Goes from 0 to 100.
 * @param data - Custom data for individual tasks. Can vary depending on each individual task.
 */
interface interfaceBackgroundRenderWork{
  command: string
  status: "active" | "finished" | "accepted" | "update"
  taskID: string
  progress: number|string
  data?: {
    [key: string]: any
  }
}

export default interfaceBackgroundRenderWork
