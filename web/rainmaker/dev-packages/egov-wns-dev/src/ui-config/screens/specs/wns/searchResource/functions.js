import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";
import { getTextToLocalMapping } from "./searchApplicationResults";
export const searchApiCall = async (state, dispatch) => {
  showHideApplicationTable(false, dispatch);
  showHideConnectionTable(false, dispatch);
  let getCurrentTab = get(state.screenConfiguration.preparedFinalObject, "currentTab");
  let currentSearchTab = getCurrentTab === undefined ? "SEARCH_CONNECTION" : getCurrentTab;
  if (currentSearchTab === "SEARCH_CONNECTION") {
    resetFieldsForApplication(state, dispatch);
    await renderSearchConnectionTable(state, dispatch);
  } else {
    resetFieldsForConnection(state, dispatch);
    await renderSearchApplicationTable(state, dispatch);
  }
}

const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchConnection", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let waterMeteredDemandExipryDate = 0;
      let waterNonMeteredDemandExipryDate = 0;
      let sewerageNonMeteredDemandExpiryDate = 0;
      let payloadbillingPeriod = "";
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: getTenantIdCommon(),
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
        console.log(payloadbillingPeriod);
      } catch (err) { console.log(err) }
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if (element.connectionNo !== "NA" && element.connectionNo !== null) {
          let queryObjectForWaterFetchBill;
          if (element.service === "WATER") {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
          } else {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
          }

          if (element.service === "WATER" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (element.service === "SEWERAGE" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }

          let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
          billResults ? billResults.Bill.map(bill => {
            let updatedDueDate = 0;
            if (element.service === "WATER") {
              updatedDueDate = (element.connectionType === 'Metered' ?
                (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
                (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
            } else if (element.service === "SEWERAGE") {
              updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
            }
            finalArray.push({
              due: bill.totalAmount,
              dueDate: updatedDueDate,
              service: element.service,
              connectionNo: element.connectionNo,
              name: (element.property) ? element.property.owners[0].name : '',
              status: element.status,
              address: handleAddress(element),
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
          }) : finalArray.push({
            due: 'NA',
            dueDate: 'NA',
            service: element.service,
            connectionNo: element.connectionNo,
            name: (element.property) ? element.property.owners[0].name : '',
            status: element.status,
            address: handleAddress(element),
            connectionType: element.connectionType,
            tenantId: element.tenantId
          })
        }

      }
      showConnectionResults(finalArray, dispatch)
    } catch (err) { console.log(err) }
  }
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult, getSearchResultForSewerage;
      if (searchScreenObject.applicationType === "New Water connection") {
        getSearchResult = getSearchResults(queryObject)
      } else if (searchScreenObject.applicationType === "New Sewerage Connection") {
        getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      } else {
        getSearchResult = getSearchResults(queryObject),
          getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      }
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []

      let appNo = "";
      let combinedWFSearchResults = [];
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          appNo = appNo + element.applicationNo + ",";
        }
        if (i % 50 === 0 || i === (combinedSearchResults.length - 1)) {
          //We are trying to fetch 50 WF objects at a time
          appNo = appNo.substring(0, appNo.length - 1);
          const queryObj = [
            { key: "businessIds", value: appNo },
            { key: "history", value: true },
            { key: "tenantId", value: getTenantIdCommon() }
          ];
          let wfResponse = await getWorkFlowData(queryObj);
          if (wfResponse !== null && wfResponse.ProcessInstances !== null) {
            combinedWFSearchResults = combinedWFSearchResults.concat(wfResponse.ProcessInstances);
          }
          appNo = "";
        }
      }
      /*const queryObj = [
        { key: "businessIds", value: appNo },
        { key: "history", value: true },
        { key: "tenantId", value: getTenantIdCommon() }
      ];
      let Response = await getWorkFlowData(queryObj);*/
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        let appStatus;
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          appStatus = combinedWFSearchResults.filter(item => item.businessId.includes(element.applicationNo))[0]
          if (appStatus !== undefined && appStatus.state !== undefined) {
            appStatus = appStatus.state.applicationStatus;
          } else {
            appStatus = "NA";
          }
          if (element.property && element.property.owners &&
            element.property.owners !== "NA" &&
            element.property.owners !== null &&
            element.property.owners.length > 1) {
            let ownerName = "";
            element.property.owners.forEach(ele => { ownerName = ownerName + ", " + ele.name })

            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              name: ownerName.slice(2),
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
          } else {
            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : "",
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
          }
        }
      }
      showApplicationResults(finalArray, dispatch)
    } catch (err) { console.log(err) }
  }
}

const handleAddress = (element) => {
  let city = (
    element.property &&
    element.property !== "NA" &&
    element.property.address !== undefined &&
    element.property.address.city !== undefined &&
    element.property.address.city !== null
  ) ? element.property.address.city : "";
  let localityName = (
    element.property &&
    element.property !== "NA" &&
    element.property.address.locality !== undefined &&
    element.property.address.locality !== null &&
    element.property.address.locality.name !== null
  ) ? element.property.address.locality.name : "";

  return (city === "" && localityName === "") ? "NA" : `${localityName}, ${city}`;
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showConnectionResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Status")]: item.status,
    [getTextToLocalMapping("Due")]: item.due,
    [getTextToLocalMapping("Address")]: item.address,
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    [getTextToLocalMapping("tenantId")]: item.tenantId,
    [getTextToLocalMapping("connectionType")]: item.connectionType
  }));
  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}

const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Application No")]: item.applicationNo,
    [getTextToLocalMapping("Application Type")]: item.service === "WATER" ? "New Water Connection" : "New Sewerage Connection",
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Application Status")]: item.applicationStatus.split("_").join(" "),
    [getTextToLocalMapping("Address")]: item.address,
    [getTextToLocalMapping("tenantId")]: item.tenantId,
    [getTextToLocalMapping("service")]: item.service,
    [getTextToLocalMapping("connectionType")]: item.connectionType,
  }));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.rows",
    connections.length
  ));
  showHideApplicationTable(true, dispatch);
}

