import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import{GetMdmsNameBycode, getWFPayload} from '../../../../../ui-utils/storecommonsapi'
import get from "lodash/get";
import set from "lodash/set";
import {
  creatNonIndentMaterialIssue,
  getNonIndentMaterialIssueSearchResults,
  getPriceListSearchResults,
  updateNonIndentMaterialIssue
} from "../../../../../ui-utils/storecommonsapi";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  samplematerialsSearch,
  
  } from "../../../../../ui-utils/sampleResponses";
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

const setDeactivationDocuments = (state, dispatch) => {
  // GET THE DEACTIVATION DOCUMENTS FROM UPLOAD FILE COMPONENT
  let deactivationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    `deactivationDocuments`,
    []
  );
  // FORMAT THE NEW DOCUMENTS ARRAY ACCORDING TO THE REQUIRED STRUCTURE
  let addedDocuments = deactivationDocuments.map(document => {
    return {
      documentName: get(document, "fileName", ""),
      documentId: get(document, "fileStoreId", ""),
      referenceType: "DEACTIVATION"
    };
  });
  // GET THE PREVIOUS DOCUMENTS FROM EMPLOYEE OBJECT
  let documents = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].documents`,
    []
  );
  // ADD THE NEW DOCUMENTS TO PREVIOUS DOCUMENTS
  documents = [...documents, ...addedDocuments];
  // SAVE THE DOCUMENTS BACK TO EMPLOYEE
  dispatch(prepareFinalObject("Employee[0].documents", documents));
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

export const furnishindentData = (state, dispatch) => {
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
   setDateInYmdFormat(materialIssues[0], ["issueDate", ]);
 
  dispatch(prepareFinalObject("materialIssues", materialIssues));
};

export const handleCreateUpdateIndent = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].id",
    null
  );
  if (id) {
    
    createUpdateIndent(state, dispatch, "UPDATE");
  } else {

  

    

    createUpdateIndent(state, dispatch, "CREATE");
  }
};

export const createUpdateIndent = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
  set(materialIssues[0], "tenantId", tenantId);
  // get set date field into epoch

  let issueDate =
  get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].issueDate",0) 
  issueDate = convertDateToEpoch(issueDate, "dayStart");
  set(materialIssues[0],"issueDate", issueDate);


  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues[0].id",
    null
  );
  if(id === null)
  {
    // set(materialIssues[0],"indentNumber", "");
    // set(materialIssues[0],"indentType", "Indent");
    // set(materialIssues[0],"materialHandOverTo", "Test");
    // set(materialIssues[0],"designation", "");
  }

  if (action === "CREATE") {
    try {
      let wfobject = getWFPayload(state, dispatch)
      console.log(queryObject)
      console.log("queryObject")
      let response = await creatNonIndentMaterialIssue(
        queryObject,        
        materialIssues,
        dispatch,
        wfobject
      );
      if(response){
        let issueNumber = response.materialIssues[0].issueNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALINDENTNOTE&mode=create&code=${issueNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-non-indent-issue-note?applicationNumber=${issueNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`));
      }
    } catch (error) {
      //alert('123')
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updateNonIndentMaterialIssue(
        queryObject,
        materialIssues,
        dispatch
      );
      if(response){
        let issueNumber = response.materialIssues[0].issueNumber
        //dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALINDENTNOTE&mode=update&code=${issueNumber}`));
        dispatch(setRoute(`/egov-store-asset/view-non-indent-issue-note?applicationNumber=${issueNumber}&tenantId=${response.materialIssues[0].tenantId}&Status=${response.materialIssues[0].materialIssueStatus}`));
      }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getMaterialNonIndentData = async (
  state,
  dispatch,
  issueNoteNumber,
  tenantId
) => {
  let queryObject = [
    {
      key: "issueNoteNumber",
      value: issueNoteNumber
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getNonIndentMaterialIssueSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
response = get(response, "materialIssues")
let totalvalue = 0
let TotalQty = 0;
if(response && response[0])
{
for (let index = 0; index < response[0].materialIssueDetails.length; index++) {
  const element = response[0].materialIssueDetails[index];
 let Uomname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.common-masters.UOM",element.uom.code) 
 let matname = GetMdmsNameBycode(state, dispatch,"viewScreenMdmsData.store-asset.Material",element.material.code) 
    set(response[0], `materialIssueDetails[${index}].uom.name`, Uomname);
    set(response[0], `materialIssueDetails[${index}].material.name`, matname);
    set(response[0], `materialIssueDetails[${index}].mrnNumber`, element.materialIssuedFromReceipts[0].materialReceiptDetail.mrnNumber);    
    //set materialReceiptId
    set(response[0], `materialIssueDetails[${index}].receiptId`, element.materialIssuedFromReceipts[0].materialReceiptId);    
    set(response[0], `materialIssueDetails[${index}].totalValue`, Number(element.value));    
    totalvalue = totalvalue+ Number(element.value)   
    TotalQty = TotalQty + Number(element.quantityIssued)
}
if(response[0].issuePurpose ==='WRITEOFFORSCRAP')
set(response[0],`issuePurposeText`, "write-off of material in stock to be scrapped");
else
set(response[0],`issuePurposeText`, "return to supplier");
set(response[0],`totalQty`, TotalQty);
set(response[0],`totalvalue`, totalvalue);
}
  dispatch(prepareFinalObject("materialIssues", response));

  furnishindentData(state, dispatch);
};
