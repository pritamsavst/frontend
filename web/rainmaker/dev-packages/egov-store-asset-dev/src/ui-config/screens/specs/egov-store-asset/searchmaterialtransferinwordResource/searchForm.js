import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getDateField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["mrnNumber", "issueingStore","receiptDate",];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-material-transfer-inword.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-material-transfer-inword",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
};
export const searchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Criteria",
    labelKey: "STORE_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  }),
  searchFormContainer: getCommonContainer({
    mrnNumber: getTextField({
      label: { labelName: "Material Receipt Number", labelKey: "STORE_MATERIAL_COMMON_MRN_NUMBER" },
      placeholder: {
        labelName: "Material Receipt Number",
        labelKey: "STORE_MATERIAL_COMMON_MRN_NUMBER",
      },
      required: false,
      jsonPath: "searchScreen.mrnNumber",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
     
    }),
    issueingStore: {
      ...getSelectField({
        label: {
          labelName: "From Store",
          labelKey: "STORE_DETAILS_STORE_NAME_FROM"
        },
        placeholder: {
          labelName: "Select From Store",
          labelKey: "STORE_DETAILS_STORE_NAME_FROM_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.fromStore", 
        gridDefination: {
          xs: 12,
          sm: 4,
        },        
        sourceJsonPath: "store.stores",
        props: {
          optionValue: "code",
          optionLabel: "name",
        },
      })
    },
    issueStoreto: {
      ...getSelectField({
        label: {
          labelName: "To Store",
          labelKey: "STORE_DETAILS_STORE_NAME_TO"
        },
        placeholder: {
          labelName: "Select To Store",
          labelKey: "STORE_DETAILS_STORE_NAME_TO_SELECT"
        },
        required: false,
        visible:false,
        jsonPath: "searchScreen.issueStoreto", 
        gridDefination: {
          xs: 12,
          sm: 4,
        },        
        sourceJsonPath: "store.stores",
        props: {
          optionValue: "code",
          optionLabel: "name",
        },
      })
    },
    receiptDate: {
      ...getDateField({
        label: {
          labelName: "Receipt Date",
          labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE "
        },
        placeholder: {
          labelName: "Enter Receipt Date",
          labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE_PLACEHOLDER"
        },
        required: false,
        pattern: getPattern("Date") || null,
        jsonPath: "searchScreen.receiptDate",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        props: {
          // inputProps: {
          //   max: getTodaysDateInYMD()
          // }
        }
      })
    },
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "center",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
    }),
  }),
});
