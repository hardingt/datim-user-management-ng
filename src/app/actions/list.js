import * as actions from "../constants/ActionTypes";
import filterCategories from "../components/filter/filterCategories";

const filterString = (category, value) => {
  const filterParam = filterCategories[category].param;
  return value ? `${filterParam}${value}` : null;
};

export function getUserListing() {
  return (dispatch, getState) => {
    const state = getState();
    //TODO: create selector
    const filters = Object.values(state.list.filters);
    const page = state.list.currentPage;
    const d2 = state.core.d2;

    dispatch({
      type: actions.SHOW_PROCESSING,
      status: true,
    });

    let params = {
      paging: true,
      fields:
        "id,surname,firstName,email,employer,displayName,userCredentials[username,disabled,lastLogin]",
      page: page,
    };

    const filterStrings = filters
      .filter(f => f.detail.length > 0)
      .map(filter => filterString(filter.category, filter.detail));

    if (filterStrings.length > 0) {
      params.filter = filterStrings;
    }

    d2.models.users
      .list(params)
      .then(u => {
        dispatch({
          type: actions.SET_USERS,
          data: u.toArray(),
        });
        dispatch({
          type: actions.SET_PAGER,
          data: u.pager,
        });
        dispatch({
          type: actions.HIDE_PROCESSING,
          status: false,
        });
      })
      .catch(e => {
        dispatch({
          type: actions.HIDE_PROCESSING,
          status: false,
        });
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
  };
}

export const setFilter = data => dispatch => {
  try {
    dispatch({ type: actions.SET_FILTER, data });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error setting filter: ", err);
    return err;
  }
};

export const removeFilter = data => dispatch => {
  try {
    dispatch({ type: actions.REMOVE_FILTER, data });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error removing filter: ", err);
    return err;
  }
};

export const removeFilters = () => dispatch => {
  try {
    dispatch({ type: actions.REMOVE_FILTERS });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error removing filters: ", err);
    return err;
  }
};

export function setSelectedUser(user) {
  return dispatch => {
    dispatch({ type: actions.SET_USER, data: user });
  };
}

export function setFilters(filters) {
  return dispatch => {
    dispatch({ type: actions.SET_FILTERS, data: filters });
  };
}

export function setCurrentPage(page) {
  return dispatch => {
    dispatch({ type: actions.SET_CURRENT_PAGE, data: page });
  };
}

export function setTab(tab) {
  return dispatch => {
    dispatch({ type: actions.SET_TAB, data: tab });
  };
}
