import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { applicationSuccessFooter } from "./acknowledgementResource/applicationSuccessFooter";
import { paymentSuccessFooter } from "./acknowledgementResource/paymentSuccessFooter";
import { approvalSuccessFooter } from "./acknowledgementResource/approvalSuccessFooter";
import { gotoHomeFooter } from "./acknowledgementResource/gotoHomeFooter";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import get from "lodash/get";
import set from "lodash/set";
import generatePdf from "../utils/receiptPdf";
import { Icon } from "egov-ui-framework/ui-atoms";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import {downloadAcknowledgementForm} from "../utils"
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
const abc=(  state,
  dispatch,
 applicationNumber,
  tenant)=>{
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
      downloadFormButton: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {

          div1: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",

            props:{
              iconName: "cloud_download",
            style:{
              marginTop: "7px",
              marginRight: "8px",
            }
          },
            onClick: {
              action: "condition",
              callBack: () => {
                const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
                const documents = LicensesTemp[0].reviewDocData;
                set(Licenses[0],"additionalDetails.documents", documents)
                downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
              }
            },
          },
          div2: getLabel({
            labelName: "DOWNLOAD CONFIRMATION FORM",
            labelKey: "TL_APPLICATION_BUTTON_DOWN_CONF"
          })

        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
            const documents = LicensesTemp[0].reviewDocData;
            set(Licenses[0],"additionalDetails.documents", documents)
            downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData);
          }
        },
      },
      PrintFormButton: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          div1: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",

            props:{
              iconName: "local_printshop",
              style:{
                marginTop: "7px",
                marginRight: "8px",
                marginLeft:"10px",
              }
          },
           onClick: {
            action: "condition",
            callBack: () => {
              const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
              const documents = LicensesTemp[0].reviewDocData;
              set(Licenses[0],"additionalDetails.documents", documents)
              downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData, 'print');
            }
          },

          },
          div2: getLabel({
            labelName: "PRINT CONFIRMATION FORM",
            labelKey: "TL_APPLICATION_BUTTON_PRINT_CONF"
          })

        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
            const documents = LicensesTemp[0].reviewDocData;
            set(Licenses[0],"additionalDetails.documents", documents)
            downloadAcknowledgementForm(Licenses, LicensesTemp[0].estimateCardData,'print');
          }
        },
      }

    },
    props: {
      style: {
        display: "flex",

      }
    },
  }
}

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  financialYear,
  tenant,
  receiptNumber,
  licenseNumber
) => {
  const financialYearText = financialYear ? financialYear : "";
  if (purpose === "apply" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for New Trade License (${financialYearText})`,
        labelKey: "TL_COMMON_APPLICATION_NEW_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  }
  else if (purpose === "renewApply" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Renew Trade License (${financialYearText})`,
        labelKey: "TL_COMMON_APPLICATION_RENEW_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        },
        iframeForPdf: {
          uiFramework: "custom-atoms",
          componentPath: "Div"
        },
        applicationSuccessFooter: applicationSuccessFooter(
          state,
          dispatch,
          applicationNumber,
          tenant
        )
      },
      abc: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
        },
        props: {
          style: {
            display: "flex",

          }
        },
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  }
  else if (purpose === "resubmit" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for New Trade License (${financialYearText})`,
        labelKey: "TL_COMMON_APPLICATION_NEW_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "TL_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
     
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  } else if (purpose === "pay" && status === "success") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Payment for New Trade License ${financialYearText}`,
          labelKey: "TL_COMMON_PAYMENT_NEW_LICENSE",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName:
                "Payment is collected successfully.",
              labelKey: "TL_CONFIRMATION_MESSAGE_MAIN"
            },
            subheader: {
              labelName:
                "Now you can dowload and issue Trade License Certificate to citizen.",
              labelKey: "TL_CONFIRMATION_MESSAGE_SUB_HEADER"
            },
            body: {
              labelName:
                "A notification regarding Payment Collection has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_CONFIRMATION_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "TL_PMT_RCPT_NO"
            },
            number: receiptNumber
          })
        }
      },
      paymentSuccessFooter: paymentSuccessFooter(
        state,
        dispatch,
        "APPROVED",
        applicationNumber
      )
    };
  } else if (purpose === "approve" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "TL_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "TL_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      approvalSuccessFooter
    };
    /* return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "TL_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "TL_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
            },
            number: licenseNumber || secondNumber
          })
        }
      },
      approvalSuccessFooter
    }; */
  } else if (purpose === "sendback" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "TL_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is sent back Successfully",
              labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      approvalSuccessFooter
    };
    /* return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "TL_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is sent back Successfully",
              labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_HEAD"
            },
            // body: {
            //   labelName:
            //     "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
            //   labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_SUB"
            // },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
            },
            number: licenseNumber || secondNumber
          })
        }
      },
      approvalSuccessFooter
    }; */
  }else if (purpose === "sendbacktocitizen" && status === "success") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "TL_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is sent back to Citizen Successfully",
              labelKey: "TL_SENDBACK_TOCITIZEN_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
            },
            number: licenseNumber || secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  }  else if (purpose === "application" && status === "rejected") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "TL_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Trade License Application Rejected",
              labelKey: "TL_APPROVAL_REJ_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Rejection has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPROVAL_REJ_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "TL_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Trade License Cancelled",
              labelKey: "TL_TL_CANCELLED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License cancellation has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_TL_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
            },
            number: licenseNumber || secondNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          dynamicArray: [financialYearText],
          labelKey: "TL_TRADE_APPLICATION"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "TL_PAYMENT_FAILED"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the trade owner and applicant.",
              labelKey: "TL_PAYMENT_FAIL_MESSAGE"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  } else if (purpose === "mark" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "TL_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Marked Successfully",
              labelKey: "TL_MARK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "TL_APPLICATION_MARKED_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "forward" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "TL_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "TL_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }else if ((purpose === "EDITRENEWAL" || purpose === "DIRECTRENEWAL") && status === "success") {
    return {

      header: getCommonContainer({
       Commonheader: getCommonHeader({
        labelName: `Application for Trade License Renewal ${financialYearText}`,
        labelKey: "TL_APPLICATION_TRADE_LICENSE_RENEWAL",
        dynamicArray: [financialYearText]
      }),
      licenseNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-tradelicence",
        componentPath: "ApplicationNoContainer",
        props: {
          number: "NA"
        },
        visible: true 
      }
    }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Renewed Successfully",
              labelKey: "TL_FORWARD_SUCCESS_MESSAGE_MAIN_RENEWAL"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "TL_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};


const getData = async (action, state, dispatch, purpose, status, financialYear, applicationNumber, secondNumber, tenant) => {
  await loadReceiptGenerationData(applicationNumber, tenant, state, dispatch);
  const receiptDataForReceipt = get(state, "screenConfiguration.preparedFinalObject.receiptDataForReceipt") || {};
  const applicationDataForReceipt = get(state, "screenConfiguration.preparedFinalObject.applicationDataForReceipt") || {}
  const {receiptNumber} = receiptDataForReceipt
  const {licenseNumber} = applicationDataForReceipt
  const data = getAcknowledgementCard(
    state,
    dispatch,
    purpose,
    status,
    applicationNumber,
    secondNumber,
    financialYear,
    tenant,
    receiptNumber,
    licenseNumber
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
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const financialYear = getQueryArg(window.location.href, "FY");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    getData(action, state, dispatch, purpose, status, financialYear, applicationNumber, secondNumber, tenant)
    return action;
  }
};

export default screenConfig;