import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, setapplicationNumber, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { furnishServiceRequestDetailResponse, getSearchResultsView, setApplicationNumberBox, commonConfig } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails } from "../utils";
import { addressdetails } from './serviceRequestDetails/addressdetails';
import { footerEdit } from "./serviceRequestDetails/footerEdit";
// import { ownerdetails } from './serviceRequestDetails/ownerdetails';
import { ownerdetailsEdit } from './serviceRequestDetails/ownerdetailsEdit';
import { servicerequestdetailsEdit } from './serviceRequestDetails/servicerequestdetailsEdit';
import { uploadimage } from './serviceRequestDetails/uploadimage';


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Service Request`, 
    labelKey: "HC_SERVICE_REQUEST_HEADER"
  }),
  
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardImageStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    uploadimage
  }
};

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    servicerequestdetailsEdit
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    ownerdetailsEdit
  }
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    addressdetails
  }
};


 const getProcessInstanceDataForServiceRequest = async (applicationNumber, state, dispatch)=>  {

    var tenantIdCommonConfig
    
      if (getTenantId() != commonConfig.tenantId){
          tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
      }
      else{
        tenantIdCommonConfig = getTenantId()
      }
    const queryObj = [
      {
        key: "businessIds",
        value: applicationNumber
      },
      {
        key: "tenantId",
        value: tenantIdCommonConfig
      },
      {
        key: "history",
        value: true
      },
    ];
    var payload = await httpRequest(
      "post",
      "/egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObj
    );
      //sorting process instance data by time
    var SortedProcessInstanceBylastModifiedTimeOfEachObject = []
    
    SortedProcessInstanceBylastModifiedTimeOfEachObject=
      payload &&
      payload.ProcessInstances.sort(function(a, b) {
        var valueA, valueB;        

        valueA = a.auditDetails.lastModifiedTime; 
        valueB = b.auditDetails.lastModifiedTime;
        if (valueA < valueB) {
            return -1;
        }
        else if (valueA > valueB) {
            return 1;
        }
        return 0;
    })
    SortedProcessInstanceBylastModifiedTimeOfEachObject = SortedProcessInstanceBylastModifiedTimeOfEachObject.reverse()
    dispatch(prepareFinalObject("workflow", SortedProcessInstanceBylastModifiedTimeOfEachObject));
  //  return SortedProcessInstanceBylastModifiedTimeOfEachObject
  }
const getMdmsData = async ( state, dispatch) => {

  let tenantId = getTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
            {
              name: "ServiceType"
            }
          ]
        },
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "Sector"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};



export const prepareEditFlow = async (state, dispatch, applicationNumber, tenantId) => {
  

  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "serviceRequestId", value: applicationNumber }
    ]);
    
    let Refurbishresponse = furnishServiceRequestDetailResponse(state,response, dispatch);
    // let RefurbishresponseOnFail = furnishServiceRequestDetailResponse(response);
    dispatch(prepareFinalObject("SERVICEREQUEST", Refurbishresponse));
    // dispatch(prepareFinalObject("SERVICEREQUESTONFAIL", RefurbishresponseOnFail));
    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }

    
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    set(state, "form.newapplication.files.media", []);
    getMdmsData(state, dispatch)
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('HORTICULTURE');
    const tenantId = getQueryArg(window.location.href, "tenantId");
    set(state, "screenConfiguration.moduleName", "hc");
    getProcessInstanceDataForServiceRequest(applicationNumber, state, dispatch)
    
    prepareEditFlow(state, dispatch, applicationNumber, tenantId);
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 18,
                sm: 20
              },
              ...header
            }
          }
        },
        
        formwizardImageStep,
        formwizardFirstStep,
        formwizardSecondStep,
        
        footerEdit
      }
    }
  }
};
export default screenConfig;
