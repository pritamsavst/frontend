import {
  dispatchMultipleFieldChangeAction,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getCommonApplyFooter,validateFields } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from 'lodash/set';
import { httpRequest } from "../../../../../ui-utils";
import {
  prepareDocumentsUploadData,
  applyForWaterOrSewerage,
  pushTheDocsUploadedToRedux,
  findAndReplace,
  applyForSewerage,
  applyForWater,
  validateFeildsForBothWaterAndSewerage,
  validateFeildsForWater,
  validateFeildsForSewerage,
  validateConnHolderDetails,
  isActiveProperty,
  showHideFieldsFirstStep,
  isModifyMode,
  isModifyModeAction
} from "../../../../../ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
 
const setReviewPageRoute = (state, dispatch) => {
  const service = getQueryArg(window.location.href, "service");
  let tenantId = getTenantIdCommon();
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.applicationNo");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl =  service ?
  `${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited="true"&service=${service}`
  :`${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited="true"`;
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;
let validateDocumentselect = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");

    if (isDocumentRequired) {
      let documents = get(documentsFormat[i], "documents");
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          let dropdownData=get(documentsFormat[i],"dropdown.value");
          if(dropdownData){
          // if (get(documentsFormat[i], "dropdown.value") !== null && get(documentsFormat[i]).dropdown !==undefined ){
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            validateDocumentselect = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  return validateDocumentField;
};


const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId, moduleDetails: [
        { moduleName: "ws-services-masters", masterDetails: [{ name: "Documents" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData.applyScreen.Documents", payload.MdmsRes['ws-services-masters'].Documents));
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};
const removingDocumentsWorkFlow = (state, dispatch) =>{
  const {screenConfiguration} = state;
  const {preparedFinalObject} = screenConfiguration;
  const {documentsUploadRedux} = preparedFinalObject;

  if(documentsUploadRedux){
    let newDocumentsUploadRedux = Object.assign({},documentsUploadRedux)
        Object.keys(documentsUploadRedux).map(val => {
          if(newDocumentsUploadRedux[val].documents)
              delete newDocumentsUploadRedux[val].documents;

           if(newDocumentsUploadRedux[val].dropdown)
           delete newDocumentsUploadRedux[val].dropdown;
        })

        console.log(newDocumentsUploadRedux,"testintg")
  }
}
const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  let isFormValid = true;
  let hasFieldToaster = false;
  //window.localStorage.setItem("ActivityStatusFlag","false");
  if (activeStep === 0) {
    // if (validatePropertyLocationDetails && validatePropertyDetails && validateForm) {
    //   isFormValid = await appl;
    // }



    if (getQueryArg(window.location.href, "action") === "edit") {
      let application = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      const uploadedDocData = application.documents;
      const reviewDocData = uploadedDocData && uploadedDocData.map(item => {
        return {
          title: `WS_${item.documentType}`,
          link: item.fileUrl && item.fileUrl.split(",")[0],
          linkText: "View",
          name: item.fileName
        };
      });
      dispatch(prepareFinalObject("applyScreen.reviewDocData", reviewDocData));
      let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
       //connectionholdercode
       let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
       let holderData = connectionHolderObj[0];
        if (holderData !== null && holderData !== undefined) {
          if (holderData.sameAsPropertyAddress === true) {
            holderData = null
          }
        }
        if (holderData == null) {
          applyScreenObject.connectionHolders = holderData;
       } else {
          let arrayHolderData = [];
          arrayHolderData.push(holderData);
          applyScreenObj.connectionHolders = arrayHolderData;
        }

      if(!isActiveProperty(applyScreenObj.property)){
        dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObj.property.status}`, labelName: `Property Status is ${applyScreenObj.property.status}` }, "warning"));     
        showHideFieldsFirstStep(dispatch,"",false);        
        dispatch(prepareFinalObject("applyScreen", applyScreenObj));
        return false;
      }
      // if wnsStatus is present then check the required fields
const wnsStatus =  window.localStorage.getItem("WNS_STATUS");
if(wnsStatus && wnsStatus === "CONNECTION_CONVERSION"){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.connConversionDetails.children.cardContent.children.connectionConversionDetails.children.ConnectionConversionDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  removingDocumentsWorkFlow(state, dispatch) ;
  try{
    let abc = await applyForWater(state, dispatch);
    window.localStorage.setItem("ActivityStatusFlag","true");
  }catch (err){
    console.log("errrr")
  }
}
else if(wnsStatus && wnsStatus === "UPDATE_CONNECTION_HOLDER_INFO"){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  removingDocumentsWorkFlow(state, dispatch) ;
  try{
    let abc = await applyForWater(state, dispatch);
    window.localStorage.setItem("ActivityStatusFlag","true");
 
  }catch (err){
    console.log("errrr")
  }
} 
else if(wnsStatus && (wnsStatus === "REACTIVATE_CONNECTION"||wnsStatus === "TEMPORARY_DISCONNECTION"||wnsStatus === "PERMANENT_DISCONNECTION")){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.commentSectionDetails.children.cardContent.children.commentDetails.children.CommentDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  removingDocumentsWorkFlow(state, dispatch) ;
  try{
    let abc = await applyForWater(state, dispatch);
    window.localStorage.setItem("ActivityStatusFlag","true");
  }catch (err){
    console.log("errrr")
  }
 
}

    } else {

      const isPropertyUsageValid= validateFields(
        "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
        state,
        dispatch,
        "apply"
      );
      if(!isPropertyUsageValid){
        isFormValid = false;
      }
      const water = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.water"
      );
      const sewerage = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.sewerage"
      );
      const tubewell = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.tubewell"
      );
      const searchPropertyId = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen.propertyIds"
      )
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
      //connectionholdercode

     let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
     let holderData = connectionHolderObj[0];
      if (holderData !== null && holderData !== undefined) {
        if (holderData.sameAsPropertyAddress === true) {
          holderData = null
        }
      }
      if (holderData == null) {
        applyScreenObject.connectionHolders = holderData;
     } else {
        let arrayHolderData = [];
        arrayHolderData.push(holderData);
        applyScreenObject.connectionHolders = arrayHolderData;
      }
      if (searchPropertyId !== undefined && searchPropertyId !== "") {
        if(!isActiveProperty(applyScreenObject.property)){
          dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObject.property.status}`, labelName: `Property Status is ${applyScreenObject.property.status}` }, "warning"));     
          showHideFieldsFirstStep(dispatch,"",false);
          return false;
        }
        // TODO else part update propertyId.
        if (validateConnHolderDetails(applyScreenObject)) {
                   isFormValid = true;
                   hasFieldToaster = false;
        if (applyScreenObject.water || applyScreenObject.sewerage || applyScreenObject.tubewell) {
          if (
            applyScreenObject.hasOwnProperty("property") &&
            !_.isUndefined(applyScreenObject["property"]) &&
            !_.isNull(applyScreenObject["property"]) &&
            !_.isEmpty(applyScreenObject["property"])
          ) {
            if ((water && sewerage) ||(sewerage && tubewell)) {
              if (water && sewerage && validateFeildsForBothWaterAndSewerage(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } 
              else if (tubewell && validateFeildsForSewerage(applyScreenObject) ){
                isFormValid = true;
                hasFieldToaster = false;
              }
                else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            } else if (water) {
              if (validateFeildsForWater(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            } else if (sewerage) {
              if (validateFeildsForSewerage(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            }
          } else {
            isFormValid = false;
            dispatch(
              toggleSnackbar(
                true, {
                labelKey: "ERR_WS_PROP_NOT_FOUND",
                labelName: "No Property records found, please search or create a new property"
              },
                "warning"
              )
            );
          }
          let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
          let sewerData = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection")
          let waterChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.water");
          let sewerChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage");
          let tubewellChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.tubewell");
          if (isFormValid) {
            if ((waterData && waterData.length > 0) || (sewerData && sewerData.length > 0)) {
              if (waterChecked && sewerChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water And Sewerage"
                  )
                );
                if (sewerData && sewerData.length > 0 && waterData.length === 0) { await applyForWater(state, dispatch); }
                else if (waterData && waterData.length > 0 && sewerData.length === 0) { await applyForSewerage(state, dispatch); }
              } else if (sewerChecked && sewerData.length === 0) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Sewerage"
                  )
                );
                await applyForSewerage(state, dispatch);
              } else if (waterChecked && waterData.length === 0) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water"
                  )
                );
                await applyForWater(state, dispatch);
              }
            } else if ((waterChecked && sewerChecked) || (sewerChecked && tubewellChecked)) {
              dispatch(
                prepareFinalObject(
                  "applyScreen.service",
                  "Water And Sewerage"
                )
              );
              if (waterData.length === 0 && sewerData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            } else if (waterChecked || tubewellChecked) {
              dispatch(
                prepareFinalObject(
                  "applyScreen.service",
                  "Water"
                )
              );
              if (waterData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            } else if (sewerChecked) {
              dispatch(prepareFinalObject("applyScreen.service", "Sewerage"))
              if (sewerData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            }
          }
        } else {
          isFormValid = false;
          hasFieldToaster = true;
        }
      }else{
           isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_HOLDER_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            }else {
        isFormValid = false;
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "WS_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
      }
    }
    prepareDocumentsUploadData(state, dispatch);
  }
  // console.log(activeStep);

  if (activeStep === 1) {
    if (moveToReview(state, dispatch)) {
      await pushTheDocsUploadedToRedux(state, dispatch);
      isFormValid = true; hasFieldToaster = false;
      const wnsStatus =  window.localStorage.getItem("WNS_STATUS"); 
      // if(wnsStatus){
      //   switch(wnsStatus){
      //     case "UPDATE_CONNECTION_HOLDER_INFO" :   dispatch(prepareFinalObject("WaterConnection[0].activityType", "UPDATE_CONNECTION_HOLDER_INFO")); break;
      //     case "REACTIVATE_CONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "REACTIVATE_CONNECTION")); break;
      //     case "TEMPORARY_DISCONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "TEMPORARY_DISCONNECTION")); break;
      //     case "APPLY_FOR_REGULAR_INFO":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "APPLY_FOR_REGULAR_INFO")); break;
      //     case "PERMANENT_DISCONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "PERMANENT_DISCONNECTION")); break;
      //     case "CONNECTION_CONVERSION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "CONNECTION_CONVERSION")); break;
      //   }
      // }
      if(process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit"&& window.localStorage.getItem("ActivityStatusFlag")=== "true"){
        window.localStorage.removeItem("ActivityStatusFlag");
      }
     else if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit") {  
        setReviewPageRoute(state, dispatch);
      }
    }
    else { isFormValid = false; hasFieldToaster = true; }
  }

  if (activeStep === 2 && process.env.REACT_APP_NAME !== "Citizen") {
    if (getQueryArg(window.location.href, "action") === "edit") {
      setReviewPageRoute(state, dispatch);
    }

    // if (!isApplicantTypeCardValid || !isSingleApplicantCardValid || !isInstitutionCardValid) {
    //   isFormValid = false;
    //   hasFieldToaster = true;
    // }
    isFormValid = true;
  }
  if (activeStep === 3) {
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    if (waterId && sewerId) {
      isFormValid = await acknoledgementForBothWaterAndSewerage(state, activeStep, isFormValid, dispatch);
    } else if (waterId) {
      isFormValid = await acknoledgementForWater(state, activeStep, isFormValid, dispatch);
    } else {
      isFormValid = await acknoledgementForSewerage(state, activeStep, isFormValid, dispatch);
    }
    // responseStatus === "success" && changeStep(activeStep, state, dispatch);
  }
  if (activeStep !== 3) {
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields!",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
      };
      switch (activeStep) {
        case 1:
          // errorMessage = {
          //   labelName:
          //     "Please upload all Mandatory Document!",
          //   labelKey: "WS_UPLOAD_MANDATORY_DOCUMENTS"
          // };
          moveToReview(state,dispatch)
          return;
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

const moveToSuccess = (combinedArray, dispatch) => {
  const tenantId = get(combinedArray[0].property, "tenantId");
  const purpose = "apply";
  const status = "success";
  const applicationNoWater = get(combinedArray[0], "applicationNo");
  const applicationNoSewerage = get(combinedArray[1], "applicationNo");
  if (applicationNoWater && applicationNoSewerage) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNoWater}&applicationNumberSewerage=${applicationNoSewerage}&tenantId=${tenantId}`
      )
    );
  } else if (applicationNoWater) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoSewerage}&tenantId=${tenantId}`
      )
    );
  }
};

const acknoledgementForBothWaterAndSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      let combinedArray = WaterConnection.concat(SewerageConnection)
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return isFormValid;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 0:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return !isFormValid;
}

const acknoledgementForWater = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      getMdmsData(state, dispatch);
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

const acknoledgementForSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      getMdmsData(state, dispatch);
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  if (defaultActiveStep === -1) {
    if (activeStep === 1 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.documents",
        null
      );
      if(isDocsUploaded){
        activeStep = process.env.REACT_APP_NAME === "Citizen" ? 3 : 2;
      }
    } else if (process.env.REACT_APP_NAME === "Citizen" && activeStep === 3) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }
  if(activeStep === 0){
    let conHolders = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionHolders");
    let isCheckedSameAsProperty = (conHolders && conHolders.length > 0 && !conHolders[0].sameAsPropertyAddress)?false:true;
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
        "props.isChecked",
        isCheckedSameAsProperty
      )
    )
  }
  
  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = isNextButton(activeStep);
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  if (process.env.REACT_APP_NAME === "Citizen") { renderStepsCitizen(activeStep, dispatch); }
  else { renderSteps(activeStep, dispatch); }
}

export const isNextButton = (activeStep) => {
  if (process.env.REACT_APP_NAME === "Citizen" && activeStep < 2) { return true; }
  else if (process.env.REACT_APP_NAME !== "Citizen" && activeStep < 3) { return true; }
  else return false
}

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );

  }
};

export const renderStepsCitizen = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  let actionDefination = [];
  if (process.env.REACT_APP_NAME === "Citizen") {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  } else {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardThirdStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  }
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = { ...actionDefination[i], value: false };
    if (path === actionDefination[i].path) {
      actionDefination[i] = { ...actionDefination[i], value: true };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  window.scrollTo(0, 0);
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "WS_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "WS_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const footerReview = (
  action,
  state,
  dispatch,
  status) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, "print");
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses, 'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      break;
    case "pending_approval":
      break;
    case "CANCELLED":
      break;
    case "REJECTED":
      break;
    default:
      break;
  }
}