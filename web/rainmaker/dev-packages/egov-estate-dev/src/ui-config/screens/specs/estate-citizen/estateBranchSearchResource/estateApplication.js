import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  searchApiCall
} from "./searchFunctions";
import get from "lodash/get";
import {
  displayCustomErr,
  displayDefaultErr
} from "../../utils";

const searchBy = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
  },
  props: {
    label: {
      name: "Search By",
      key: "ES_SEARCH_BY_LABEL"
    },
    buttons: [{
        labelName: "File No.",
        labelKey: "ES_FILE_NUMBER_LABEL",
        value: "File Number"
      },
      {
        label: "Site No.",
        labelKey: "ES_SITE_NUMBER_LABEL",
        value: "Site Number"
      }
    ],
    value: "File Number",
    jsonPath: "citizenSearchScreen.searchBy",
    required: true
  },
  required: true,
  jsonPath: "citizenSearchScreen.searchBy",
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value) {
      if (action.value == "File Number") {
        let siteNumberContainerItems = ["category", "subCategory", "siteNumber", "sectorNumber"];
        dispatch(
          handleField(
            "estate-branch-property-search",
            "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
            "visible",
            true
          )
        )

        siteNumberContainerItems.map(item => {
          dispatch(
            handleField(
              "estate-branch-property-search",
              `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
              "visible",
              false
            )
          )
        })
        
      }
      else {
        let siteNumberContainerItems = ["category", "siteNumber", "sectorNumber"];
        dispatch(
          handleField(
            "estate-branch-property-search",
            "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer",
            "visible",
            false
          )
        )
        siteNumberContainerItems.map(item => {
          dispatch(
            handleField(
              "estate-branch-property-search",
              `components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.${item}`,
              "visible",
              true
            )
          )
        })
      }
    }
  }
};
export const estateApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Estate",
    labelKey: "ES_HOME_SEARCH_RESULTS_HEADING"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for a property",
    labelKey: "ES_HOME_SEARCH_RESULTS_DESC"
  }),
  searchBoxContainer: getCommonContainer({
    searchBy: searchBy,
    fileNumberContainer: getCommonContainer({
      fileNumber: getTextField({
        label: {
          labelName: "File No.",
          labelKey: "ES_FILE_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter File No.",
          labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: true,
        // pattern: /^[a-zA-Z0-9-]*$/i,
        minLength: 1,
        maxLength: 50,
        errorMessage: "ES_ERR_INVALID_FILE_NO",
        jsonPath: "searchScreenFileNo.fileNumber",
        afterFieldChange: (action, state, dispatch) => {
          if (action.value.length > 50) {
              displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", "estate-branch-property-search");
          }
          else {
              displayDefaultErr(action.componentJsonpath, dispatch, "estate-branch-property-search");
          }
      }
      })
    }),
    siteNumberContainer: getCommonContainer({
      category: getSelectField({
        label: {
            labelName: "Category",
            labelKey: "ES_CATEGORY_LABEL"
        },
        placeholder: {
            labelName: "Select Category",
            labelKey: "ES_CATEGORY_PLACEHOLDER"
        },
        visible: false,
        required: true,
        jsonPath: "searchScreenSiteNo.category",
        sourceJsonPath: "searchScreenMdmsData.EstateServices.categories",
        gridDefination: {
            xs: 12,
            sm: 6
        },
        beforeFieldChange: (action, state, dispatch) => {
            if (action.value == "CAT.RESIDENTIAL"  || action.value == "CAT.COMMERCIAL") {
              dispatch(
                  handleField(
                      "estate-branch-property-search",
                      "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                      "visible",
                      true
                  )
              );
  
              const categories = get(
                  state.screenConfiguration.preparedFinalObject,
                  "searchScreenMdmsData.EstateServices.categories"
              )
  
              const filteredCategory = categories.filter(item => item.code === action.value)
              dispatch(
                  handleField(
                      "estate-branch-property-search",
                      "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                      "props.data",
                      filteredCategory[0].SubCategory
                  )
              )
          }
          else {
            dispatch(
              handleField(
                  "estate-branch-property-search",
                  "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
                  "visible",
                  false
              )
          );
          }
        }
      }),
      subCategory: getSelectField({
        label: {
          labelName: "Sub Category",
          labelKey: "ES_SUBCATEGORY_LABEL"
        },
        placeholder: {
            labelName: "Select Sub Category",
            labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreenSiteNo.subCategory",
        visible: false,
        gridDefination: {
            xs: 12,
            sm: 6
        }
      }),
      siteNumber: getTextField({
        label: {
          labelName: "Site Number",
          labelKey: "ES_SITE_NUMBER_LABEL"
        },
        errorMessage: "ES_ERR_MAXLENGTH_50",
        placeholder: {
            labelName: "Enter Site Number",
            labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        required: true,
        visible: false,
        minLength: 1,
        maxLength: 50,
        jsonPath: "searchScreenSiteNo.siteNumber"
      }),
      sectorNumber: getSelectField({
        label: {
            labelName: "Sector Number",
            labelKey: "ES_SECTOR_NUMBER_LABEL"
        },
        placeholder: {
            labelName: "Select Sector Number",
            labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
        },
        // required: true,
        visible: false,
        jsonPath: "searchScreenSiteNo.sectorNumber",
        sourceJsonPath: "searchScreenMdmsData.EstateServices.sector",
        gridDefination: {
            xs: 12,
            sm: 6
        }
      }),
    })
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "70%",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "70%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "ES_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      }
    })
  })
});

function resetFields(state, dispatch) {
  let fileNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenFileNo.fileNumber", "");
  let category = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.category", "");
  let subCategory = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.subCategory", "");
  let siteNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.siteNumber", "");
  let sectorNumber = get(state.screenConfiguration.preparedFinalObject, "searchScreenSiteNo.sectorNumber", "");

  if (fileNumber) {
    dispatch(
      handleField(
        "estate-branch-property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.fileNumberContainer.children.fileNumber",
        "props.value",
        ""
      )
    )
  }

  if (category) {
    dispatch(
      handleField(
        "estate-branch-property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.category",
        "props.value",
        ""
      )
    )
  }

  if (subCategory) {
    dispatch(
      handleField(
        "estate-branch-property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.subCategory",
        "props.value",
        ""
      )
    )
  }

  if (siteNumber) {
    dispatch(
      handleField(
        "estate-branch-property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.siteNumber",
        "props.value",
        ""
      )
    )
  }

  if (sectorNumber) {
    dispatch(
      handleField(
        "estate-branch-property-search",
        "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.siteNumberContainer.children.sectorNumber",
        "props.value",
        ""
      )
    )
  }
}