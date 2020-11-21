import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './search-preview'
import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {getReviewConsolidatedPaymentDetails} from "./applyResource/reviewProperty"

var reviewConsolidatedPayment = getReviewConsolidatedPaymentDetails(false);

const reviewConsolidatedPaymentDetails = getCommonCard({
  reviewConsolidatedPayment

})

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if(fileNumber){
      let queryObject = [
          { key: "fileNumber", value: fileNumber }
        ];
   const response =  await getSearchResults(queryObject)
    if(!!response) {
      dispatch(prepareFinalObject("Properties", response.Properties))
    }
  }
}


const consolidatedPaymentDetails = {
  uiFramework: "material-ui",
  name: "consolidatedPayment",
  beforeInitScreen: (action, state, dispatch) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 7,
              onTabChange
            },
            type: "array",
          },
          breakAfterSearch: getBreak(),
          reviewConsolidatedPaymentDetails 
      }
    }
  }
};

export default consolidatedPaymentDetails;