import get from "lodash/get";
import set from "lodash/set";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCard, ValidateCardUserQty,GetTotalQtyValue,GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  epochToYmd,
  validateFields,
  epochToYmdDate,
  getLocalizationCodeValue
} from "../../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import store from "redux/store";
// import "./index.css";
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};
const moveToReview = (state,dispatch) => {

  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    "materialIssues",
    []
  );
   setDateInYmdFormat(materialIssues[0], ["issueDate", ]);
   dispatch(prepareFinalObject("materialIssues", materialIssues));
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const applicationNumber =getQueryArg(window.location.href, "applicationNumber");
  if(IndentId)
  {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewindentnote?step=0&IndentId=${IndentId}`
      : `/egov-store-asset/reviewindentnote?step=0&IndentId=${IndentId}`;
  dispatch(setRoute(reviewUrl));
  }
  if(applicationNumber)
  {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewindentnote?step=0&applicationNumber=${applicationNumber}`
      : `/egov-store-asset/reviewindentnote?step=0&applicationNumber=${applicationNumber}`;
  dispatch(setRoute(reviewUrl));
  }
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialIndentNote"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.IndentMaterialIssueDetails.children.cardContent.children.IndentMaterialIssueContainer.children",
      state,
      dispatch,
      "createMaterialIndentNote"
    );
    
    if (!(isMaterialDetailsValid)) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.createMaterialIndentNote,
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
          "createMaterialIndentNote"
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
      "createMaterialIndentNote"
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
    moveToReview(state,dispatch);
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
          let cardJsonPath =
          "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
          let pagename = "createMaterialIndentNote";
          let jasonpath =  "materialIssues[0].materialIssueDetails";
          let value = "mrnNumber";
          let value2 ="";
          let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
          let InputQtyValue = "indentDetail.userQuantity";
          let CompareQtyValue = "indentDetail.indentQuantity";
          let balanceQuantity = "indentDetail.balanceQty";
          let doubleqtyCheck = true
          let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
       
          if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
          {
            let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
            const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
            let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_INDENT_NOTE_QTY_VALIDATION")
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
              let totalIndentQty =  get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].totalIndentQty`,0)
              let totalQty =  get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].totalQty`,0)
              if(totalQty>totalIndentQty)
              {

                // material lable validation of total indent qty
                let indentsmaterial_ = get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialIssues[0].indent.indentDetails`,
                  []
                ); 
                let totalIndentQty =0;
                let issueqty = 0;
                for (let index = 0; index < indentsmaterial_.length; index++) {
                  const element = indentsmaterial_[index];
                  let materialIssueDetails_ = get(
                    state.screenConfiguration.preparedFinalObject,
                    'materialIssues[0].materialIssueDetails',
                    []
                  ); 
                    materialIssueDetails_ = materialIssueDetails_.filter(x=>x.material.code === element.material.code)
                    
                    if(materialIssueDetails_.length>0)
                    {
                      for (let index = 0; index < materialIssueDetails_.length; index++) {
                        const element = materialIssueDetails_[index];
                        issueqty = issueqty + element.quantityIssued                        
                      }
                      let indentQuantity = Number(element.indentQuantity)///materialIssueDetails_.length
                      
                    totalIndentQty =totalIndentQty+indentQuantity
                    }
                    if(totalIndentQty<issueqty)
                    {
                     
                      const LocalizationCodeValueTotalQty = getLocalizationCodeValue("STORE_TOTAL_QUANTITY_ISSUED_VALIDATION")
                      let matname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",element.material.code) 
                      const errorMessage = {                
                        labelName: "Total issued quantity can not be greater than Indent quantity",
                        labelKey:   LocalizationCodeValueTotalQty+' for '+matname
                      };
                       // const errorMessage = {
                
                      //   labelName: "Total issued quantity can not be greater than Indent quantity",
                      //   labelKey:   "STORE_TOTAL_QUANTITY_ISSUED_VALIDATION"
                      // };
                      dispatch(toggleSnackbar(true, errorMessage, "warning"));
                      return;

                    }
                    else
                    {
                      moveToReview(state,dispatch)
                    }
                }
                // const errorMessage = {
                
                //         labelName: "Total issued quantity can not be greater than Indent quantity",
                //         labelKey:   "STORE_TOTAL_QUANTITY_ISSUED_VALIDATION"
                //       };
                //       dispatch(toggleSnackbar(true, errorMessage, "warning"));
                
              }
              else
              moveToReview(state,dispatch)
            }
          
            else
            {              
             changeStep(state, dispatch);  
            }
                      
              
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
              else if (InvaldQtyCard[0].IsZeroQty)// zero qty valudation
              {
                
                  const errorMessage = {                
                    labelName: "Quantity can not be Zero for",
                    labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
                  };
                  dispatch(toggleSnackbar(true, errorMessage, "warning"));
               
              }
              else  if(InvaldQtyCard[0].IsInvalidQty){
                const errorMessage = {                
                  labelName: "Ordered Qty less then Indent Qty for",
                  labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
              } 

            }
          }
        }
        else
        {
          let cardJsonPath =
          "components.div.children.formwizardSecondStep.children.materialIssue.children.cardContent.children.materialIssueCard.props.items";
         let pagename = `createMaterialIndentNote`;
         let jasonpath =  "materialIssues[0].materialIssueDetails";
         let InputQtyValue = "indentDetail.indentQuantity";
         let TotalValue_ = "indentDetail.TotalValue";
         let TotalQty ="indentDetail.userQuantity"
         let Qty = GetTotalQtyValue(state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue_,TotalQty)
         if(Qty && Qty[0])
         {
         // dispatch(prepareFinalObject(`materialIssues[0].totalIndentQty`, Qty[0].InputQtyValue));
          dispatch(prepareFinalObject(`materialIssues[0].totalvalue`, Qty[0].TotalValue));
          dispatch(prepareFinalObject(`materialIssues[0].totalQty`, Qty[0].TotalQty));

         }
         changeStep(state, dispatch);  
        }

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
    state.screenConfiguration.screenConfig["createMaterialIndentNote"],
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
  dispatchMultipleFieldChangeAction("createMaterialIndentNote", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createMaterialIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createMaterialIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createMaterialIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "createMaterialIndentNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createMaterialIndentNote",
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
