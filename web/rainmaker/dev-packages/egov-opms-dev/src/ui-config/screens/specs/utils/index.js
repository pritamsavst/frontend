import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  getUserInfo, getOPMSTenantId, getapplicationType, localStorageGet, lSRemoveItem,
  setOPMSTenantId, lSRemoveItemlocal, getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getQueryArg,
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import isUndefined from "lodash/isUndefined";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {

  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );

  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};
export const validateFieldsAdv = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {

  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );

  let isFormValid = true;
  for (var variable in fields) {
    if (variable === "exemptedCategory") {

    }
    else {
      if (fields.hasOwnProperty(variable)) {
        if (
          fields[variable] &&
          fields[variable].props &&
          (fields[variable].props.disabled === undefined ||
            !fields[variable].props.disabled) &&
          !validate(
            screen,
            {
              ...fields[variable],
              value: get(
                state.screenConfiguration.preparedFinalObject,
                fields[variable].jsonPath
              )
            },
            dispatch,
            true
          )
        ) {
          isFormValid = false;
        }
      }
    }
  }
  return isFormValid;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = () => {
  var today = new Date();
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth > 3) {
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  return fiscalYr;
};

export const getFinancialYearDates = (format, et) => {
  /** Return the starting date and ending date (1st April to 31st March)
   *  of the financial year of the given date in ET. If no ET given then
   *  return the dates for the current financial year */
  var date = !et ? new Date() : new Date(et);
  var curMonth = date.getMonth();
  var financialDates = { startDate: "NA", endDate: "NA" };
  if (curMonth > 3) {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(
          date.getFullYear() - 1
        ).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(
          date.getFullYear() - 1
        ).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
    }
  }
  return financialDates;
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["home"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("home", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const OPMSTenantId = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );
  setOPMSTenantId(tenantId);
  window.location.href =
    process.env.NODE_ENV === "production"
      ? `/egov-opms/home?tenantId=${tenantId}`
      : `/egov-opms/home?tenantId=${tenantId}`;
}

export const gotoApplyWithStep = (state, dispatch, step) => {

  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberQueryString = applicationNumber ? `&applicationNumber=${applicationNumber}` : ``;
  const tetantQueryString = applicationNumber ? `&tenantId=${getOPMSTenantId()}` : ``;
  const applicationTpye = getapplicationType();
  let applyUrl = '';

  applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-opms/apply?step=${step}${applicationNumberQueryString}`
    : applicationTpye === `PETNOC` ?
      `/egov-opms/apply?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
      applicationTpye === `SELLMEATNOC` ?
        `/egov-opms/applysellmeat?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
        applicationTpye === `ROADCUTNOC` ?
          `/egov-opms/applyroadcuts?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
          applicationTpye === `ADVERTISEMENTNOC` ?
            `/egov-opms/advertisementApply?step=${step}${applicationNumberQueryString}${tetantQueryString}` : ``
    ;


  dispatch(setRoute(applyUrl));
};
export const showHideAdhocPopups = (state, dispatch, screenKey) => {

  //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.undertakingdialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.undertakingdialog", "props.open", !toggle)
  );
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {

  //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
  // window.location='/egov-opms/search-preview';
};



export const showHideAdhocPopupopms = (state, dispatch, screenKey, type) => {

  localStorage.setItem('updateNocType', type)
  // //alert(  localStorage.getItem('updateNocType')+type)
  // set(
  //   state,
  //   "screenConfig.components.adhocDialog.children.popup",
  //   adhocPopup2
  // );
  ////alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
    );

  }, 500);

  /*
  
  export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {
  
    setTimeout(function () {
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog3.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog3", "props.open", !toggle)
      );
  
      }, 500);
    
   };
   */
}
export const showHideAdhocPopupopmsReassign = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog2.props.open",
      false
    );
    dispatch(prepareFinalObject("PetNoc[0].PetNocDetails", {}));

    dispatch(
      handleField(screenKey, "components.adhocDialog2", "props.open", !toggle)
    );

  }, 500);

};
/* export const showHideAdhocPopupopmsApprove = (state, dispatch, screenKey,type) => {
     
     setTimeout(function(){ 
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog1.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog1", "props.open", !toggle)
      ); 
  
      }, 500);
    
   }; */
export const getCommonGrayCard = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      body: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          ch1: getCommonCard(children, {
            style: {
              backgroundColor: "rgb(242, 242, 242)",
              boxShadow: "none",
              borderRadius: 0,
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};

export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};


export const getReceiptData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "collection-services/payments/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getMdmsData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_get",
      "",
      queryObject
    );


    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const fetchBill = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post", "/billing-service/bill/v2/_fetchbill", "",
      queryObject
    );


    // If pending payment then get bill else get receipt
    let billData = get(response, "Bill");
    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", estimateData));
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post", "/billing-service/bill/v2/_search", "",
      queryObject
    );

    let activeBillData = get(response, "Bill");
    const bills = activeBillData.filter(bill => bill.status === "ACTIVE" || bill.status === "PAID");



    return bills;
  } catch (error) {
    console.log(error);
  }
};
export const searchBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];

    // Get Receipt
    //    let payload = await httpRequest("post", "/collection-services/payments/_search", "", queryObject);

    // Get Bill
    const response = await getBill([
      { key: "tenantId", value: tenantId },
      { key: "consumerCode", value: applicationNumber },
      { key: "businessService", value: `OPMS.${getapplicationType()}` }
    ]);


    // If pending payment then get bill else get receipt
    //Payments[0].paymentDetails[0].bill
    //   let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");
    let billData = response
    //|| get(payload, "Payments[0].paymentDetails[0].bill");
    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", estimateData));
    }
    return response;
  } catch (e) {
    console.log(e);
  }
};


export const createDemandForRoadCutNOC = async (state, ispatch, applicationNumber, tenantId, divisionCode) => {
  try {
    let amount =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].amount");
    let performancebankguaranteecharges =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].performancebankguaranteecharges");
    let gstamount =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].gstamount");
    let userInfo = JSON.parse(getUserInfo());
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;
    userInfo.photo = null;

    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;

    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr,
            "applicationNumber": applicationNumber,
            "applicationType": getapplicationType(), // "ROADCUTNOC",
            "amountRoadCut": amount,
            "bankPerformanceRoadCut": performancebankguaranteecharges,
            "gstRoadCut": gstamount,
            "owners": [userInfo],
            "tenantId": getOPMSTenantId(),
            "roadCutDivision": divisionCode
          },
          "applicationNumber": applicationNumber,
          "tenantId": getOPMSTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pm-calculator/v1/_calculate",
      "",
      queryObject,
      querydemand
    );
    return payload
  } catch (e) {
    console.log(e);
  }
};


export const checkForRole = (roleList, roleToCheck) => {
  return roleList.map(role => {
    return role.code
  }).includes(roleToCheck)
}

export const searchdemand = async (dispatch, applicationNumber, tenantId) => {
  try {
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
    let userInfo = JSON.parse(getUserInfo());

    console.log('userInfo', userInfo);
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;
    userInfo.photo = null;

    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr, // "2019-20",
            "applicationNumber": applicationNumber,
            "applicationType": getapplicationType(),  //"PETNOC",
            "owners": [userInfo],
            "tenantId": getOPMSTenantId(),
          },
          "applicationNumber": applicationNumber,
          "tenantId": getOPMSTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pm-calculator/v1/_calculate",
      "",
      queryObject,
      querydemand
    );



    //    Get Bill
    const response = await fetchBill([
      { key: "tenantId", value: tenantId },
      { key: "consumerCode", value: applicationNumber },
      { key: "businessService", value: `OPMS.${getapplicationType()}` }
    ], dispatch);

    //  If pending payment then get bill else get receipt
  } catch (e) {
    console.log(e);
  }
};


export const createEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        order: item.order,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  fees.sort(function (x, y) {
    return x.order - y.order;
  });
  return fees;
};

export const generateBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    if (applicationNumber && tenantId) {
      const queryObj = [
        { key: "tenantId", value: tenantId },
        { key: "consumerCode", value: applicationNumber },
        { key: "businessService", value: `OPMS.${getapplicationType()}` }
      ];
      const payload = await getBill(queryObj);

      if (payload) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload));
        const estimateData = createEstimateData(payload);
        estimateData &&
          estimateData.length &&
          dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", estimateData));
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

export const getTextToLocalMapping = label => {

  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "applicationId",
        localisationLabels
      );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "applicationStatus",
        localisationLabels
      );
    case "Applicant Name":
      return getLocaleLabels(
        "Applicant Name",
        "applicantName",
        localisationLabels
      );
    case "NOC No":
      return getLocaleLabels(
        "NOC No",
        "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
        localisationLabels
      );

    case "NOC Type":
      return getLocaleLabels("NOC Type", "NOC_TYPE_LABEL", localisationLabels);
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "NOC_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );




    //master
    case "Price Book Id":
      return getLocaleLabels(
        "Price Book Id",
        "priceBookId",
        localisationLabels
      );

    case "categoryId":
      return getLocaleLabels(
        "categoryId",
        "categoryId",
        localisationLabels
      );
    case "subCategoryId":
      return getLocaleLabels(
        "subCategoryId",
        "subCategoryId",
        localisationLabels
      );
    case "perDayPrice":
      return getLocaleLabels(
        "perDayPrice",
        "perDayPrice",
        localisationLabels
      );
    case "perWeekPrice":
      return getLocaleLabels(
        "perWeekPrice",
        "perWeekPrice",
        localisationLabels
      );
    case "perMonthPrice":
      return getLocaleLabels(
        "perMonthPrice",
        "perMonthPrice",
        localisationLabels
      );
    case "annualPrice":
      return getLocaleLabels(
        "annualPrice",
        "annualPrice",
        localisationLabels
      );
    case "effectiveFromDate":
      return getLocaleLabels(
        "effectiveFromDate",
        "effectiveFromDate",
        localisationLabels
      );
    case "effectiveToDate":
      return getLocaleLabels(
        "effectiveToDate",
        "effectiveToDate",
        localisationLabels
      );
    //reprt1

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "NOC_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );

    //master
    case "applcationType":
      return getLocaleLabels(
        "applcationType",
        "applcationType",
        localisationLabels
      );

    case "totalNoOfApplicationReceived":
      return getLocaleLabels(
        "totalNoOfApplicationReceived",
        "totalNoOfApplicationReceived",
        localisationLabels
      );
    case "noOfApplicationProcessed":
      return getLocaleLabels(
        "noOfApplicationProcessed",
        "noOfApplicationProcessed",
        localisationLabels
      );
    case "noOfApplicationPending":
      return getLocaleLabels(
        "noOfApplicationPending",
        "noOfApplicationPending",
        localisationLabels
      );
    case "noOfApplicationRejected":
      return getLocaleLabels(
        "noOfApplicationRejected",
        "noOfApplicationRejected",
        localisationLabels
      );

    case "totalNoOfApplicationApproved":
      return getLocaleLabels(
        "totalNoOfApplicationApproved",
        "totalNoOfApplicationApproved",
        localisationLabels
      );
    case "revenueCollected":
      return getLocaleLabels(
        "revenueCollected",
        "revenueCollected",
        localisationLabels
      );
    case "totalNoApplicationApprovedWithNilCharges":
      return getLocaleLabels(
        "totalNoApplicationApprovedWithNilCharges",
        "totalNoApplicationApprovedWithNilCharges",
        localisationLabels
      );


    case "avgTimeTakenToProcessRequest":
      return getLocaleLabels(
        "avgTimeTakenToProcessRequest",
        "avgTimeTakenToProcessRequest",
        localisationLabels
      );

    case "pendingMoreThan10AndLessThan30Days":
      return getLocaleLabels(
        "pendingMoreThan10AndLessThan30Days",
        "pendingMoreThan10AndLessThan30Days",
        localisationLabels
      );
    case "sector":
      return getLocaleLabels(
        "sector",
        "sector",
        localisationLabels
      );
    case "pendingMoreThan30Days":
      return getLocaleLabels(
        "pendingMoreThan30Days",
        "pendingMoreThan30Days",
        localisationLabels
      );

    case "YearMonth":
      return getLocaleLabels(
        "YearMonth",
        "YearMonth",
        localisationLabels
      );


    case "approve":
      return getLocaleLabels(
        "approve",
        "approve",
        localisationLabels
      );
    case "rev":
      return getLocaleLabels(
        "rev",
        "rev",
        localisationLabels
      );

    case "exempted":
      return getLocaleLabels(
        "exempted",
        "exempted",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "NOC_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWPM_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "NOC_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "NOC_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);

  }
};

export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog3.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog3", "props.open", !toggle)
    );

  }, 500);

};
/*
export const showHideAdhocPopupopmsReassign = (state, dispatch, screenKey,type) => {
    
    setTimeout(function(){ 
     let toggle = get(
       state.screenConfiguration.screenConfig[screenKey],
       "components.adhocDialog2.props.open",
       false
     );
     dispatch(
       handleField(screenKey, "components.adhocDialog2", "props.open", !toggle)
     ); 
 
     }, 500);
   
  };
  */

export const showHideAdhocPopupopmsApprove = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog1.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog1", "props.open", !toggle)
    );

  }, 500);

};
export const showHideAdhocPopupopmsForward = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialogForward.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialogForward", "props.open", !toggle)
    );

  }, 500);

};

export const getOPMSPattern = type => {
  switch (type) {
    case "cin":
      return /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/i;
    case "petnocApplicantName":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’0-9]{1,50}$/i;
    // case "petnocIdentificationMark":
    //   return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’0-9]{1,100}$/i;
    case "VeterinaryRegistrationNo":
      return /^[a-zA-Z0-9 \/-]{1,50}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "Address":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "Email":
      return /^(?=^.{1,50}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Amount":
      return /^\d{1,7}(\.\d{1,2})?$/i;
    case "Division":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,25}$/i;
    case "ROADCUTFEE":
      return /^\d{1,12}(\.\d{1,2})?$/i;
    // case "Remarks":
    //   return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”]{1,128}$/i;
    case "BadgeNumber":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}&#,\[\]*.:;“”‘’]{1,50}$/i;
    case "typeofroadcut":
      return /^[a-zA-Z0-9-, ]{1,200}$/i;
    case "petnocIdentificationMark":
      return /^[a-zA-Z0-9-!%:;“”‘’*=@\n\r#?\\\\~`$&^<>?{}[\]|()\\-`.+,/\"' ]{1,100}$/i;

    case "Remarks":
      return /^[a-zA-Z0-9.',\n\r ]{1,128}$/i;
    case "TexrearAddress":
      return /^[a-zA-Z0-9-\/,()_'&.\"\n\r ]{1,128}$/i;

  }
};


export const createDemandForAdvNOC = async (state, ispatch) => {
  try {


    let advdetails = get(state.screenConfiguration.preparedFinalObject, "ADVTCALCULATENOC");

    let durationAdvertisement = advdetails.duration; // JSON.parse(advdetails).duration;
    let fromDateAdvertisement = advdetails.fromDateToDisplay;
    let toDateAdvertisement = advdetails.toDateToDisplay;
    let squareFeetAdvertisement = advdetails.space;
    let exemptedCategory = advdetails.exemptedCategory;
    let userInfo = JSON.parse(getUserInfo());
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;
    userInfo.photo = null;
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;


    let queryObject = [
      { key: "tenantId", value: getOPMSTenantId() },
      { key: "consumerCodes", value: getapplicationNumber() }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr,
            "applicationNumber": getapplicationNumber(),
            "applicationType": getapplicationType(), //"ADVERTISEMENTNOC",
            "isExamptedAdvertisement": exemptedCategory,
            "categoryIdAdvertisement": localStorageGet('this_adv_id'),
            "subCategotyIdAdvertisement": localStorageGet('this_sub_adv_id'),
            "durationAdvertisement": durationAdvertisement,
            "fromDateAdvertisement": fromDateAdvertisement,
            "toDateAdvertisement": toDateAdvertisement,
            "squareFeetAdvertisement": squareFeetAdvertisement,
            "owners": [userInfo],
            "tenantId": getOPMSTenantId()
          },
          "applicationNumber": getapplicationNumber(),
          "tenantId": getOPMSTenantId(),
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest("post", "/pm-calculator/v1/_calculate", "",
      queryObject,
      querydemand
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const clearlocalstorageAppDetails = (state) => {
  set(state, "screenConfiguration.preparedFinalObject", {});
  lSRemoveItemlocal('applicationType');
  lSRemoveItemlocal('applicationNumber');
  lSRemoveItemlocal('applicationStatus');
  lSRemoveItemlocal('footerApplicationStatus');
  lSRemoveItemlocal('app_noc_status');
  lSRemoveItemlocal('this_adv_code');
  lSRemoveItemlocal('this_adv_id');
  lSRemoveItemlocal('ApplicationNumber');
  lSRemoveItemlocal('gstAmount');
  lSRemoveItemlocal('amount');
  lSRemoveItemlocal('performanceBankGuaranteeCharges');
  lSRemoveItemlocal('applicationMode');
  lSRemoveItemlocal('undertakig');
  lSRemoveItemlocal('this_sub_adv_id');
  lSRemoveItemlocal('this_sub_adv_code');
  lSRemoveItemlocal('undertaking');

  lSRemoveItem('ApplicationNumber');
  lSRemoveItem('applicationType');
  lSRemoveItem('applicationNumber');
  lSRemoveItem('applicationStatus');
  lSRemoveItem('footerApplicationStatus');
  lSRemoveItem('app_noc_status');
  lSRemoveItem('this_adv_code');
  lSRemoveItem('this_adv_id');
  lSRemoveItem('gstAmount');
  lSRemoveItem('amount');
  lSRemoveItem('performanceBankGuaranteeCharges');
  lSRemoveItem('applicationMode');
  lSRemoveItem('undertakig');
  lSRemoveItem('this_sub_adv_code');
  lSRemoveItem('this_sub_adv_id');
  lSRemoveItem('undertaking');
}