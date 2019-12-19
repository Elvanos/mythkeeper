/* ------------------------------ */
/* ------------IMPORTS---------- */
/* ------------------------------ */


// VUEX Decorators
import { Action, Mutation, Module, VuexModule } from "vuex-module-decorators"
import interfaceOverlayActions from "@/scripts/interfaces/_interfaceOverlayActions"


/* ---------------------------- */
/* ------------MODULE---------- */
/* ---------------------------- */


@Module
export default class activeModule extends VuexModule {


  /* ------------------------------------------------ */
  /* ------------SECTION: ACTIVE MODULE------------ */
  /* ------------------------------------------------ */


  /**
   * Determines the current active module component.
   */
  activeModule: string = ""

  /**
   * Retrieves the current active module component name.
   * @returns activeModule
   */
  get storeGetActiveModule() {
    return this.activeModule
  }

  /**
   * Sets the current active module component name.
   * @param activeModule - A name of the module file without the ".vue" affix.
   * @see activeModule
   */
  @Mutation
  SET_ACTIVE_MODULE(activeModule: string) {
    this.activeModule = activeModule
  }

  /**
   * Commits the current active module component name.
   * @param activeModule - A name of the module file without the ".vue" affix.
   * @see SET_ACTIVE_MODULE
   */
  @Action
  async storeSetActiveModule(activeModule: string) {
    this.context.commit("SET_ACTIVE_MODULE", activeModule)
  }


  /* ---------------------------------------------------------- */
  /* ------------ SECTION: OVERLAY CLICK MANAGER ------------ */
  /* ---------------------------------------------------------- */


  /**
   * Determines if user clicked outside of overlay.
   */
  outsideOverLayClick: boolean = false

  /**
   * Retrieves if user clicked outside of overlay.
   * @returns outsideOverLayClick
   */
  get storeGetOutsideOverLayClick() {
    return this.outsideOverLayClick
  }

  /**
   * Sets if user clicked outside of overlay.
   * @param clickState - True if clicked. False if resetting after overlay closed.
   * @see outsideOverLayClick
   */
  @Mutation
  SET_OVERLAY_OUTSIDE_CLICK(clickState: boolean) {
    this.outsideOverLayClick = clickState
  }

  /**
   * Commits if user clicked outside of overlay.
   * @param clickState - True if clicked. False if resetting after overlay closed.
   * @see SET_OVERLAY_OUTSIDE_CLICK
   */
  @Action
  storeSetOutsideOverLayClick(clickState: boolean) {
    this.context.commit("SET_OVERLAY_OUTSIDE_CLICK", clickState)
  }


  /* --------------------------------------------------------------- */
  /* ------------SECTION: OVERLAY CLOSEABLE ALLOWANCE ------------ */
  /* --------------------------------------------------------------- */


  /**
   * Determines if the overlay is closeable by clicking outside of it or not.
   */
  isCloseableOverlay: boolean = false

  /**
   * Retrieves the Overlay closeable allowance.
   * @see isCloseableOverlay
   */
  get storeGetIsCloseableOverlay() {
    return this.isCloseableOverlay
  }

  /**
   * Sets if overlay is closeable or not.
   * @param isCloseable - True/False. Determines if the overlay is closeable.
   * @see isCloseableOverlay
   */
  @Mutation
  SET_IS_CLOSEABLE_OVERLAY(isCloseable: boolean) {
    this.isCloseableOverlay = isCloseable
  }

  /**
   * Commits if overlay is closeable or not.
   * @param isCloseable - True/False. Determines if the overlay is closeable.
   * @see SET_IS_CLOSEABLE_OVERLAY
   */
  @Action
  async storeSetIsCloseableOverlay(isCloseable: boolean) {
    this.context.commit("SET_IS_CLOSEABLE_OVERLAY", isCloseable)
  }



  /* ----------------------------------------------------- */
  /* ------------SECTION: OVERLAY COMPONENT ------------ */
  /* ----------------------------------------------------- */


  /**
   * Determines the Overlay Component name.
   */
  overlayComponent: string = ""

  /**
   * Retrieves the Overlay Component name.
   * @see overlayComponent
   */
  get storeGetOverlayComponent() {
    return this.overlayComponent
  }

  /**
   * Sets Overlay Component name.
   * @param activeOverlay - Overlay component name without the ".vue" at the end.
   * @see overlayComponent
   */
  @Mutation
  SET_OVERLAY_COMPONENT(activeOverlay: string) {
    this.overlayComponent = activeOverlay
  }

  /**
   * Commits Overlay Component name.
   * @param activeOverlay - Overlay component name without the ".vue" at the end.
   * @see SET_OVERLAY_COMPONENT
   */
  @Action
  async storeSetOverlayComponent(activeOverlay: string) {
    this.context.commit("SET_OVERLAY_COMPONENT", activeOverlay)
  }


  /* ---------------------------------------------------- */
  /* ------------SECTION: OVERLAY CONTENTS ------------ */
  /* ---------------------------------------------------- */


  /**
   * Determines current overlay contents.
   */
  overLayContents = {} as interfaceOverlayActions

  /**
   * Retrieves current overlay contents.
   * @returns overLayContents
   */
  get storeGetOverLayContents() {
    return this.overLayContents
  }

  /**
   * Sets current overlay contents.
   * @param contents - New overlay contents submitted to the store.
   * @see outsideOverLayClick
   */
  @Mutation
  SET_OVERLAY_CONTENTS(contents: interfaceOverlayActions) {
    this.overLayContents = contents
  }

  /**
   * Commits current overlay contents.
   * @param contents - New overlay contents submitted to the store.
   * @see SET_OVERLAY_CONTENTS
   */
  @Action
  async storeSetOverLayContents(contents: interfaceOverlayActions) {
    this.context.commit("SET_OVERLAY_CONTENTS", contents)
  }


  /* ------------------------------------------------------- */
  /* ------------ SECTION: OVERLAY OPEN STATE ------------ */
  /* ------------------------------------------------------- */


  /**
   * Determines if the overlay is opened on the "App" component or not.
   */
  overlayOpened: boolean = false

  /**
   * Retrieves if the overlay is opened or not.
   * @see overlayOpened
   */
  get storeGetOverlayVisibility() {
    return this.overlayOpened
  }

  /**
   * Sets if the overlay is opened or not.
   * @param overlayIsVisible - A true/false determining if the overlay is showing or not.
   * @see overlayOpened
   */
  @Mutation
  SET_OVERLAY_VISIBILITY(overlayIsVisible: boolean) {
    this.overlayOpened = overlayIsVisible
  }

  /**
   * Commits if the overlay is opened or not.
   * @param overlayIsVisible - A true/false determining if the overlay is showing or not.
   * @see SET_OVERLAY_VISIBILITY
   */
  @Action
  async storeSetOverlayVisibility(overlayIsVisible: boolean) {
    this.context.commit("SET_OVERLAY_VISIBILITY", overlayIsVisible)
  }


  /* ------------------------------------------------------------ */
  /* ------------ SECTION: OVERLAY TRIGGER ACTION ------------ */
  /* ------------------------------------------------------------ */


  /**
   * Determines whatever action was triggered from the overlay.
   */
  overLayTriggerAction: string = ""

  /**
   * Retrieves whatever action was triggered from the overlay.
   * @returns overLayTriggerAction
   */
  get storeGetOverLayTriggerAction() {
    return this.overLayTriggerAction
  }

  /**
   * Sets whatever action was triggered from the overlay.
   * @param action - String name of the method that is supposed to be triggered on the component that triggered this overlay to begin with after the button was clicked.
   * @see overLayTriggerAction
   */
  @Mutation
  SET_OVERLAY_TRIGGER_ACTION(action: string ) {
    this.overLayTriggerAction = action
  }

  /**
   * Commits whatever action was triggered from the overlay.
   * @param action - String name of the method that is supposed to be triggered on the component that triggered this overlay to begin with after the button was clicked.
   * @see SET_OVERLAY_TRIGGER_ACTION
   */
  @Action
  async storeSetOverLayTriggerAction( action: string) {
    this.context.commit("SET_OVERLAY_TRIGGER_ACTION", action)
  }


  /* ------------------------------------------------------------ */
  /* ------------ SECTION: OVERLAY TRIGGER PARAMETER ------------ */
  /* ------------------------------------------------------------ */


  /**
   * Determines whatever action was triggered from the overlay.
   */
  overLayTriggerParameter = {} as {functionName: string, data: any}

  /**
   * Retrieves whatever action was triggered from the overlay.
   * @returns overLayTriggerAction
   */
  get storeGetOverLayTriggerParameter() {
    return this.overLayTriggerParameter
  }

  /**
   * Sets whatever action was triggered from the overlay.
   * @param dataBatch - A data batch to pass down
   * @see overLayTriggerAction
   */
  @Mutation
  SET_OVERLAY_TRIGGER_PARAMETER(dataBatch: {functionName: string, data: any} ) {
    this.overLayTriggerParameter = dataBatch
  }

  /**
   * Commits whatever action was triggered from the overlay.
   * @param dataBatch - A data batch to pass down
   * @see SET_OVERLAY_TRIGGER_ACTION
   */
  @Action
  async storeSetOverLayTriggerParameter( dataBatch: {functionName: string, data: any}) {
    this.context.commit("SET_OVERLAY_TRIGGER_PARAMETER", dataBatch)
  }


  /* ---------------------------------------------- */
  /* ------------SECTION: RESET UI---------------- */
  /* ---------------------------------------------- */


  /**
   * Resets the default UI state by resetting some of the states inside the module.
   * @see activeModule
   * @see overlayComponent
   * @see overlayOpened
   * @see outsideOverLayClick
   */
  @Mutation
  RESET_UI() {

    this.activeModule = "welcome"
    this.overlayComponent = ""
    this.overlayOpened = false
    this.outsideOverLayClick = false

  }

  /**
   * Commits a UI reset.
   * @see RESET_UI
   */
  @Action
  async storeResetUI() {
    this.context.commit("RESET_UI")
  }

}
