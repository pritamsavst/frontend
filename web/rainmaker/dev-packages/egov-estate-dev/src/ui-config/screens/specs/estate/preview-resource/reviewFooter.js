import {
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getButtonVisibility,
    getCommonApplyFooter
  } from "../../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

  export const footerReview = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId,
    businessService,
    branchType
  ) => {
    /** MenuButton data based on status */

    return getCommonApplyFooter({
      container: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
              style: {
              float:"right",
              display:"flex"
              }
            },
            children: {
              makePayment: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  },
                  className: "make-payment-footer-button"
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "MAKE PAYMENT",
                    labelKey: "COMMON_MAKE_PAYMENT"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate-citizen/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
                      )
                    );
                  },
  
                },
                visible: process.env.REACT_APP_NAME === "Citizen"  && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
              },
              uploadDocument: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "UPLOAD DOCUMENTS",
                    labelKey: "ES_UPLOAD_DOCUMENTS"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(prepareFinalObject("ResubmitAction", true))
                  },
                },
                visible: process.env.REACT_APP_NAME === "Citizen"  && getButtonVisibility(status, "UPLOAD_DOCUMENT") ? true : false
              },
              offlinePayment: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "MAKE PAYMENT",
                    labelKey: "COMMON_MAKE_PAYMENT"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
                      )
                    );
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
              },
              nocVerification: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "60px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "NOC Verification",
                    labelKey: "ES_NOC_VERIFICATION"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate/noc-verification?applicationNumber=${applicationNumber}&tenantId=${tenantId}&branchType=${branchType}`
                      )
                    );
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "NOCVERIFICATION") ? true : false
              },
              siteReport: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "60px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  siteReportButtonLabel: getLabel({
                    labelName: "Site Report",
                    labelKey: "ES_SITE_REPORT"
                  }),
                  nextIcon: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "keyboard_arrow_right"
                    }
                  }
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate/site-report?applicationNumber=${applicationNumber}&tenantId=${tenantId}&branchType=${branchType}`
                      )
                    );
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "SITEREPORT") ? true : false
              }
            },
            gridDefination: {
              xs: 12,
              sm: 12
            }
          },     
        }
      }
    });
  };