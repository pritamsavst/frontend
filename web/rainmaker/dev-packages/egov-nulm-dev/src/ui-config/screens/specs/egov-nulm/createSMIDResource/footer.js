import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject ,handleScreenConfigurationFieldChange as handleField} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl } from "egov-ui-framework/ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd
} from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
 // import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-smid`;
    dispatch(setRoute(reviewUrl));
  };

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-smid"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const {NULMSMIDRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;
  let documentsPreview =[];
  let documentAttachemnt = [];
  if (activeStep === 0) {
    // set(
    //   `create-smid`,
    //   "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
    //   { isFieldValid: true }
    // );
    const isSmidDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children",
      state,
      dispatch,
      "create-smid"
    );
    //
   
    //
    
if(NULMSMIDRequest && NULMSMIDRequest.isMinority){
  if(NULMSMIDRequest.isMinority =="Yes" && !NULMSMIDRequest.minority ){
    const errorMessage = {
      labelName: "Please select the Minority",
      labelKey: "ERR_NULM_MINORTY"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}

if(NULMSMIDRequest && NULMSMIDRequest.isUrbanPoor){
  if(NULMSMIDRequest.isUrbanPoor =="Yes" && !NULMSMIDRequest.bplNo ){
    const errorMessage = {
      labelName: "Please fill BPL Number",
      labelKey: "ERR_NULM_FILL_BPL_NUMBER"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}
if(NULMSMIDRequest && NULMSMIDRequest.isInsurance){
  if(NULMSMIDRequest.isInsurance =="Yes" && !NULMSMIDRequest.insuranceThrough ){
    const errorMessage = {
      labelName: "Please fill insurance through",
      labelKey: "ERR_NULM_FILL_INSURANCE_THROUGH"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}
if(NULMSMIDRequest ){
  if(!NULMSMIDRequest.adharNo  && !NULMSMIDRequest.adharAcknowledgementNo ){
    const errorMessage = {
      labelName: "Please fill either Aadhar No. or Aadhar acknowledgement number",
      labelKey: "ERR_NULM_FILL_AADHAR_VALIDATION"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}
if(NULMSMIDRequest && NULMSMIDRequest.isRegistered){
  if(NULMSMIDRequest.isRegistered =="Yes" && !NULMSMIDRequest.cobNumber ){
    const errorMessage = {
      labelName: "Please provide the COB Number",
      labelKey: "NULM_SEP_COB_NUMBER_INPUT_VALIDATION"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}

if(NULMSMIDRequest && ( !NULMSMIDRequest.hasOwnProperty("gender") || !NULMSMIDRequest.hasOwnProperty("caste"))){
  isFormValid = false;
}


    if (!isSmidDetailsValid) {
      const fields = get(
        state.screenConfiguration.screenConfig[`create-smid`],
        "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children",
        {}
      );
      if(fields.name!==undefined 
        &&fields.fatherOrHusbandName!==undefined 
        &&fields.qualification!==undefined 
        &&fields.dob!==undefined       
        &&fields.mobileNo!==undefined       
        &&fields.motherName!==undefined 
        &&fields.address!==undefined 
        &&fields.wardNo!==undefined 
        &&fields.nameAsPerAdhar!==undefined 
       ) 
        {
          if(fields.name.isFieldValid ===false 
            ||fields.fatherOrHusbandName.isFieldValid ===false 
            ||fields.qualification.isFieldValid ===false 
            ||fields.dob.isFieldValid ===false           
            ||fields.mobileNo.isFieldValid ===false           
            ||fields.motherName.isFieldValid ===false 
            ||fields.address.isFieldValid ===false 
            ||fields.wardNo.isFieldValid ===false 
            ||fields.nameAsPerAdhar.isFieldValid ===false 
            )
            {
              isFormValid = false;
            }
            else
            {
              if(NULMSMIDRequest && ( !NULMSMIDRequest.hasOwnProperty("gender") || !NULMSMIDRequest.hasOwnProperty("caste"))){
                isFormValid = false;
              }
              else if(NULMSMIDRequest ){
                  if(!NULMSMIDRequest.dob && !NULMSMIDRequest.age ){
                    const errorMessage = {
                      labelName: "Please select the Minority",
                      labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
                    };
                    dispatch(toggleSnackbar(true, errorMessage, "warning"));
                    return;
                  }
                
              }
              else
              {
                isFormValid = true;
              }
             
            }
        }
      
    }
  }
  if (activeStep === 1) {
    const localisationLabels = getTransformedLocalStorgaeLabels();
    const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
    const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
    const isDocRequired =  documents.map(doc => {
            return  doc.cards && doc.cards[0].required;
        })

      let docArray = new Array(isDocRequired.length)
        
      uploadedDocs &&  Object.entries(uploadedDocs).forEach(ele => {         
        docArray[ele[0]] = ele[1];
        if(ele[1] &&  ele[1].documents && ele[1].documents.length>0){
          let obj = {
            title: documents[ele[0]].title,
            linkText: "VIEW", 
            link:    getFileUrl(ele[1].documents[0].fileUrl),   
            name:   (  decodeURIComponent(
                        getFileUrl(ele[1].documents[0].fileUrl)
                          .split("?")[0]
                          .split("/")
                          .pop().slice(13)
                      )) ||
                    `Document - ${index + 1}`     
          }
          let reqObj = {
            documentType :  getLocaleLabels(documents[ele[0]].code,documents[ele[0]].code,localisationLabels),  
            filestoreId:   ele[1].documents[0].fileStoreId,
          }
         // documentAttachemnt = ele[1].documents[0].fileStoreId;
          documentAttachemnt.push(reqObj);
          documentsPreview.push(obj)
        }
    
    })

        for(let i = 0 ; i < isDocRequired.length ; i++){
          if(isDocRequired[i]){
                  if( docArray[i] && docArray[i].documents){
                    isFormValid = true;
                  }     
                  else{
                    isFormValid = false;
                    break;
                  } 
          }
        }
    }

    if(activeStep == 1 && !isFormValid){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please upload mandatory documents!", labelKey: "" },
          "warning"
        ))
    }
  else if(activeStep != 1 && !isFormValid){
    const errorMessage = {
      labelName: "Please fill all fields",
      labelKey: "ERR_FILL_ALL_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
else if(activeStep == 1 && isFormValid){
  dispatch(
    prepareFinalObject("NULMSMIDRequest.documentAttachemnt", documentAttachemnt)
  );
  dispatch(
    prepareFinalObject("documentsPreview", documentsPreview)
  );
  moveToReview(dispatch);
}
  else{
    // show validation mewssage and clear age value from json
    if(NULMSMIDRequest && NULMSMIDRequest.dob && NULMSMIDRequest.age ){
      if(NULMSMIDRequest.dob && NULMSMIDRequest.age ){
        const errorMessage = {
          labelName: "Please select the Minority",
          labelKey: "ERR_NULM_DOB_AGE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // dispatch(
        //   handleField(
        //     `create-smid`,
        //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.age",
        //     "props.value",
        //     ''
        //   )
        // );
        // dispatch(prepareFinalObject(`NULMSMIDRequest.age`, null ));
        return;
      }
    }
    //
    changeStep(state, dispatch);
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-smid"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
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
  dispatchMultipleFieldChangeAction("create-smid", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-smid",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-smid",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-smid",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "create-smid",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
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
   
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  const {NULMSMIDRequest} = state.screenConfiguration.preparedFinalObject;
  if(NULMSMIDRequest && NULMSMIDRequest.dob && NULMSMIDRequest.age ){
    if(NULMSMIDRequest.dob && NULMSMIDRequest.age ){
      
      dispatch(prepareFinalObject(`NULMSMIDRequest.age`, '' ));
    }
  }
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
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
        labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
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
