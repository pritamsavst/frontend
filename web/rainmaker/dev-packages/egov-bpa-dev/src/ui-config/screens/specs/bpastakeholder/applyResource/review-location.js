import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";

export const getLocationDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Address Details",
            labelKey: "BPA_NEW_ADDRESS_HEADER_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewPermanantAddress: getLabelWithValue(
        {
          labelName: "Permanant Address",
          labelKey: "BPA_PERMANANT_ADDRESS_LABEL"
        },
        {
          jsonPath:
            "Licenses[0].tradeLicenseDetail.owners[0].address.addressLine1"
        }
      ),
      reviewCommunicationAddress: getLabelWithValue(
        {
          labelName: "Communication Address",
          labelKey: "BPA_COMMUNICATION_ADDRESS_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1" }
      )
    })
  });
};

export const getPermanentDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Permanent Details",
            labelKey: "BPA_PERMENENT_ADDRESS_HEADER_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewDoorHouseNo: getLabelWithValue(
        {
          labelName: "Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.doorNo"
        }
      ),
      reviewBuilidingName: getLabelWithValue(
        {
          labelName: "Building/Colony Name",
          labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
        },
        { jsonPath: "LicensesTemp[0].userData.address.buildingName" }
      ),
      reviewStreetName: getLabelWithValue(
        {
          labelName: "Enter Street Name",
          labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.street"
        }
      ),
      reviewMohalla: getLabelWithValue(
        {
          labelName: "Locality",
          labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
        },
        { jsonPath: "LicensesTemp[0].userData.address.landmark" }
      ),
      reviewCity: getLabelWithValue(
        {
          labelName: "City",
          labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
        },
        {
          jsonPath: "LicensesTemp[0].userData.address.city"
        }
      ),
      reviewPincode: getLabelWithValue(
        {
          labelName: "Pincode",
          labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
        },
        { jsonPath: "LicensesTemp[0].userData.address.pincode" }
      )
    })
  });
};

export const getCommunicactionDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Communication Details",
            labelKey: "BPA_COMMUNICATION_ADDRESS_HEADER_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewDoorHouseNo: getLabelWithValue(
        {
          labelName: "Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo"
        }
      ),
      reviewBuilidingName: getLabelWithValue(
        {
          labelName: "Building/Colony Name",
          labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName" }
      ),
      reviewStreetName: getLabelWithValue(
        {
          labelName: "Enter Street Name",
          labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.street"
        }
      ),
      reviewMohalla: getLabelWithValue(
        {
          labelName: "Locality",
          labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.landmark" }
      ),
      reviewCity: getLabelWithValue(
        {
          labelName: "City",
          labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.city"
        }
      ),
      reviewPincode: getLabelWithValue(
        {
          labelName: "Pincode",
          labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode" }
      )
    })
  });
};
