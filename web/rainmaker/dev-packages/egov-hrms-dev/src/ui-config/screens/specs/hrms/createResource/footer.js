import get from "lodash/get";
import {
  convertDateToEpoch,
  dispatchMultipleFieldChangeAction,
  getLabel,
  getTodaysDateInYMD,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  
} from "../../utils";
import "./index.css";

const moveToReview = dispatch => {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/review`
      : `/hrms/review`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true,finalErrString="";
   
  if (activeStep === 0) {
    const isEmployeeDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.employeeDetails.children.cardContent.children.employeeDetailsContainer.children",
      state,
      dispatch,
      "create"
    );
    const isProfessionalDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.professionalDetails.children.cardContent.children.employeeDetailsContainer.children",
      state,
      dispatch,
      "create"
    );
    if (!(isEmployeeDetailsValid && isProfessionalDetailsValid)) {
      isFormValid = false;
    }
    ///
     if ((isEmployeeDetailsValid && isProfessionalDetailsValid)) {

      const errorMessage = {
        labelName: "Date of birth can not be greater then or equal to current date",
        labelKey: "ERR_SELECT_VALID_DATE_OF_BIRTH"
      };

      

      let dob = get(
        state.screenConfiguration.preparedFinalObject,
        "Employee[0].user.dob",
        null
      );
      const  Curdate_ = getTodaysDateInYMD();
      const  dob_ = convertDateToEpoch(dob,"dayStart")  
      const Curdate_epoch = convertDateToEpoch(Curdate_,'dayStart')

      if(dob_ >= Curdate_epoch )
      {
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }
    }

  }
  if (activeStep === 1) {
    let jurisdictionDetailsPath =
      "components.div.children.formwizardSecondStep.children.jurisdictionDetails.children.cardContent.children.jurisdictionDetailsCard.props.items";
    let jurisdictionDetailsItems = get(
      state.screenConfiguration.screenConfig.create,
      jurisdictionDetailsPath,
      []
    );
    let isJurisdictionDetailsValid = true;
    for (var j = 0; j < jurisdictionDetailsItems.length; j++) {
      if (
        (jurisdictionDetailsItems[j].isDeleted === undefined ||
          jurisdictionDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${jurisdictionDetailsPath}[${j}].item${j}.children.cardContent.children.jnDetailsCardContainer.children`,
          state,
          dispatch,
          "create"
        )
      )
        isJurisdictionDetailsValid = false;
    }
    if (!isJurisdictionDetailsValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 2) {
    let assignmentDetailsPath =
      "components.div.children.formwizardThirdStep.children.assignmentDetails.children.cardContent.children.assignmentDetailsCard.props.items";
    let assignmentDetailsItems = get(
      state.screenConfiguration.screenConfig.create,
      assignmentDetailsPath,
      []
    );
    let isAssignmentDetailsValid = true;
    for (var j = 0; j < assignmentDetailsItems.length; j++) {
      if (
        (assignmentDetailsItems[j].isDeleted === undefined ||
          assignmentDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${assignmentDetailsPath}[${j}].item${j}.children.cardContent.children.asmtDetailsCardContainer.children`,
          state,
          dispatch,
          "create"
        )
      )
        isAssignmentDetailsValid = false;
    }
    let assignmentsData = get(
      state.screenConfiguration.preparedFinalObject.Employee[0],
      "assignments",
      []
    );
    let atLeastOneCurrentAssignmentSelected = assignmentsData.some(
      assignment => {
        return assignment.isCurrentAssignment;
      }
    );
    if (!atLeastOneCurrentAssignmentSelected) {
      let assignToDate = false
      let employeeObject = get(
        state.screenConfiguration.preparedFinalObject,
        "Employee",
        []
      );
      let toDate = assignmentsData.some(
        assignment => {
          return assignment.toDate;
        }
      );
      // if(toDate)
      // {
      //   assignToDate = true
      // }
    
      if(!assignToDate)
      {
      const errorMessage = {
        labelName: "Please select at least one current assignment",
        labelKey: "ERR_SELECT_CURRENT_ASSIGNMENT"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
    }

    let atLeastOnePrimaryAssignmentSelected = assignmentsData.some(
      assignment => {
        return assignment.isPrimaryAssignment;
      }
    );
    if (!atLeastOnePrimaryAssignmentSelected) {
      const errorMessage = {
        labelName: "Please select at least one primary assignment",
        labelKey: "ERR_SELECT_PRIMARY_ASSIGNMENT"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }


    if (!isAssignmentDetailsValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 3) {
    let serviceDetailsPath =
      "components.div.children.formwizardFourthStep.children.serviceDetails.children.cardContent.children.serviceDetailsCard.props.items";
  
      let serviceDetailsItems = get(
      state.screenConfiguration.screenConfig.create,
      serviceDetailsPath,
      []
    );
    let isserviceDetailsValid = true;
    const appntDate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfAppointment).getTime();
    const annuationdate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfSuperannuation).getTime();
    let invalidFromDate ="Invalid Service from date for row: ", invalidToDate="Invalid Service To date for row: ",isInvalidFromDt=false, isInvalidToDt=false;

    for (var j = 0; j < serviceDetailsItems.length; j++) {
      if (
        (serviceDetailsItems[j].isDeleted === undefined ||
          serviceDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${serviceDetailsPath}[${j}].item${j}.children.cardContent.children.serviceDetailsCardContainer.children`,
          state,
          dispatch,
          "create"
        )
      )
      isserviceDetailsValid = false;
      
     
      // validation to check weather To data and From date lie between appointment and annuation date
   //    const serviceFromdDt =  new Date(`${serviceDetailsPath}[${j}].item${j}.children.cardContent.children.serviceDetailsCardContainer.children.serviceFromDate.props.value`).getTime();
   //    const serviceToDt =  new Date(`${serviceDetailsPath}[${j}].item${j}.children.cardContent.children.serviceDetailsCardContainer.children.serviceToDate.props.value`).getTime();

          const serviceFromdDt = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[j].serviceFrom).getTime();
          const serviceToDt = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[j].serviceTo).getTime();
          const isCurrentPosition = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[j].isCurrentPosition);
       
          if( !(annuationdate >= serviceFromdDt && serviceFromdDt > appntDate)){
            isInvalidFromDt = true;
            invalidFromDate += `${j}`;
            if(j < serviceDetailsItems.length-1 ) invalidFromDate += ",";
          }
        if(!isCurrentPosition)
        {
          if( !(annuationdate >= serviceToDt && serviceToDt >= appntDate)){
            isInvalidToDt = true;
            invalidToDate += `${j}`;
            if(j < serviceDetailsItems.length-1 ) invalidToDate += ",";
          }
        }
         
          
    }
    if(isInvalidFromDt)
    {
      //finalErrString +=   invalidFromDate;
      finalErrString ="";

    }
    
    if(isInvalidToDt)    finalErrString +=   "  "+invalidToDate;

//const ValidServicedDt = state.screenConfiguration.preparedFinalObject.ValidServicedDt
const ValidServicedDt =get(
  state.screenConfiguration.preparedFinalObject,
  `ValidServicedDt`,
  true
);
//const ValidServiceTodDt = state.screenConfiguration.preparedFinalObject.ValidServiceTodDt
const ValidServiceTodDt =get(
  state.screenConfiguration.preparedFinalObject,
  `ValidServiceTodDt`,
  true
);
    if (!ValidServicedDt) {
      const errorMessage = {
        labelName: "Date Must lie between Appointment date and Annuation date",
        labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
    if (!ValidServiceTodDt) {
      const errorMessage = {
        labelName: "Service To Date greater then Service From Date",
                    labelKey: "SERVICE_DATE_TO_VALIDATIOM"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
    if (!isserviceDetailsValid) {
      isFormValid = false;
    }
  }
  if (activeStep === 4) {
    moveToReview(dispatch);
  }
  if (activeStep !== 4) {

    if(activeStep === 3 && finalErrString !==""){
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: finalErrString
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else if (isFormValid) {
      changeStep(state, dispatch);
    } 
    else{
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
    state.screenConfiguration.screenConfig["create"],
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
  dispatchMultipleFieldChangeAction("create", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "create",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "create",
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
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStep",
      property: "visible",
      value: false
    }
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
        labelKey: "HR_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "HR_COMMON_BUTTON_NXT_STEP"
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
        labelKey: "HR_COMMON_BUTTON_SUBMIT"
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
