import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  epochToYmd,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
// import "./index.css";
import {ValidateCardMultiItem , ValidateCardQty} from '../../../../../ui-utils/storecommonsapi'
const moveToReview = dispatch => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewnonindentnote?step=0&IndentId=${IndentId}`
      : `/egov-store-asset/reviewnonindentnote?step=0&IndentId=${IndentId}`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialNonIndentNote"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children",
      state,
      dispatch,
      "createMaterialNonIndentNote"
    );
    
    if (!(isMaterialDetailsValid)) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.createMaterialNonIndentNote,
      storeDetailsCardPath,
      []
    );
    let isstoreDetailsValid = true;
    for (var j = 0; j < storeDetailsItems.length; j++) {
      if (
        (storeDetailsItems[j].isDeleted === undefined ||
          storeDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${storeDetailsCardPath}[${j}].item${j}.children.cardContent.children.materialIssueCardContainer.children`,
          state,
          dispatch,
          "createMaterialNonIndentNote"
        )
      )
        isstoreDetailsValid = false;
    }
    if (!isstoreDetailsValid) {
      isFormValid = false
    }
  }
  if (activeStep === 2) {   
    let isPuchasingInformationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View1.children.cardContent.children.PuchasingInformationContainer.children",
      state,
      dispatch,
      "createMaterialNonIndentNote"
    );
    isPuchasingInformationValid = true;
    
    if (!isPuchasingInformationValid) {
      isFormValid = false;
    }
    if(isFormValid)
    {

    // get max and min Qty and validate     
    // let MaxQty =0
    // let MinQty = 0
    // MaxQty = Number( get(state.screenConfiguration.preparedFinalObject, "materials[0].maxQuantity"))
    // MinQty = Number( get(state.screenConfiguration.preparedFinalObject, "materials[0].minQuantity"))
   // if(true)
    moveToReview(dispatch);
    // else{
    

    // }
    
  }
    else{

      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
  }
  if (activeStep !== 2) {
    if (isFormValid) {
      let toStore = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].toStore.code",'') 
      let fromStore = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].fromStore.code",'') 
      let expectedDeliveryDateValid = true   
      const CurrentDate = new Date();
      let issueDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialIssues[0].issueDate",
        null
      );
      if(Number(issueDate))
      issueDate = epochToYmd(issueDate)
    const  issueDate_ = new Date(issueDate)
      if(fromStore === toStore)
      {
        const errorMessage = {
          labelName: "Intenting Store and Issuing Store can not be same ",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_STORE_SELECTION_VALIDATION"
        }; 
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else if (issueDate_>CurrentDate)
      {
        const errorMessage = {
          labelName: "Intent Isue Date can not be greater then current date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_VALIDATION"
        };  
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else{
        if(activeStep===1)
        {
                //card validation
                let cardJsonPath =
                "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
                let pagename = "createMaterialNonIndentNote";
                let jasonpath =  "materialIssues[0].materialIssueDetails";
                let value = "mrnNumber";
                let value2 ="material.code";
                let DuplicatItem = ValidateCardMultiItem(state,dispatch,cardJsonPath,pagename,jasonpath,value,value2)
                let InputQtyValue = "userQuantityIssued";
                let InputQtyValue2= "acceptedQty";
                let CompareQtyValue = "balanceQty";
                let balanceQuantity = "balanceQuantity";
                let doubleqtyCheck = false
                let InvaldQtyCard = ValidateCardQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck,value2,InputQtyValue2)
             
                if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
                {
                  let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
                  let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_NON_INDENT_QTY_VALIDATION")
                  if((!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty ) && !InvaldQtyCard[0].IsZeroQty )
            {
        
                    // refresh card item
                    var storeMappingTemp = [];
                let  storeMapping =  get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialIssues[0].materialIssueDetails`,
                  []
                );
                for(var i = 0; i < storeMapping.length; i++){
                    if(storeMappingTemp.indexOf(storeMapping[i]) == -1){
                      storeMappingTemp.push(storeMapping[i]);
                    }
                }
                storeMappingTemp = storeMappingTemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
                if(storeMappingTemp.length>0)
                {
                  dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails",storeMappingTemp)
                );
                  }
                  if(activeStep ===1)
                  {
                    let MaterialBalanceRate = get(state, "screenConfiguration.preparedFinalObject.mrnNumber",[]) 
                    let materialIssueDetails = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].materialIssueDetails",[]) 

                  //  let  receiptDate = materialIssueDetails.max(x=>x.receiptDate)
                  //  let  receiptDate_ = materialIssueDetails.min(x=>x.receiptDate)
                  var maxValObject = _.maxBy(materialIssueDetails, 'receiptDate');
                  var minValObject = _.minBy(materialIssueDetails, 'receiptDate');
                 
                   if(MaterialBalanceRate &&MaterialBalanceRate[0] &&maxValObject)
                   {
                     
                     if(Number(maxValObject.receiptDate))
                     maxValObject = epochToYmd(maxValObject.receiptDate)
                     const  maxValObject_ = new Date(maxValObject)
                   //  alert(receiptDate)
                     let issueDate = get(
                       state.screenConfiguration.preparedFinalObject,
                       "materialIssues[0].issueDate",
                       null
                     );
                     if(Number(issueDate))
                     issueDate = epochToYmd(issueDate)
                   const  issueDate_ = new Date(issueDate)
                   if(issueDate_< maxValObject_)
                   {
                     let LocalizationCodeValueIssuedate = getLocalizationCodeValue("STORE_MATERIAL_ISSUE_DATE_VALIDATION")
                     const errorMessage = {
                       labelName: "Issue date should be greater than or equal to receipt date ",
                       labelKey: LocalizationCodeValueIssuedate+' '+maxValObject
                     }; 
                     dispatch(toggleSnackbar(true, errorMessage, "warning"));
                   }
                   else{
                   
                    moveToReview(dispatch)
                   }
                   }
                  }
                  
                
                  else
                  changeStep(state, dispatch);
                  }
                  else{
                    if(DuplicatItem[0].IsDuplicatItem)
                    {
                      const errorMessage = {              
                        labelName: "Duplicate Material Added",
                        labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
                      };
                      dispatch(toggleSnackbar(true, errorMessage, "warning"));
                    }
                    else if (InvaldQtyCard[0].IsInvalidQty)
                    {
                      //InvaldQtyCard[0].duplicates = InvaldQtyCard[0].duplicates.replace("_", ",");
                      const errorMessage = {                      
                        labelName: "Ordered Qty less then Indent Qty for",                        
                        labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
                      };
                      dispatch(toggleSnackbar(true, errorMessage, "warning"));
                  
              
                    }
                    else if (InvaldQtyCard[0].IsZeroQty)
            {
              const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
              const errorMessage = {              
                labelName: "Quantity can not be Zero for",
                labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
              };
              dispatch(toggleSnackbar(true, errorMessage, "warning")); 
            }
        
                  }
                }
              }
              else
              changeStep(state, dispatch);

      }
     
    } else {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialNonIndentNote"],
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
  dispatchMultipleFieldChangeAction("createMaterialNonIndentNote", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createMaterialNonIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createMaterialNonIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createMaterialNonIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "createMaterialNonIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createMaterialNonIndentNote",
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
