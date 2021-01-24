import {
  getCommonHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import {
  applicationSuccessFooter
} from "./acknowledgementResource/applicationSuccessFooter";
import { WF_ALLOTMENT_OF_SITE, WF_BB_PROPERTY_MASTER } from "../../../../ui-constants";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";

const getAcknowledgementCard = (
  state,
  dispatch,
  {
  purpose,
  status,
  tenant,
  fileNumber,
  type,
  businessService,
  applicationNumber
}
) => {
  var header;
  if (status === "success") {
    if(type === WF_ALLOTMENT_OF_SITE || type === WF_BB_PROPERTY_MASTER) {
    if (purpose == "apply") {
      header = {
        labelName: "Estate Property Master Entry Submitted Successfully",
        labelKey: "ES_MASTER_ENTRY_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "allotment") {
      header = {
        labelName: "Estate allotment of site entry submitted successfully",
        labelKey: "ES_AOS_ENTRY_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "forward") {
      header = {
        labelName: "Estate Property Master Entry Forwarded Successfully",
        labelKey: "ES_MASTER_ENTRY_FORWARD_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "sendback") {
      header = {
        labelName: "Estate Property Master Entry is Sent Back Successfully",
        labelKey: "ES_MASTER_ENTRY_SENDBACK_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "reject") {
      header = {
        labelName: "Estate Property Master Entry Rejected",
        labelKey: "ES_MASTER_ENTRY_REJECT_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if (purpose == "approve") {
      header = {
        labelName: "Estate Property Master Entry is Approved Successfully",
        labelKey: "ES_MASTER_ENTRY_APPROVE_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if(purpose === "submit") {
      header = {
        labelName: "Estate Property Master Entry is Submitted Successfully",
        labelKey: "ES_MASTER_ENTRY_SUBMIT_SUCCESS_MESSAGE_MAIN"
      }
    }
    else if(purpose === "modify") {
      header = {
        labelName: "Estate Property Master Entry is Modified Successfully",
        labelKey: "ES_MASTER_ENTRY_MODIFY_SUCCESS_MESSAGE_MAIN"
      }
    }
    else {
      header = {}
    }
  } else {
    if(!!type) {
      if(purpose === "pay") {
        header = {
          labelName: "Payment is collected successfully",
          labelKey: "ES_PAYMENT_SUCCESS_MESSAGE_HEAD"
        }
      } else {
        const label = `ES_${type.toUpperCase()}_${purpose.toUpperCase()}_MESSAGE`
        header = {
          labelName: `${label}`,
          labelKey: `${label}`
        }
      }
    }else if(purpose === "penalty"){
      header = {
        labelName: "Penalty is Added successfully",
        labelKey: "ES_ADD_PENALTY_SUCCESS_MESSAGE_HEAD"
      }
    }else if(purpose === "extensionFee"){
      header = {
        labelName: "Extension Fee is Added successfully",
        labelKey: "ES_ADD_EXTENSION_FEE_SUCCESS_MESSAGE_HEAD"
      }
    }else if(purpose === "adHocDemand"){
      header = {
        labelName: "Adhoc Demand Added successfully",
        labelKey: "ES_ADHOC_DEMAND_SUCCESS_MESSAGE_HEAD"
      }
    } else {
      if(!type && purpose === "pay") {
        header = {
          labelName: "Payment is collected successfully",
          labelKey: "ES_PAYMENT_SUCCESS_MESSAGE_HEAD"
        }
      } else {
        header = {}
      }
    }
  }

    const tailText = !!fileNumber ?
    {
      labelName: "File Number",
      labelKey: "ES_FILE_NUMBER_LABEL"
    } : 
    {
      labelName: "Application Number",
      labelKey: "ES_APPLICATION_NUMBER_LABEL"
    }

    const commonHeader = (type === WF_ALLOTMENT_OF_SITE || type === WF_BB_PROPERTY_MASTER) ? {
      labelName: 'Estate Property Master Entry',
      labelKey: "ES_PROPERTY_MASTER_ENTRY",
    } : !!type ? 
    {labelName: `ES_${type.toUpperCase()}`, labelKey: `ES_${type.toUpperCase()}`} : 
    {labelName: "ES_ESTATE_SERVICES", lableKey: "ES_ESTATE_SERVICES"}

    return {
      header: getCommonHeader(commonHeader),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: purpose === "reject" ? "close" : "done",
            backgroundColor: purpose === "reject" ? "#E54D42" : "#39CB74",
            header,
            tailText: tailText,
            number: fileNumber || applicationNumber
          })
        }
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        tenant
      )
    };
  } else if(status === "failure" && purpose === "pay") {
    const commonHeader = !!type ? 
    {labelName: `ES_${type.toUpperCase()}`, labelKey: `ES_${type.toUpperCase()}`} : 
    {}
    return {
      header: getCommonHeader(commonHeader),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment is Failed!",
              labelKey: "ES_PAYMENT_FAILED_MESSAGE_HEAD"
            },
            // body: {
            //   labelName:
            //     "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
            //   labelKey: "ES_APPLICATION_SUCCESS_MESSAGE_SUB"
            // },
            tailText: {
              labelName: "Application Number",
              labelKey: "ES_APPLICATION_NUMBER_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant, businessService)
    }
  }
}

const getData = async (action, state, dispatch, {purpose, status, tenant, fileNumber, applicationNumber, type, businessService}) => {
  const data = await getAcknowledgementCard(
    state,
    dispatch,
    { 
    purpose,
    status,
    tenant,
    fileNumber,
    type,
    businessService,
    applicationNumber
    }
  );
  dispatch(
    handleField(
      "acknowledgement",
      "components.div",
      "children",
      data
    )
  );
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    let fileNumber = getQueryArg(
      window.location.href,
      "fileNumber"
    );
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber")
    if(!!applicationNumber && applicationNumber.startsWith("SITE")) {
      const array = applicationNumber.split("-");
      array.splice(array.length-6)
      array.splice(0,1)
      fileNumber = array.join("-");
    }
    const tenant = getQueryArg(window.location.href, "tenantId");
    const type = getQueryArg(window.location.href, "type")
    const businessService = getQueryArg(window.location.href, "businessService")
    getData(action, state, dispatch, {purpose, status, tenant, fileNumber, applicationNumber, type, businessService})
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  }
};

export default screenConfig;