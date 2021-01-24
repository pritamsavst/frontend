import get from "lodash/get";
import set from "lodash/set";
import memoize from "lodash/memoize";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping as _getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar, prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../../ui-utils"
import {
  localStorageGet,
} from "egov-ui-kit/utils/localStorageUtils";
import React from 'react';

export const getTextToLocalMapping = memoize((label) => _getTextToLocalMapping(label));

export const searchApiCallAccountStatement = async (state, dispatch, onInit, offset, limit = 100, hideTable = true) => {
  dispatch(toggleSpinner());
  !!hideTable && showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "offset",
      value: offset
    },
    {
      key: "limit",
      value: limit
    }
  ];
  queryObject = queryObject.filter(({
    value
  }) => !!value)
  
  // const searchBy = get(
  //   state.screenConfiguration.screenConfig,
  //   "property-search.components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.searchBy.props.value",
  //   ""
  // )
  var searchScreenObject = get(state.screenConfiguration.preparedFinalObject,"searchScreenFileNo", {});
  var searchScreenDateObject = get(state.screenConfiguration.preparedFinalObject,"searchScreen", {});
  var siteNumberField = get(state.screenConfiguration.prepareFinalObject,"Properties[0].siteNumber","");

  // var searchScreenObject;
  // if (searchBy == "File Number") {
  //   searchScreenObject = get(
  //     state.screenConfiguration.preparedFinalObject,
  //     "searchScreenFileNo", {}
  //   );
  //   var isSearchBoxValid = validateFields(
  //     "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children",
  //     state,
  //     dispatch,
  //     "property-search"
  //   );
  // }
  // else {
  //   searchScreenObject = get(
  //     state.screenConfiguration.preparedFinalObject,
  //     "searchScreenSiteNo", {}
  //   );
    // var isSearchBoxValid = validateFields(
    //   "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children",
    //   state,
    //   dispatch,
    //   "property-search"
    // );
  // }


 // Date, fileNumber/SiteNumber, sector  needs to be there, other optional 
var isDateValid = validateFields(
"components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.dateContainer",
state,
dispatch,
"property-search"
);
var isCategoryValid = validateFields(
  "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.categoryContainer",
  state,
  dispatch,
  "property-search"
  );
var isfileNumberValid = validateFields(
  "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
  state,
  dispatch,
  "property-search"
  );
  var isSiteNumberValid = validateFields(
    "components.div.children.estateApplicationAccountStatementGen.children.cardContent.children.searchBoxContainer.children.siteContainer",
    state,
    dispatch,
    "property-search"
    );


  if (!isDateValid || !isfileNumberValid || !isSiteNumberValid) {
    dispatch(
      toggleSnackbar(
        true, {
          labelName: "Please fill valid fields to start search",
          labelKey: "ES_ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
    dispatch(toggleSpinner());
  } 
  else if ((Object.keys(searchScreenObject).length == 0 || Object.values(searchScreenObject).every(x => x === "") || Object.values(searchScreenDateObject).every(x => x === ""))) {
    dispatch(
      toggleSnackbar(
        true, {
          labelName: "Please fill at least one field to start search",
          labelKey: "ES_ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
    dispatch(toggleSpinner());
  }
  else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
          queryObject.push({
            key: key,
            value: searchScreenObject[key].trim()
          });
      }
    }

    const response = await getSearchResults(queryObject);
    try {
      const length = response.Properties.length
      dispatch(
        handleField(
          "property-search",
          "components.div.children.searchResults",
          "props.count",
          length
        )
      );

      dispatch(
        handleField(
          "property-search",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Properties"
          )} (${length})`
        )
      );
      let applyButtonStyle = {
        "background-color": "#FE7A51",
        "color": "#fff",
        "height": "30px",
        "padding": "6px 16px",
        "width": "83px"
      }

      let data = response.Properties.map(item => ({
        [getTextToLocalMapping("Action")]: React.createElement('div', {style: applyButtonStyle}, "SELECT"),
        [getTextToLocalMapping("File No")]: item.fileNumber || "-",
        [getTextToLocalMapping("Site Number")]: item.siteNumber,
        [getTextToLocalMapping("Owner Name")]: !!item.propertyDetails.owners ? item.propertyDetails.owners.map(item => item.ownerDetails.ownerName).join(",") || "-" : "-",
        ["propertyId"]: item.propertyDetails.propertyId
      }));

      dispatch(
        handleField(
          "property-search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      !!hideTable && showHideTable(true, dispatch);
      dispatch(toggleSpinner());
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
      dispatch(toggleSpinner());
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "property-search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};