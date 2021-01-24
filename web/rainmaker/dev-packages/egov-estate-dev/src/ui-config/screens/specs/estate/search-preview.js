import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { 
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewAuction, getPropertyDetails,getAllotmentDetails,getAdditionalDetails ,getReviewRentSummary} from "./preview-resource/preview-properties";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { WF_ALLOTMENT_OF_SITE } from "../../../../ui-constants";
import {
  get
} from "lodash";


let fileNumber = getQueryArg(window.location.href, "fileNumber");
let tenantId = getTenantId();
let isPropertyMasterOrAllotmentOfSite;

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Estate",
    labelKey: "ES_COMMON_ESTATE"
  })
});
// const reviewAuctionDetails = getReviewAuction(false);
const reviewPropertyDetails = getPropertyDetails(false);
const reviewAllotmentDetails = getAllotmentDetails(false);
const additionalDetails = getAdditionalDetails(false)
const reviewRentSummary = getReviewRentSummary(false);

export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  // reviewAuctionDetails,
  // reviewAllotmentDetails,
  additionalDetails,
  reviewRentSummary
});

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    let propertyRegisteredTo = properties[0].propertyDetails.propertyRegisteredTo;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)
    let category = properties[0].category;
    isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
    
    let {estateRentSummary} = properties[0]
   
    if(!!estateRentSummary){
      estateRentSummary.outstanding =  (Number(estateRentSummary.balanceRent) + 
      Number(estateRentSummary.balanceGST) + Number(estateRentSummary.balanceGSTPenalty) +
      Number(estateRentSummary.balanceRentPenalty)).toFixed(2)
      estateRentSummary.balanceGST =  Number(estateRentSummary.balanceGST).toFixed(2)
      estateRentSummary.balanceRent = Number(estateRentSummary.balanceRent).toFixed(2)
      estateRentSummary.collectedRent = Number(estateRentSummary.collectedRent).toFixed(2)
      estateRentSummary.balanceGSTPenalty = Number(estateRentSummary.balanceGSTPenalty).toFixed(2)
      estateRentSummary.balanceRentPenalty = Number(estateRentSummary.balanceRentPenalty).toFixed(2)
  }

    properties = {
      ...properties , estateRentSummary : estateRentSummary
    }

    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.tabSection",
        "props.tabs",
        (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment
      )
    )

    /* based on selected category toggle display of sub-category field */
    dispatch(
      handleField(
        "search-preview",
        `components.div.children.propertyReviewDetails.children.cardContent.children.reviewPropertyDetails.children.cardContent.children.viewFour.children.subCategory`,
        "visible",
        !!(category == "CAT.RESIDENTIAL" || category == "CAT.COMMERCIAL")
      )
    );
  
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.propertyReviewDetails.children.cardContent.children.reviewPropertyDetails.children.cardContent.children.viewFour.children.entityType",
        "visible",
        propertyRegisteredTo == "ENTITY"
      )
    )

    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      prepareFinalObject(
        "PropertiesTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      payload,
      "Properties[0].propertyDetails.applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
    await searchResults(action, state, dispatch, fileNumber);
  }
}

export const onTabChange = async(tabIndex, dispatch, state) => {
  let branchType = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0].propertyDetails.branchType",
    ""
  );
  fileNumber = getQueryArg(window.location.href, "fileNumber");

  isPropertyMasterOrAllotmentOfSite = get(
    state.screenConfiguration.preparedFinalObject,
    "Properties[0].propertyMasterOrAllotmentOfSite",
    ""
  );
  
  let path = "";
  if (branchType == "BUILDING_BRANCH") {
    if (tabIndex === 0) {
      path = `/estate/search-preview-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}`;
    }
    else if (tabIndex === 1) {
      path = `/estate/owner-details-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 2) {
      path = `/estate/document-details-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
  }
  else if (branchType == "MANI_MAJRA") {
    if (tabIndex === 0) {
      path = `/estate/search-preview-manimajra?fileNumber=${fileNumber}&tenantId=${tenantId}`;
    }
    else if (tabIndex === 1) {
      path = `/estate/owner-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 2) {
      path = `/estate/document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 3) {
      path = `/estate/purchaser-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 4) {
      path = `/estate/previous-owner-document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 5) {
      path = `/estate/payment-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
    else if (tabIndex === 6) {
      path = `/estate/court-case?fileNumber=${fileNumber}&tenantId=${tenantId}`
    }
  }
  else {
    if (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") {
      if (tabIndex === 0) {
        path = `/estate/search-preview?fileNumber=${fileNumber}&tenantId=${tenantId}`;
      }
      else if (tabIndex === 1) {
        path = `/estate/auction-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 2) {
        path = `/estate/owner-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 3) {
        path = `/estate/document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 4) {
        path = `/estate/purchaser-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 5) {
        path = `/estate/previous-owner-document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 6) {
        path = `/estate/consolidatedPaymentDetails?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 7) {
        path = `/estate/rent-information?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 8) {
        path = `/estate/notices?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 9) {
        path = `/estate/court-case?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 10) {
        path = `/estate/dues-summary?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
    }
    else {
      if (tabIndex === 0) {
        path = `/estate/search-preview?fileNumber=${fileNumber}&tenantId=${tenantId}`;
      }
      else if (tabIndex === 1) {
        path = `/estate/auction-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 2) {
        path = `/estate/owner-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 3) {
        path = `/estate/document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 4) {
        path = `/estate/rent-information?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 5) {
        path = `/estate/notices?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 6) {
        path = `/estate/court-case?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
      else if (tabIndex === 7) {
        path = `/estate/dues-summary?fileNumber=${fileNumber}&tenantId=${tenantId}`
      }
    }
  }
  return dispatch(setRoute(path));
}


export const tabs = [
  {
    tabButton: { labelName: "Property Details", labelKey: "ES_PROPERTY_DETAILS" }
  },
  {
    tabButton: { labelName: "Auction Details", labelKey: "ES_AUCTION_DETAILS" }
  },
  {
    tabButton: { labelName: "Entity/Owner Details", labelKey: "ES_ENTITY_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Entity/Owner Documents", labelKey: "ES_ENTITY_OWNER_DOCUMENTS" }
  },
  {
    tabButton: { labelName: "Previous Owner Details", labelKey: "ES_PREVIOUS_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Previous Owner Documents", labelKey: "ES_PREVIOUS_OWNER_DOCUMENTS" }
  },
  {
    tabButton: { labelName: "Consoliated Payment Details", labelKey: "ES_CONSOLIDATED_PAYMENT_DETAILS" }
  },
  {
    tabButton: { labelName: "Rent Information", labelKey: "ES_RENT_INFORMATION" }
  },
  {
    tabButton: { labelName: "Notices", labelKey: "ES_NOTICES" }
  },
  {
    tabButton: { labelName: "Court Case", labelKey: "ES_COURT_CASE" }
  },
  {
    tabButton: { labelName: "Dues Summary", labelKey: "ES_DUES_SUMMARY" }
  }
]
export const tabsAllotment = [
  {
    tabButton: { labelName: "Property Details", labelKey: "ES_PROPERTY_DETAILS" }
  },
  {
    tabButton: { labelName: "Auction Details", labelKey: "ES_AUCTION_DETAILS" }
  },
  {
    tabButton: { labelName: "Entity/Owner Details", labelKey: "ES_ENTITY_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Entity/Owner Documents", labelKey: "ES_ENTITY_OWNER_DOCUMENTS" }
  },
  {
    tabButton: { labelName: "Rent Information", labelKey: "ES_RENT_INFORMATION" }
  },
  {
    tabButton: { labelName: "Notices", labelKey: "ES_NOTICES" }
  },
  {
    tabButton: { labelName: "Court Case", labelKey: "ES_COURT_CASE" }
  },
  {
    tabButton: { labelName: "Dues Summary", labelKey: "ES_DUES_SUMMARY" }
  }
]

const estateDetailPreview = {
  uiFramework: "material-ui",
  name: "court-case",
  beforeInitScreen: (action, state, dispatch) => {
    fileNumber = getQueryArg(window.location.href, "fileNumber");
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
            /* cancellationOfSiteButton: {
              componentPath: "Button",
              visible: false,
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              props: {
                variant: "contained",
                style: {
                  color: "white",
                  backgroundColor: "#fe7a51",
                  borderColor: "#fe7a51",
                  borderRadius: "2px",
                  width: "50%",
                  height: "48px",
                  margin: "-10px 0px 10px"
                }
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Cancellation of Site",
                  labelKey: "ES_CANCELLATION_OF_SITE_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  cancellationOfSite();
                }
              }
            } */
          }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs: tabs,
              activeIndex: 0,
              onTabChange
            },
            type: "array",
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "WorkFlowContainer",
            props: {
              dataPath: "Properties",
              moduleName: WF_ALLOTMENT_OF_SITE,
              updateUrl: "/est-services/property-master/_update",
              style: {
                wordBreak: "break-word"
              }
            }
          },
        propertyReviewDetails
      }
    }
  }
};

/* const cancellationOfSite = () => {
  console.log("Cancellation of Site");
} */
export default estateDetailPreview;