import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  WFConfig, 
  ActionMessage
  } from "../../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../../ui-utils";
  import { getPMSPattern } from "../../../../../ui-utils/commons";
const ActionCalculate = async (state, dispatch) => {
 
  set(
    state,
    "screenConfiguration.preparedFinalObject.IsCalculated",
    true
  );
  set(
    state,
    "screenConfiguration.preparedFinalObject.IsCalculatedWarning",
    true    
  )
  let response = WFConfig(); 
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let WFBody = {
    ProcessInstances: [
      {
        tenantId: tenantId,
        businessService: response.businessServiceRRP,
        businessId: applicationNumber
      }       
  ]
  };
 
  try {
    let payload = null;
    
    let response = await httpRequest(
      "post",
      "/pension-services/v1/_calculateBenefit",
      "",
      [],
      WFBody
    );
     payload = get(
      state.screenConfiguration.preparedFinalObject,
      "ProcessInstances",
      []
    );
    console.log(response)
    console.log("response")
  
if(response!== undefined)
{
    let pensionCalculationDetails ={
      nqsSystem:0,
      dcrgSystem:0
    }
    
    let pensionCalculationUpdateDetails ={
      nqsVerified:0,
      dcrgVerified:0
    }
    pensionCalculationDetails = response.ProcessInstances[0].pensionCalculationDetails
    pensionCalculationUpdateDetails = response.ProcessInstances[0].pensionCalculationUpdateDetails
        set(payload[0], 
        "pensionCalculationDetails", 
        pensionCalculationDetails);
        set(payload[0], 
       "pensionCalculationUpdateDetails", 
        pensionCalculationUpdateDetails);      
       dispatch(prepareFinalObject("ProcessInstances", payload)); 
      // dispatch(toggleSnackbar(true, { labelName: 'payload.ResponseInfo.status' }, "success"));
  }
  }
  catch(error)
  {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
  //alert('cal calculate API')
  //console.log('call calculate API');
}

export const pensionDetails = (data) => {
//export const pensionDetails = getCommonCard({
  return getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Pension Information",
      labelKey: "PENSION_EMPLOYEE_PENSION_INFORMATION"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
 
  pensionCalculation: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 6,
      align: "left"
    },
    visible: data[4].IsCalculate,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        color: "white",
        borderRadius: "2px",
        width: "250px",
        height: "48px"
      }
    },

    children: {
     

      buttonLabel: getLabel({
        labelName: "NEW APPLICATION",
        labelKey: "PENSION_PENSION_CALCULATION"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: ActionCalculate
    },
    
  },
  break: getBreak(),
  CalculationNote:getCommonParagraph({
    labelName: "Note: The calculated benefits will be removed if the application is sent back.",
    labelKey: "PENSION_WF_PENDING_FOR_CALCULATION_WARNING",
    props:{      
      style:{      
        fontweight:900
      }
    }
  },
  ),
  pensionDetailsConatiner: getCommonContainer({
    //1
     nqsYearSystem: getTextField({
       label: {
         labelName: "NQS Year",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_YEAR_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Year",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_YEAR_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.nqsYearSystem"
     }),
     nqsYearVerified: getTextField({
       label: {
         labelName: "NQS  Year Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_YEAR_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Year Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_YEAR_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
        props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.nqsYearVerified"
     }),
     //2
     nqsMonthSystem: getTextField({
       label: {
         labelName: "NQS Month",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_MONTH_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Month",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_MONTH_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.nqsMonthSystem"
     }),
     nqsMonthVerified: getTextField({
       label: {
         labelName: "NQS  Month Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_MONTH_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Month Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_MONTH_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
        props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.nqsMonthVerified"
     }),
     //3
     nqsDaySystem: getTextField({
       label: {
         labelName: "NQS Day",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_DAY_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Day",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_DAY_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.nqsDaySystem"
     }),
     nqsDayVerified: getTextField({
       label: {
         labelName: "NQS  Day Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_DAY_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "NQS Day Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NQS_DAY_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
        props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.nqsDayVerified"
     }),
     //4
     basicPensionSystem: getTextField({
       label: {
         labelName: "Basic Pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_BP"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Basic Pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_BP"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.basicPensionSystem"
     }),
     basicPensionVerified: getTextField({
       label: {
         labelName: "Basic Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_BP_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Basic Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_BP_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.basicPensionVerified"
     }),
     //4_new 
     provisionalPensionSystem: getTextField({
      label: {
        labelName: "provisional Pension System",
        labelKey: "PENSION_EMPLOYEE_PENSION_PP_S"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "provisional Pension System",
        labelKey: "PENSION_EMPLOYEE_PENSION_PP_S"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.provisionalPensionSystem"
    }),
    provisionalPensionVerified: getTextField({
      label: {
        labelName: "provisional Pension Verified",
        labelKey: "PENSION_EMPLOYEE_PENSION_PP_V"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "provisional Pension Verified",
        labelKey: "PENSION_EMPLOYEE_PENSION_PP_V"
      },
       required:false,
       minValue:0,
        maxLength:18,
      props: {
        disabled:data[3].pensionDataUpdate,
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.provisionalPensionVerified"
    }),

     //5
    
     commutedPensionSystem: getTextField({
      label: {
        labelName: "Commuted Pension",
        labelKey: "PENSION_EMPLOYEE_PENSION_CP"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Commuted Pension",
        labelKey: "PENSION_EMPLOYEE_PENSION_CP"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.commutedPensionSystem"
    }), 
     commutedPensionVerified: getTextField({
       label: {
         labelName: "Commuted Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_CP_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Commuted Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_CP_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.commutedPensionVerified"
     }),
     //6
     compensationPensionSystem: getTextField({
       label: {
         labelName: "compensationPensionSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_COM_P_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "compensationPensionSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_COM_P_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.compensationPensionSystem"
     }),
     compensationPensionVerified: getTextField({
       label: {
         labelName: "compensationPensionVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_COM_P_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "compensationPensionVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_COM_P_S"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.compensationPensionVerified"
     }), 
     //7
     daSystem: getTextField({
       label: {
         labelName: "DA Syatem",
         labelKey: "PENSION_EMPLOYEE_PENSION_DA_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "DA System",
         labelKey: "PENSION_EMPLOYEE_PENSION_DA_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.daSystem"
     }),
     daVerified: getTextField({
       label: {
         labelName: "DA Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_DA_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "DA Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_DA_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
        props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.daVerified"
     }),    
     //8
     compassionatePensionSystem: getTextField({
      label: {
        labelName: "compassionatePensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_CP_S"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "compassionatePensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_CP_S"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.compassionatePensionSystem"
    }),
     compassionatePensionVerified: getTextField({
       label: {
         labelName: "compassionatePensionVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_COMP_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "compassionatePensionVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_COMP_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.compassionatePensionVerified"
     }),
 
       //9 
    
     additionalPensionSystem: getTextField({
       label: {
         labelName: "Additional pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_AP"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Additional pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_AP"
       },
       required:false,
       visible:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.additionalPensionSystem"
     }),
     additionalPensionVerified: getTextField({
       label: {
         labelName: "Additional pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_AP_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Additional pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_AP_V"
       },
        required:false,
        visible:false,
        minValue:0,
         maxLength:18,
       
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.additionalPensionVerified"
     }),
     //10
     interimReliefSystem: getTextField({
       label: {
         labelName: "IR Syetem",
         labelKey: "PENSION_EMPLOYEE_PENSION_IR_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "IR Syetem",
         labelKey: "PENSION_EMPLOYEE_PENSION_IR_S"
       },
      required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:true,    
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.interimReliefSystem"
     }),
     interimReliefVerified: getTextField({
       label: {
 
 
         labelName: "IR System",
         labelKey: "PENSION_EMPLOYEE_PENSION_IR_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "IR System",
         labelKey: "PENSION_EMPLOYEE_PENSION_IR_V"
       },
       required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.interimReliefVerified"
     }),
     //11
     totalPensionSystem: getTextField({
       label: {
         labelName: "Total Pension System",
         labelKey: "PENSION_EMPLOYEE_TOTL_PENSION_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Total Pension System",
         labelKey: "PENSION_EMPLOYEE_TOTL_PENSION_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
         visible:true,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.totalPensionSystem"
     }),
     totalPensionVerified: getTextField({
       label: {
         labelName: "Total Pension Verify",
         labelKey: "PENSION_EMPLOYEE_TOTL_PENSION_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Total Pension Verify",
         labelKey: "PENSION_EMPLOYEE_TOTL_PENSION_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
         visible:true,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.totalPensionVerified"
     }),
     //12
     pensionDeductionsSystem: getTextField({
       label: {
         labelName: "pensionDeductionsSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_PD_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "pensionDeductionsSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_PD_S"
       },
      required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:true,    
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.pensionDeductionsSystem"
     }),
     pensionDeductionsVerified: getTextField({
       label: {
 
 
         labelName: "pensionDeductionsVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_PD_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "pensionDeductionsVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_PD_V"
       },
       required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.pensionDeductionsVerified"
     }),
     //13
     netDeductionsSystem: getTextField({
       label: {
         labelName: "Net Deductions",
         labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Net Deductions",
         labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.netDeductionsSystem"
     }),
     netDeductionsVerified: getTextField({
       label: {
         labelName: "Net Deductions Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Net Deductions Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTIONS_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.netDeductionsVerified"
     }),
     //14
     finalCalculatedPensionSystem: getTextField({
       label: {
         labelName: "Final Calculated Pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Final Calculated Pension",
         labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.finalCalculatedPensionSystem"
     }),
     finalCalculatedPensionVerified: getTextField({
       label: {
         labelName: "Final Calculated Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Final Calculated Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.finalCalculatedPensionVerified"
     }),
     // 15   // remove
     pensionSystem: getTextField({
       label: {
         labelName: "Pension System",
         labelKey: "PENSION_EMPLOYEE_PENSION"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Pension System",
         labelKey: "PENSION_EMPLOYEE_PENSION"
       },
       required:false,
        minValue:0,
         maxLength:18,
         visible:false,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.pensionSystem"
     }),
     pensionVerified: getTextField({
       label: {
         labelName: "Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Pension Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
         visible:false,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.pensionVerified"
     }),
     //16
     dcrgSystem: getTextField({
       label: {
         labelName: "DCRG",
         labelKey: "PENSION_EMPLOYEE_PENSION_DCRG_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "DCRG",
         labelKey: "PENSION_EMPLOYEE_PENSION_DCRG_S"
       },
      required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:true,    
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.dcrgSystem"
     }),
     dcrgVerified: getTextField({
       label: {
 
 
         labelName: "DCRG",
         labelKey: "PENSION_EMPLOYEE_PENSION_DCRG_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "DCRG",
         labelKey: "PENSION_EMPLOYEE_PENSION_DCRG_V"
       },
       required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.dcrgVerified"
     }),
     //17
     commutedValueSystem: getTextField({
       label: {
         labelName: "Commuted value",
         labelKey: "PENSION_EMPLOYEE_PENSION_CV"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Commuted value",
         labelKey: "PENSION_EMPLOYEE_PENSION_CV"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.commutedValueSystem"
     }), 
     commutedValueVerified: getTextField({
       label: {
         labelName: "Commuted value Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_CV_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "Commuted value Verify",
         labelKey: "PENSION_EMPLOYEE_PENSION_CV_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.commutedValueVerified"
     }), 
    //18
     duesDeductionsSystem: getTextField({
       label: {
         labelName: "duesDeductionsSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_DS_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "duesDeductionsSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_DS_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.duesDeductionsSystem"
     }),
     duesDeductionsVerified: getTextField({
       label: {
         labelName: "duesDeductionsVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_DS_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "duesDeductionsVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_DS_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.duesDeductionsVerified"
     }),    
     //19
     terminalBenefitSystem: getTextField({
       label: {
         labelName: "terminalBenefitSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_TB_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "terminalBenefitSystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_TB_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.terminalBenefitSystem"
     }),
     terminalBenefitVerified: getTextField({
       label: {
         labelName: "terminalBenefitVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_TB_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "terminalBenefitVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_TB_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.terminalBenefitVerified"
     }),
     //20
     finalCalculatedGratuitySystem: getTextField({
       label: {
         labelName: "finalCalculatedGratuitySystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_FCG_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "finalCalculatedGratuitySystem",
         labelKey: "PENSION_EMPLOYEE_PENSION_FCG_S"
       },
       required:false,
        minValue:0,
         maxLength:18,
       props: {
        disabled:true,       
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.finalCalculatedGratuitySystem"
     }),
     finalCalculatedGratuityVerified: getTextField({
       label: {
         labelName: "finalCalculatedGratuityVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_FCG_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "finalCalculatedGratuityVerified",
         labelKey: "PENSION_EMPLOYEE_PENSION_FCG_V"
       },
        required:false,
        minValue:0,
         maxLength:18,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.finalCalculatedGratuityVerified"
     }),
     // hide
     exGratiaSystem: getTextField({
       label: {
         labelName: "exGratiaSystem",
         labelKey: "PENSION_EMPLOYEE_EG_S"
       },
       props:{
         className:"applicant-details-error"
       }, 
       visible: true,
       placeholder: {
         labelName: "exGratiaSystem",
         labelKey: "PENSION_EMPLOYEE_EG_S"
       },
      required:false,
       minValue:0,
         maxLength:18,
       props: {
         disabled:true,     
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationDetails.exGratiaSystem"
       
     }),
     exGratiaVerified: getTextField({
       label: {
         labelName: "PENSION_EMPLOYEE_PENSION_FAMILYPENSION1",
         labelKey: "PENSION_EMPLOYEE_EG_V"
       },
       props:{
         className:"applicant-details-error"
       }, 
       placeholder: {
         labelName: "PENSION_EMPLOYEE_PENSION_FAMILYPENSION1",
         labelKey: "PENSION_EMPLOYEE_EG_S"
       },
       required:false,
       minValue:0,
         maxLength:18,
       visible: true,
       props: {
         disabled:data[3].pensionDataUpdate,
       },
       pattern: getPMSPattern("Amount"),
       jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.exGratiaVerified"
     }),
     invalidPensionSystem: getTextField({
      label: {
        labelName: "invalidPensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_IP_S"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "invalidPensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_IP_S"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.invalidPensionSystem"
    }),
    invalidPensionVerified: getTextField({
      label: {
        labelName: "invalidPensionVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_IP_V"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "invalidPensionVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_IP_V"
      },
       required:false,
       minValue:0,
        maxLength:18,
      props: {
        disabled:data[3].pensionDataUpdate,
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.invalidPensionVerified"
    }),
    
     woundExtraordinaryPensionSystem: getTextField({
      label: {
        labelName: "woundExtraordinaryPensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_WEP_S"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "woundExtraordinaryPensionSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_FCG_S"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.woundExtraordinaryPensionSystem"
    }),
    woundExtraordinaryPensionVerified: getTextField({
      label: {
        labelName: "woundExtraordinaryPensionVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_WEP_V"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "woundExtraordinaryPensionVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_FCG_V"
      },
       required:false,
       minValue:0,
        maxLength:18,
      props: {
        disabled:data[3].pensionDataUpdate,
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.woundExtraordinaryPensionVerified"
    }),
     
     attendantAllowanceSystem: getTextField({
      label: {
        labelName: "attendantAllowanceSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_ATN_S"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "attendantAllowanceSystem",
        labelKey: "PENSION_EMPLOYEE_PENSION_ATN_S"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       disabled:true,       
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.attendantAllowanceSystem"
    }),
    attendantAllowanceVerified: getTextField({
      label: {
        labelName: "attendantAllowanceVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_ATN_V"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "attendantAllowanceVerified",
        labelKey: "PENSION_EMPLOYEE_PENSION_ATN_V"
      },
       required:false,
       minValue:0,
        maxLength:18,
      props: {
        disabled:data[3].pensionDataUpdate,
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.attendantAllowanceVerified"
    }),
     // common notifiation
     notificationTextSystem: getTextField({
      label: {
        labelName: "PENSION_NOTIFICATON",
        labelKey: "PENSION_NOTIFICATON"
      },
      gridDefination:{
        xs:24,
        sm: 12

      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "PENSION_NOTIFICATON",
        labelKey: "PENSION_NOTIFICATON"
      },
      required:false, 
      props: {
        disabled:true
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "ProcessInstances[0].pensionCalculationDetails.notificationTextSystem"
    }), 
    notificationTextVerified: getTextField({
      label: {
        labelName: "PENSION_NOTIFICATON_V",
        labelKey: "PENSION_NOTIFICATON_V"
      },
      gridDefination:{
        xs:24,
        sm: 12

      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "PENSION_NOTIFICATON_V",
        labelKey: "PENSION_NOTIFICATON_V"
      },
      required:false,  
     
      
      props: {
        disabled:data[3].pensionDataUpdate,
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "ProcessInstances[0].pensionCalculationUpdateDetails.notificationTextVerified"
    }), 
    
   })
});
}

