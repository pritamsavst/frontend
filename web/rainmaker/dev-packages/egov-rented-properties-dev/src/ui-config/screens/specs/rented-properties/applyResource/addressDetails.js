import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "../../utils";
import get from "lodash/get";

const addressHeader = getCommonTitle(
    {
        labelName: "Address Details",
        labelKey: "RP_ADDRESS_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const areaField = {
    label: {
        labelName: "Area",
        labelKey: "RP_AREA_LABEL"
    },
    placeholder: {
        labelName: "Enter Area",
        labelKey: "RP_AREA_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.area"
  }

const districtField = {
    label: {
        labelName: "District",
        labelKey: "RP_DISTRICT_LABEL"
    },
    placeholder: {
        labelName: "Enter District",
        labelKey: "RP_DISTRICT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.district"
  }

const stateField = {
    label: {
        labelName: "State",
        labelKey: "RP_STATE_LABEL"
    },
    placeholder: {
        labelName: "Enter State",
        labelKey: "RP_STATE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.state"
  }

const countryField = {
    label: {
        labelName: "Country",
        labelKey: "RP_COUNTRY_LABEL"
    },
    placeholder: {
        labelName: "Enter Country",
        labelKey: "RP_COUNTRY_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.country"
  }

const landmarkField = {
    label: {
        labelName: "Landmark",
        labelKey: "RP_LANDMARK_LABEL"
    },
    placeholder: {
        labelName: "Enter Landmark",
        labelKey: "RP_LANDMARK_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.landmark",
    optionValue: "code",
    optionLabel: "label",
    gridDefination: {
        xs: 12,
        sm: 6
    }
  }

const pincodeField = {
    label: {
        labelName: "Pincode",
        labelKey: "RP_PINCODE_LABEL"
    },
    placeholder: {
        labelName: "Enter Pincode",
        labelKey: "RP_PINCODE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.pincode"
  }
 
const getAddressDetails = () => {
    return {
        header: addressHeader,
        detailsContainer: getCommonContainer({
            area: getTextField(areaField),
            district: getTextField(districtField),
            state: getTextField(stateField),
            country: getTextField(countryField),
            pincode: getTextField(pincodeField),
            landmark: getTextField(landmarkField)
        })
    }
}

export const addressDetails = getCommonCard(getAddressDetails())