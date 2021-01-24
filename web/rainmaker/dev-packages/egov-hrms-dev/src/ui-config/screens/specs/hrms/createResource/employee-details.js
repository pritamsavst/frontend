import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD,convertDateToEpoch,convertDateToEpochDays, epochToYmdDate } from "../../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const employeeDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Personal Details",
      labelKey: "HR_PERSONAL_DETAILS_FORM_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  employeeDetailsContainer: getCommonContainer({
    appellation: {
      ...getTextField({
        label: {
          labelName: "Appellation",
          labelKey: "HR_APPELLATION_LABEL"
        },
        placeholder: {
          labelName: "Enter Appellation",
          labelKey: "HR_APPELLATION_PLACEHOLDER"
        },
        required: true,
        pattern: /^[a-zA-Z]{0,5}$/i,
        jsonPath: "Employee[0].user.salutation"
      }),  
    },
    employeeName: {
      ...getTextField({
        label: {
          labelName: "Name",
          labelKey: "HR_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Employee Name",
          labelKey: "HR_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("alpha-only-with-space") || null,
        jsonPath: "Employee[0].user.name"
      })
    },
    mobileNumber: {
      ...getTextField({
        label: {
          labelName: "Mobile No.",
          labelKey: "HR_MOB_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "HR_MOB_NO_PLACEHOLDER"
        },
        title: {
          value: "Password/OTP will be sent to this number",
          key: "HR_MOB_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        required: true,
        pattern: getPattern("MobileNo"),
        jsonPath: "Employee[0].user.mobileNumber"
      })
    },
    fatherHusbandName: {
      ...getTextField({
        label: {
          labelName: "Father/Husband's Name",
          labelKey: "HR_FATHER_HUSBAND_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Father/Husband's Name",
          labelKey: "HR_FATHER_HUSBAND_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("alpha-only-with-space") || null,
        jsonPath: "Employee[0].user.fatherOrHusbandName"
      })
    },
    gender: {
      ...getSelectField({
        label: { labelName: "Gender", labelKey: "HR_GENDER_LABEL" },
        placeholder: {
          labelName: "Select Gender",
          labelKey: "HR_GENDER_PLACEHOLDER"
        },
        required: true,
        jsonPath: "Employee[0].user.gender",
        props: {
          className: "hr-generic-selectfield",
          data: [
            {
              value: "MALE",
              label: "COMMON_GENDER_MALE"
            },
            {
              value: "FEMALE",
              label: "COMMON_GENDER_FEMALE"
            },
            {
              value: "OTHERS",
             // label: "COMMON_GENDER_OTHERS"
              label: "OTHERS"
            }
          ],
          optionValue: "value",
          optionLabel: "label"
        }
      })
    },
    dateOfBirth: {
      ...getDateField({
        label: {
          labelName: "Date of Birth",
          labelKey: "HR_BIRTH_DATE_LABEL"
        },
        placeholder: {
          labelName: "Enter Date of Birth",
          labelKey: "HR_BIRTH_DATE_PLACEHOLDER"
        },
        required: true,  
        pattern: getPattern("Date"),
        jsonPath: "Employee[0].user.dob",
        props: {
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        if(action.value)
         {

          let dateOfAppointment = convertDateToEpoch(action.value)//dateOfAppointment
        dispatch(
          handleField(`create`,        
            "components.div.children.formwizardFirstStep.children.professionalDetails.children.cardContent.children.employeeDetailsContainer.children.dateOfAppointment",
            "props.inputProps",
            { min: new Date(dateOfAppointment).toISOString().slice(0, 10),
              max: new Date().toISOString().slice(0, 10),
            
            }
          )          
        ); 

       // let date = getTodaysDateInYMD();
        //let dobdefault = con
        let dateOfAppointment_ =  convertDateToEpochDays(action.value, "",(365*18))
  
        let employeeCode = getQueryArg(window.location.href, "employeeCode");
      if(!employeeCode)
      {
        dispatch(
          handleField(`create`,        
            "components.div.children.formwizardFirstStep.children.professionalDetails.children.cardContent.children.employeeDetailsContainer.children.dateOfAppointment",
            "props.value",
            dateOfAppointment_
          )          
        );

        dispatch(prepareFinalObject("Employee[0].serviceHistory[0].serviceFrom", epochToYmdDate(dateOfAppointment_)));
        dispatch(prepareFinalObject("Employee[0].dateOfAppointment", epochToYmdDate(dateOfAppointment_)));
        //set defaule date for assignment start data and service start date to ease date selection
        // dispatch(
        //   handleField(`create`,        
        //     "components.div.children.formwizardThirdStep.children.assignmentDetails.children.cardContent.children.assignmentDetailsCard.props.items.0.item0.children.cardContent.children.asmtDetailsCardContainer.children.assignFromDate",
        //     "props.value",
        //     dateOfAppointment_
        //   )          
        // );
      }
        
      }

      }
    },
    email: {
      ...getTextField({
        label: {
          labelName: "Email",
          labelKey: "HR_EMAIL_LABEL"
        },
        placeholder: {
          labelName: "Enter Email",
          labelKey: "HR_EMAIL_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Email"),
        jsonPath: "Employee[0].user.emailId"
      }),
      
    },
    correspondenceAddress: {
      ...getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "HR_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Corrospondence Address",
          labelKey: "HR_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Address"),
        jsonPath: "Employee[0].user.correspondenceAddress"
      })
    }
  })
});

export const professionalDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Professional Details",
        labelKey: "HR_PROFESSIONAL_DETAILS_FORM_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    employeeDetailsContainer: getCommonContainer({
      employeeId: {
        ...getTextField({
          label: {
            labelName: "Employee ID",
            labelKey: "HR_EMPLOYEE_ID_LABEL"
          },
          placeholder: {
            labelName: "Enter Employee ID",
            labelKey: "HR_EMPLOYEE_ID_PLACEHOLDER"
          },
          required: true,
          pattern: /^[a-zA-Z0-9-_]*$/i,
          jsonPath: "Employee[0].code"
        })
      },
      dateOfAppointment: {
        ...getDateField({
          label: {
            labelName: "Date of Appointment",
            labelKey: "HR_APPOINTMENT_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter Date of Appointment",
            labelKey: "HR_APPOINTMENT_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Employee[0].dateOfAppointment",
          // props: {
          //   inputProps: {
          //     max: new Date().toISOString().slice(0, 10),
          //   }
          // }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          if(action.value)
           {
          //   let assignFromDate = convertDateToEpoch(action.value, "dayStart")
          // dispatch(
          //   handleField(`create`,        
          //     "components.div.children.formwizardThirdStep.children.assignmentDetails.children.cardContent.children.assignmentDetailsCard.props.items[0].item0.children.cardContent.children.asmtDetailsCardContainer.children.assignFromDate",
          //     "props.inputProps",
          //     { min: new Date(assignFromDate).toISOString().slice(0, 10)}
          //   )
          // ); 
          // let dateOfAppointment_ =  convertDateToEpochDays(action.value, "",(1))
          // dispatch(
          //   handleField(`create`,        
          //     "components.div.children.formwizardThirdStep.children.assignmentDetails.children.cardContent.children.assignmentDetailsCard.props.items.0.item0.children.cardContent.children.asmtDetailsCardContainer.children.assignFromDate",
          //     "props.value",
          //     dateOfAppointment_
          //   )          
          // );
        }

        }
      },
      dateOfSuperannuation: {
        ...getDateField({
          label: {
            labelName: "Date of Superannuation",
            labelKey: "HR_SUPERANNUATION_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter Date of Super Annuation",
            labelKey: "HR_SUPERANNUATION_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Employee[0].dateOfSuperannuation",
          props: {
            inputProps: {
              min: new Date().toISOString().slice(0, 10),
            }
          },
        }),
      },
      employmentType: {
        ...getSelectField({
          label: {
            labelName: "Employement Type",
            labelKey: "HR_EMPLOYMENT_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Employment Type",
            labelKey: "HR_EMPLOYMENT_TYPE_PLACEHOLDER"
          },
          required: true,
          jsonPath: "Employee[0].employeeType",
          sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeType",
          props: {
            optionLabel: "status",
            optionValue: "code"
          },
          // localePrefix: {
          //   moduleName: "egov-hrms",
          //   masterName: "EmployeeType"
          // }
        })
      },
      status: {
        ...getSelectField({
          label: { labelName: "Status", labelKey: "HR_STATUS_LABEL" },
          placeholder: {
            labelName: "Select Status",
            labelKey: "HR_STATUS_PLACEHOLDER"
          },
          required: true,
          jsonPath: "Employee[0].employeeStatus",
          sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeStatus",
          props: {
            optionLabel: "status",
            optionValue: "code",
            disabled: true,
            value: "EMPLOYED"
          },
          // localePrefix: {
          //   moduleName: "egov-hrms",
          //   masterName: "EmployeeStatus"
          // }
        })
      },
      role: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-hrms",
        componentPath: "AutosuggestContainer",
        jsonPath: "Employee[0].user.roles",
        required: true,
        props: {
          optionLabel: "name",
          optionValue: "code",
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
          placeholder: {
            labelName: "Select Role",
            labelKey: "HR_ROLE_PLACEHOLDER"
          },
          jsonPath: "Employee[0].user.roles",
          sourceJsonPath: "createScreenMdmsData.furnishedRolesList",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          },
          // localePrefix: {
          //   moduleName: "ACCESSCONTROL_ROLES",
          //   masterName: "ROLES"
          // },
          isMulti: true,
        },
        gridDefination: {
          xs: 12,
          sm: 6
        }
      },
    })
  },
  {
    style: { overflow: "visible" }
  }
);
