/**
 * Data structure for a task object
 *
 * @param taskDescription - Generic, short description of what the task does (displays as label in the Tasklist)
 * @param taskName - The individual name of the task (eg: Elvanos Mountains)
 * @param uniqueComponentID - Passed from the component the task gets created from.
 * @param uniqueTaskID - Auto-generates from the baseClass.
 * @param progress - 1-100 value showing how much of the task is done. Gets updated via the background worker processes.
 */
interface taskInterface {
  taskDescription: string,
  taskName: string,
  uniqueComponentID: string,
  uniqueTaskID: string,
  progress: number|string
}

export default taskInterface
