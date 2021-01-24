import {
    getCommonHeader,
    getCommonContainer,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { showCityPicker, applyForm } from "../utils";
  
  export const cityPicker = getCommonContainer({
    header: getCommonHeader({
      labelName: "Pick your city.",
      labelKey: "RP_PICK_YOUR_CITY_CITIZEN"
    }),
    cityPicker: getCommonContainer({
      cityDropdown: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-rented-properties",
        componentPath: "AutosuggestContainer",
        jsonPath: "citiesByModule.citizenTenantId",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          className: "citizen-city-picker",
          label: {
            labelName: "City",
            labelKey: "RP_NEW_TRADE_DETAILS_CITY_LABEL"
          },
          placeholder: { labelName: "Select City", labelKey: "RP_SELECT_CITY" },
          jsonPath: "citiesByModule.citizenTenantId",
          sourceJsonPath:
            "applyScreenMdmsData.common-masters.citiesByModule.TL.tenants",
          labelsFromLocalisation: true,
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          }
        }
      },
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          selectButton: {
            componentPath: "Button",
            props: {
              variant: "contained",
              color: "primary",
              style: {
                width: "40px",
                height: "20px",
                marginRight: "4px",
                marginTop: "16px"
              }
            },
            children: {
              previousButtonLabel: getLabel({
                labelName: "SELECT",
                labelKey: "RP_CITIZEN_SELECT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                applyForm(state, dispatch, "/rented-properties-citizen/ownership-apply")
              }
            }
          },
          cancelButton: {
            componentPath: "Button",
            props: {
              variant: "outlined",
              color: "primary",
              style: {
                width: "40px",
                height: "20px",
                marginRight: "4px",
                marginTop: "16px"
              }
            },
            children: {
              previousButtonLabel: getLabel({
                labelName: "CANCEL",
                labelKey: "RP_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: showCityPicker
            }
          }
        }
      }
    })
  });
  