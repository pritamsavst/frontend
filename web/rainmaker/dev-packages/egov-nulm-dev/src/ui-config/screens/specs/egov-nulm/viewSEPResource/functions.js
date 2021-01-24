import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createEmployee,
  getSearchResults,
  updateEmployee
} from "../../../../../ui-utils/commons";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  handleCardDelete } from "../../../../../ui-utils/commons";
import{httpRequest} from '../../../../../ui-utils/api';
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../../ui-utils/commons'
// SET ALL SIMPLE DATES IN YMD FORMAT
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};

// SET ALL MULTIPLE OBJECT DATES IN YMD FORMAT
const setAllDatesInYmdFormat = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        set(
          obj,
          `${element.object}[${i}].${item}`,
          epochToYmdDate(get(obj, `${element.object}[${i}].${item}`))
        );
      });
    }
  });
};

// SET ALL MULTIPLE OBJECT EPOCH DATES YEARS
const setAllYears = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        let ymd = epochToYmdDate(get(obj, `${element.object}[${i}].${item}`));
        let year = ymd ? ymd.substring(0, 4) : null;
        year && set(obj, `${element.object}[${i}].${item}`, year);
      });
    }
  });
};

const setRolesData = obj => {
  let roles = get(obj, "user.roles", []);
  let newRolesArray = [];
  roles.forEach(element => {
    newRolesArray.push({
      label: element.name,
      value: element.code
    });
  });
  set(obj, "user.roles", newRolesArray);
};

const returnEmptyArrayIfNull = value => {
  if (value === null || value === undefined) {
    return [];
  } else {
    return value;
  }
};

export const setRolesList = (state, dispatch) => {
  let rolesList = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].user.roles`,
    []
  );
  let furnishedRolesList = rolesList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "hrms.reviewScreen.furnishedRolesList",
      furnishedRolesList.join()
    )
  );
};



// Remove objects from Arrays not having the specified key (eg. "id")
// and add the key-value isActive:false in those objects having the key
// so as to deactivate them after the API call
const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};


export const handleForwardToTFCSEP = (state, dispatch) =>{
  handleCreateUpdateSEP(state, dispatch,FORWARD_TO_TASK_FORCE_COMMITTEE)
};

export const handleSubmitSEP = (state, dispatch) =>{
  const status = window.localStorage.getItem("SEP_Status");

  if(process.env.REACT_APP_NAME === "Employee"){
      if(status === FORWARD_TO_TASK_FORCE_COMMITTEE){
      const tfcStatus =  get(state, 'screenConfiguration.preparedFinalObject.NULMSEPRequest.taskCommitteeStatus');
        if(tfcStatus === "Approved by Task Force Committee")
            handleCreateUpdateSEP(state, dispatch,APPROVED_BY_TASK_FORCE_COMMITTEE);
        else 
          handleCreateUpdateSEP(state, dispatch,REJECTED_BY_TASK_FORCE_COMMITTEE); 
      }
    else if (status === APPROVED_BY_TASK_FORCE_COMMITTEE){
      const tfcStatus =  get(state, 'screenConfiguration.preparedFinalObject.NULMSEPRequest.taskCommitteeStatus');
      if(tfcStatus === "Approved by Task Force Committee")
          handleCreateUpdateSEP(state, dispatch,SENT_TO_BANK_FOR_PROCESSING);
      else 
        handleCreateUpdateSEP(state, dispatch,REJECTED_BY_TASK_FORCE_COMMITTEE); 
    }
    else if(status === SENT_TO_BANK_FOR_PROCESSING){
      handleCreateUpdateSEP(state, dispatch,SANCTION_BY_BANK); 
    }
  
    window.localStorage.removeItem("SEP_Status");
  }
  else{
    handleCreateUpdateSEP(state, dispatch,"Created");
  }
  
};
export const handlesaveSEP = (state, dispatch) =>{
  handleCreateUpdateSEP(state, dispatch,"Drafted")
};
export const handleRejectSEP = (state, dispatch) =>{
  handleCreateUpdateSEP(state, dispatch,"Rejected")
};
export const handleApproveSEP = async(state, dispatch) =>{
 handleCreateUpdateSEP(state, dispatch,"Approved");
 const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
 let uuid = get(
  state.screenConfiguration.preparedFinalObject,
  "NULMSEPRequest.applicationUuid",
  null
);
let applicationId = get(
  state.screenConfiguration.preparedFinalObject,
  "NULMSEPRequest.applicationId",
  null
);
// let NULMSEPRequest ={}
// NULMSEPRequest.applicationUuid = uuid;
// NULMSEPRequest.tenantId = tenantId;
// NULMSEPRequest.applicationStatus = "Approved";

// const requestBody = {NULMSEPRequest}
// try {
//   const response = await httpRequest(
//     "post",
//     "/nulm-services/v1/sep/_updateAppStatus",
//     "",
//     queryObject,
//     requestBody
//   );
//    if(response){
//     dispatch(setRoute(`/egov-nulm/acknowledgement?screen=sep&mode=update&code=${applicationId}`));
//    }

// } catch (error) {
//   dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
// }
};



export const handleCreateUpdateSEP = (state, dispatch,status) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "NULMSEPRequest.applicationUuid",
    null
  );
  if (uuid) {
    createUpdatePO(state, dispatch, "UPDATE",status);
  } else {
    createUpdatePO(state, dispatch, "CREATE",status);
  }
};

export const createUpdatePO = async (state, dispatch, action,status) => {

  let NULMSEPRequest = get(
    state.screenConfiguration.preparedFinalObject,
    "NULMSEPRequest",
    []
  );
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
  NULMSEPRequest.tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 //setting status
   NULMSEPRequest.applicationStatus = status;

let dob = get(NULMSEPRequest, "dob");
  // const formattedDOB = dob.split("-").reverse().join("-");

  // set(
  //   NULMSEPRequest,
  //   "dob",
  //   formattedDOB
  // );

  const radioButtonValue = ["isUrbanPoor","isMinority","isHandicapped","isRepaymentMade","isLoanFromBankinginstitute","isDisabilityCertificateAvailable"];
    
  radioButtonValue.forEach(value => {
    if(NULMSEPRequest[value] && NULMSEPRequest[value]==="Yes" ){
      set( NULMSEPRequest, value, true );
    }else{
      set( NULMSEPRequest, value, false );
    }
  })
  
 set( NULMSEPRequest, "age", Number(NULMSEPRequest["age"]) );
  const requestBody = {NULMSEPRequest};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/sep/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=sep&mode=create&code=${response.ResponseBody.applicationId}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/sep/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=sep&mode=update&code=${response.ResponseBody.applicationId}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};


