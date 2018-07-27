import { Action } from "@dhis2/d2-ui-core";
// import { getInstance as getD2 } from "d2/lib/d2";
// import log from "loglevel";

/**
 * Various actions that a component can subscribe to
 * @see app-management-app
 */

const actions = {
  // Snackbar
  showSnackbarMessage: Action.create("Show Snackbar message"),
};

export default actions;
