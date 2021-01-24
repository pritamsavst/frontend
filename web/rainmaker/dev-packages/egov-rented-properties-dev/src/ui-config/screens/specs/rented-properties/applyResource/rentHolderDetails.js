import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

let userInfo = JSON.parse(getUserInfo());

const rentHolderHeader = getCommonTitle(
    {
        labelName: "Owner Details",
        labelKey: "RP_OWNER_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const applicantHeader = getCommonTitle(
    {
        labelName: "Applicant Details",
        labelKey: "RP_APPLICANT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
)

export const getGenderLabel = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "Properties[0].owners[0].ownerDetails.gender",
    props: {
      label: {
        name: "Gender",
        key: "RP_COMMON_GENDER_LABEL"
      },
      buttons: [
        {
            labelName: "Male",
            labelKey: "RP_COMMON_MALE",
            value: "MALE"
        },
        {
            label: "Female",
            labelKey: "RP_COMMON_FEMALE",
            value: "FEMALE"
        }
      ],
      jsonPath:"Properties[0].owners[0].ownerDetails.gender",
      required: true
    },
    required: true,
    type: "array",
    errorMessage: "RP_ERR_GENDER_FIELD",
  };


export const getRelationshipRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "Properties[0].owners[0].ownerDetails.relation",
    props: {
      label: {
        name: "Relationship",
        key: "RP_COMMON_RELATIONSHIP_LABEL"
      },
      buttons: [
        {
          labelName: "Father",
          labelKey: "RP_COMMON_RELATION_FATHER",
          value: "FATHER"
        },
        {
          label: "Husband",
          labelKey: "RP_COMMON_RELATION_HUSBAND",
          value: "HUSBAND"
        }
      ],
      jsonPath:"Properties[0].owners[0].ownerDetails.relation",
      required: true
    },
    required: true,
    type: "array",
    errorMessage: "RP_ERR_RELATIONSHIP_FIELD",
  };

  const ownerShipRelationShip = {
      ...getRelationshipRadioButton,
      jsonPath: "Owners[0].ownerDetails.relationWithDeceasedAllottee",
      props: {
          ...getRelationshipRadioButton.props,
          label: {
            name: "Relationship with deceased",
            key: "RP_COMMON_RELATIONSHIP_WITH_DECEASED_LABEL"
          },
          buttons: [
            {
              labelName: "Legal Heir",
              labelKey: "RP_COMMON_RELATION_LEGAL_HEIR",
              value: "LEGAL_HEIR"
            },
            {
              label: "Spouse",
              labelKey: "RP_COMMON_RELATION_SPOUSE",
              value: "SPOUSE"
            }
          ],
          jsonPath: "Owners[0].ownerDetails.relationWithDeceasedAllottee",
          //errorMessage: "RP_ERR_OWNER_RELATIONSHIP_FIELD",
      }
  }

const fatherOrHusbandsNameField = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    pattern:getPattern("alpha-only-with-space"),
    jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband",
    errorMessage: "RP_ERR_FATHER_OR_HUSBAND_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 40) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_FATHER_OR_HUSBAND_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_FATHER_OR_HUSBAND_FIELD_MAXLENGTH"
                )
            )
        }
        else if(action.value.length < 4){
          dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_FATHER_OR_HUSBAND_FIELD_MINLENGTH"
            )
        )
        dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_FATHER_OR_HUSBAND_FIELD_MINLENGTH"
            )
        )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_FATHER_OR_HUSBAND_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_FATHER_OR_HUSBAND_FIELD"
                )
            )
        }
      }
}

export const ownerNameField = {
    label: {
        labelName: "Owner Name",
        labelKey: "RP_OWNER_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Owner Name",
        labelKey: "RP_OWNER_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    pattern:getPattern("alpha-only-with-space"),
    jsonPath: "Properties[0].owners[0].ownerDetails.name",
    errorMessage: "RP_ERR_OWNER_NAME_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 40) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_OWNER_NAME_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_OWNER_NAME_FIELD_MAXLENGTH"
                )
            )
        }
        else if(action.value.length < 4){
          dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_OWNER_NAME_FIELD_MINLENGTH"
            )
        )
        dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_OWNER_NAME_FIELD_MINLENGTH"
            )
        )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_OWNER_NAME_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_OWNER_NAME_FIELD"
                )
            )
        }
      }
  }

const phoneNumberConfig = {
    label: {
        labelName: "Mobile No.",
        labelKey: "RP_MOBILE_NO_LABEL"
    },
    placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "RP_MOBILE_NO_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 10,
    maxLength: 10,
    required: true,
    pattern: getPattern("MobileNo"),
    errorMessage: "RP_ERR_PHONE_NUMBER_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 10) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_PHONE_NUMBER_FIELD_MAXLENGTH"
                )
            )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_PHONE_NUMBER_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_PHONE_NUMBER_FIELD"
                )
            )
        }
      }
  }

  const phoneNumberField = {
      ...phoneNumberConfig,
      jsonPath: "Properties[0].owners[0].ownerDetails.phone",
}

const dobFieldConfig = {
    label: {
        labelName: "Date of Birth",
        labelKey: "RP_DATE_BIRTH_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Birth",
        labelKey: "RP_DATE_BIRTH_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.dateOfBirth",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    },
    errorMessage: "RP_ERR_DOB_FIELD",
}  

const dobField = {
    ...dobFieldConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.dateOfBirth",
}

const deathField = {
    ...dobFieldConfig,
    label: {
        labelName: "Date of Death of Allotee",
        labelKey: "RP_DATE_DEATH_LABEL_ALLOTEE"
    },
    placeholder: {
        labelName: "Enter Date of Death",
        labelKey: "RP_DATE_DEATH_PLACEHOLDER"
    },
    jsonPath: "Owners[0].ownerDetails.dateOfDeathAllottee"
}

const emailConfig = {
    label: {
        labelName: "Email",
      labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
    },
    placeholder: {
        labelName: "Enter Email",
        labelKey: "RP_OWNER_DETAILS_EMAIL_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: false,
    pattern: getPattern("Email"),
    errorMessage:"RP_ERR_EMAIL_VALID_FIELD",
  }

const emailField = {
    ...emailConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.email",
    required: false
}

const aadharFieldConfig = {
    label: {
        labelName: "Aadhar Number",
        labelKey: "RP_AADHAR_LABEL"
    },
    placeholder: {
        labelName: "Enter Aadhar Number",
        labelKey: "RP_AADHAR_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: true,
}

const aadharField = {
    ...aadharFieldConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.aadhaarNumber",
    pattern:getPattern("AdharCardNumber"),
    errorMessage:"RP_ERR_ADHAR_CARD_VALIDATION",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 12) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION_MAXLENGTH"
                )
            )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION"
                )
            )
        }
      } 
}

const colonyField = {
    label: {
        labelName: "Colony",
        labelKey: "RP_COLONY_LABEL"
    },
    placeholder: {
        labelName: "Enter Colony",
        labelKey: "RP_COLONY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.correspondenceAddress.colony",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"RP_ERR_COLONY_FIELD",
}
const allotmentDateField = {
    label: {
        labelName: "Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.allotmentStartdate",
    errorMessage:"RP_ERR_ALLOTMENT_DATE_FEILD",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }
  const allotmentNumberField = {
    label: {
        labelName: "Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 20,
    required: true,
    errorMessage:"RP_ERR_ALLOTMENT_NUMBER_FIELD",
    jsonPath: "Properties[0].owners[0].allotmenNumber",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 20) {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ALLOTMENT_NUMBER_FIELD_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ALLOTMENT_NUMBER_FIELD_MAXLENGTH"
                )
            )
        }
        else if(action.value.length < 3){
          dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_ALLOTMENT_NUMBER_FIELD_MINLENGTH"
            )
        )
        dispatch(
            handleField(
              "apply",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_ALLOTMENT_NUMBER_FIELD_MINLENGTH"
            )
        )
        }
        else {
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ALLOTMENT_NUMBER_FIELD"
                )
            )
            dispatch(
                handleField(
                  "apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ALLOTMENT_NUMBER_FIELD"
                )
            )
        }
      }
  }

  const posessionDateField = {
    label: {
        labelName: "Date of Possession",
        labelKey: "RP_POSSESSION_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Possession",
        labelKey: "RP_POSSESSION_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.posessionStartdate",
    errorMessage:"RP_ERR_POSSESION_DATE_FIELD",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }

const getRentHolderDetails = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(ownerNameField),
            phone: getTextField(phoneNumberField),
            fatherOrHusbandsName:getTextField(fatherOrHusbandsNameField),
            relationShip: getRelationshipRadioButton,
            email: getTextField(emailField),
            aadhar: getTextField(aadharField),
            dateOfAllotment: getDateField(allotmentDateField),
            allotmentNumber: getTextField(allotmentNumberField),
            posessionDate: getDateField(posessionDateField)
        

        })
    }
}

const applicantNameField = {
    label: {
        labelName: "Applicant Name",
        labelKey: "RP_APPLICANT_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 100,
    pattern:getPattern("alpha-only-with-space"),
    required: true,
    jsonPath: "Owners[0].ownerDetails.name",
    errorMessage:"RP_ERR_APPLICANT_NAME_FIELD",
    afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 100) {
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_APPLICANT_NAME_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_APPLICANT_NAME_MAXLENGTH"
                )
            )
        }
        else if(action.value.length <4){
          dispatch(
            handleField(
              "ownership-apply",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_APPLICANT_NAME_MINLENGTH"
            )
        )
        dispatch(
            handleField(
              "ownership-apply",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_APPLICANT_NAME_MINLENGTH"
            )
        )
        }
        else {
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_APPLICANT_NAME_FIELD"
                )
            )
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_APPLICANT_NAME_FIELD"
                )
            )
        }
      } 
}
const applicantNameFieldMortgage = {
    label: {
        labelName: "Applicant Name",
        labelKey: "RP_APPLICANT_NAME_LABEL"
    },
    // placeholder: {
    //     labelName: "Enter Applicant Name",
    //     labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
    // },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    props: {
        disabled: true
      },
    jsonPath: "MortgageApplications[0].applicant[0].name",
}

const applicantNameFieldname = {
    label: {
        labelName: "Applicant Name",
        labelKey: "RP_APPLICANT_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    errorMessage:"RP_ERR_APPLICANT_NAME_FIELD"
}
const duplicateapplicantNameFieldname = {
    ...applicantNameFieldname,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        disabled: true
      },
    jsonPath: "DuplicateCopyApplications[0].applicant[0].name"
}

const applicantphoneNumberField = {
    ...phoneNumberConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        value: userInfo.userName,
        disabled: true
      },
    jsonPath: "Properties[0].owners[0].ownerDetails.phone"
}

const applicantphoneNumberFieldMortgage = {
    ...phoneNumberConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        value: userInfo.userName,
        disabled: true
      },
    jsonPath: "MortgageApplications[0].applicant[0].phone"
}

const applicantphoneNumberFieldduplicate = {
    ...phoneNumberConfig,
    props: {
        value: userInfo.userName,
        disabled: true
      },
    jsonPath: "DuplicateCopyApplications[0].applicant[0].phone"
}

export const  applicantGenderLabel = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "OwnerShipLicenses[0].owners[0].gender",
    props: {
      label: {
        name: "Gender",
        key: "RP_COMMON_GENDER_LABEL"
      },
      buttons: [
        {
            labelName: "Male",
            labelKey: "RP_COMMON_MALE",
            value: "MALE"
        },
        {
            label: "Female",
            labelKey: "RP_COMMON_FEMALE",
            value: "FEMALE"
        }
      ],
      jsonPath:"OwnerShipLicenses[0].owners[0].gender",
      required: true
    },
    required: true,
    type: "array",
    errorMessage:"RP_ERR_GENDER_FIELD"
};

const fatherOrHusbandsNameOwnerShip = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    props: {
        disabled: true
      },
    jsonPath: "Owners[0].ownerDetails.fatherOrHusband",
    errorMessage:"RP_ERR_FATHER_OR_HUSBAND_FIELD"
}
const fatherOrHusbandsName = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    props: {
        disabled: true
      },
    jsonPath: "DuplicateCopyApplications[0].applicant[0].guardian",
    errorMessage:"RP_ERR_FATHER_OR_HUSBAND_FIELD"
}

const fatherOrHusbandsNameMortgage = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    props: {
        disabled: true
      },
    jsonPath: "MortgageApplications[0].applicant[0].guardian",
    errorMessage:"RP_ERR_FATHER_OR_HUSBAND_FIELD"
}

const ownerShipRelationShipduplicate = {
      ...getRelationshipRadioButton,
      jsonPath: "DuplicateCopyApplications[0].applicant[0].relationship",
      props: {
          ...getRelationshipRadioButton.props,
          buttons: [
            {
                labelName: "Father",
                labelKey: "RP_COMMON_RELATION_FATHER",
                value: "FATHER",
                disabled:true
              },
              {
                label: "Husband",
                labelKey: "RP_COMMON_RELATION_HUSBAND",
                value: "HUSBAND",
                disabled:true
              }
          ],
          props: {
            disabled: true
          },
          jsonPath: "DuplicateCopyApplications[0].applicant[0].relationship"
      },
  }

  const ownerShipRelationShipMortgage = {
    ...getRelationshipRadioButton,
    jsonPath: "MortgageApplications[0].applicant[0].relationship",
    props: {
        ...getRelationshipRadioButton.props,
        label: {
            name: "Relationship",
            key: "RP_COMMON_RELATIONSHIP_LABEL"
          },
          buttons: [
            {
                labelName: "Father",
                labelKey: "RP_COMMON_RELATION_FATHER",
                value: "FATHER",
                disabled: true
              },
              {
                label: "Husband",
                labelKey: "RP_COMMON_RELATION_HUSBAND",
                value: "HUSBAND",
                disabled: true
              }
          ],
        props: {
            disabled: true
          },
        jsonPath: "MortgageApplications[0].applicant[0].relationship"
    }
}

const applicantEmailField = {
    ...emailConfig,
    props: {
        value:userInfo.emailId,
        disabled:true
      },
    jsonPath: "Owners[0].ownerDetails.email",
    required: false
}

const applicantEmailFieldduplicate = {
    ...emailConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        value:userInfo.emailId,
        disabled: true
      },
    jsonPath: "DuplicateCopyApplications[0].applicant[0].email",
    required: false
}

const applicantEmailFieldMortgage = {
    ...emailConfig,
    props: {
        value:userInfo.emailId,
        disabled: true
      },
    jsonPath: "MortgageApplications[0].applicant[0].email",
    required: false
}


const applicantAadharField = {
    ...aadharFieldConfig,
    pattern:getPattern("AdharCardNumber"),
    errorMessage:"RP_ERR_ADHAR_CARD_VALIDATION",
     jsonPath: "Owners[0].ownerDetails.aadhaarNumber",
     afterFieldChange: (action, state, dispatch) => {
        if (action.value.length > 12) {
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION_MAXLENGTH"
                )
            )
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION_MAXLENGTH"
                )
            )
        }
        else {
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION"
                )
            )
            dispatch(
                handleField(
                  "ownership-apply",
                  action.componentJsonpath,
                  "props.errorMessage",
                  "RP_ERR_ADHAR_CARD_VALIDATION"
                )
            )
        }
      } 
}

const applicantAadharFieldduplicate = {
    ...aadharFieldConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        disabled: true
      },
     jsonPath: "DuplicateCopyApplications[0].applicant[0].adhaarNumber"
}

const applicantAadharFieldMortgage = {
    ...aadharFieldConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        disabled: true
      },
     jsonPath: "MortgageApplications[0].applicant[0].adhaarNumber"
}

const applicantAddressField = {
    label: {
        labelName: "Applicant Correspondence Address",
        labelKey: "RP_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Correspondence Address",
        labelKey: "RP_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "OwnerShipLicenses[0].owners[0].correspondenceAddress",
    errorMessage: "RP_ERR_ADDRESS_FIELD"
}





const getApplicantDetails = () => {
    return {
        header: applicantHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(applicantNameField),
            fatherOrHusband: getTextField(fatherOrHusbandsNameOwnerShip),
            relationShip: ownerShipRelationShip,
            phone: getTextField(applicantphoneNumberField),
            deathOfAllotee: getDateField(deathField),
            email: getTextField(applicantEmailField),
            aadhar: getTextField(applicantAadharField),
        })
    }
}

const getApplicantDetailsMortgage = () => {
    return {
        header: applicantHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(applicantNameFieldMortgage),
            email: getTextField(applicantEmailFieldMortgage),
            phone: getTextField(applicantphoneNumberFieldMortgage),
            fatherOrHusband: getTextField(fatherOrHusbandsNameMortgage),
            relationShip: ownerShipRelationShipMortgage,
            aadhar: getTextField(applicantAadharFieldMortgage),
            // deathOfAllotee: getDateField(deathField),
            
            
        })
    }
}

const getApplicantDetailsForDuplicateCopy = () => {
    return {
        header: applicantHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(duplicateapplicantNameFieldname),
            fatherOrHusband:getTextField(fatherOrHusbandsName),
            relationShip: ownerShipRelationShipduplicate,
            phone: getTextField(applicantphoneNumberFieldduplicate),
            email: getTextField(applicantEmailFieldduplicate),
            aadhar: getTextField(applicantAadharFieldduplicate),
        })
    }
}




export const applicantDetails = getCommonCard(getApplicantDetails())
export const applicantDetailsMortgage = getCommonCard(getApplicantDetailsMortgage())

export const rentHolderDetails = getCommonCard(getRentHolderDetails())

export const rentHolderDetailsForDuplicateProperties = getCommonCard(getApplicantDetailsForDuplicateCopy())

