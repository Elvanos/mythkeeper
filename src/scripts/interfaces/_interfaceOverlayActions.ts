/**
 * Data structure for the individual action inside the overlayActionsInterface
 *
 * @param title - Text content on the button
 * @param classes - A list of classes used on the button. Pass empty string for normal button. For empty button pass "q-btn--outline -noBG"
 * @param action - The action the button should trigger. Generally is "closeModal" for closing the overlay or "storeSetOverLayTriggerAction" if we want to trigger something via "param" (bellow)
 * @param param - A function name to be called on the component that originally called for the opening of the overlay upon clicking on the particular button.
 * @see overlayActionsInterface
 */
interface overlayActionsSubInterface{
  title: string
  classes: string
  action: string
  param?: {
    functionName: string,
    data: any
  }
}

/**
 * Data structure for sending requests to the overlay actions
 *
 * @param componentID - A unique ID of the component the action was sent from.
 * @param title - Text title for the overlay.
 * @param contents - Text content for the overlay
 * @param actions - A list of actions with their attribututes
 * @see overlayActionsSubInterface
 */
interface overlayActionsInterface{
  componentID: string,
  title: string,
  contents: string,
  downloadItems?: any[]
  actions: overlayActionsSubInterface[]
}

export default overlayActionsInterface
