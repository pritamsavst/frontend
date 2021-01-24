import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";  
  import { footer } from "./creatematerialReceiptNoteotherResource/footer";
  import { getstoreTenantId,getStoresSearchResults, } from "../../../../ui-utils/storecommonsapi";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { materialReceiptDetail } from "./creatematerialReceiptNoteotherResource/Material-receipt-details"; 
  import { MaterialReceiptNote } from "./creatematerialReceiptNoteotherResource/Material-receipt-note"; 
  import { otherDetails } from "./creatematerialReceiptNoteotherResource/other-details";
  import { documentDetails } from "./creatematerialReceiptNoteotherResource/documentDetails";
  import {totalValue} from './creatematerialReceiptNoteotherResource/totalValue';
  import set from "lodash/set";
  import get from "lodash/get";
  import map from "lodash/map";
  import { httpRequest } from "../../../../ui-utils";
  import { commonTransform, objectArrayToDropdown } from "../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  //import { getEmployeeData } from "./viewResource/functions";
  import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import {
    IndentConfiguration
  } from "../../../../ui-utils/sampleResponses";
  import {
    prepareDocumentsUploadData,
    
  } from "../../../../ui-utils/storecommonsapi";
  let MrnNumber="";
  MrnNumber = getQueryArg(window.location.href, "MrnNumber");
  export const stepsData = [
    { labelName: "Material Receipt Note", labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_NOTE" },
    {
      labelName: "Material Receipt Details",
      labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_DETAILS"
    },
    // { labelName: "Approval Informtion", labelKey: "STORE_MATERIAL_INDENT_NOTE_APPROVAL_INFORMTION" },
    
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );

  
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Material Receipt Note `,
      labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_NOTE"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      MaterialReceiptNote
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      documentDetails,
      materialReceiptDetail,
      totalValue
    },
    visible: false
  };
  
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
        otherDetails
    },
    visible: false
  };
 
  
  const getMdmsData = async (state, dispatch, tenantId) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material", },
              { name: "InventoryType", },
              { name: "MaterialType", filter: "[?(@.active == true)]"},
            ],
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "UOM",
                filter: "[?(@.active == true)]"
              },
              
            ]
          },
          {
            moduleName: "ACCESSCONTROL-ROLES",
            masterDetails: [
              {
                name: "roles",
                filter: "$.[?(@.code!='CITIZEN')]"
              }
            ]
          },
          {
            moduleName: "egov-location",
            masterDetails: [
              {
                name: "TenantBoundary"
                // filter: "$.*.hierarchyType"
              }
            ]
          },
         
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      // document type 
      //let title =
      let id = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].id",
        null
      );
      let fileUrl =''

      const step = getQueryArg(window.location.href, "step");
      const mrnNumber = getQueryArg(window.location.href, "mrnNumber");
      if(!step && !mrnNumber){
       fileUrl ='';
       //documentsUploadRedux
       dispatch(
        prepareFinalObject("documentsUploadRedux[0].documents", null)
        );
     }
     else{
      fileUrl =
      get(state, "screenConfiguration.preparedFinalObject.documentsPreview[0].link",'')

     }      
     let  DocumentType_PriceList= [
      {
          code: "STORE_DOCUMENT_TYPE_MATERIAL_RECEIPT_NOTE",
          isMandatory: true, 
          required:true,
          url: fileUrl,  
          documentType:"STORE_DOCUMENT_TYPE_MATERIAL_RECEIPT_NOTE"  ,         
          active: true
      },]
      dispatch(
        prepareFinalObject("DocumentType_MaterialReceipt", DocumentType_PriceList)
      );
    
      dispatch(
        prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
      );
     
      prepareDocumentsUploadData(state, dispatch, 'materialReceipt');
      setRolesList(state, dispatch);
      setHierarchyList(state, dispatch);
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getStoresSearchResults(queryObject, dispatch);
      dispatch(prepareFinalObject("store", response));
      // fetching employee designation
      const userInfo = JSON.parse(getUserInfo());
      if(userInfo){
        dispatch(prepareFinalObject("materialReceipt[0].createdByName", userInfo.name));
        const queryParams = [{ key: "codes", value: userInfo.userName },{ key: "tenantId", value:  getTenantId() }];
        try { 
          const payload = await httpRequest(
            "post",
            "/egov-hrms/employees/_search",
            "_search",
            queryParams
          );
          if(payload){
            const {designationsById} = state.common;
            const empdesignation = payload.Employees[0].assignments[0].designation;
            if(designationsById){
            const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
            
            dispatch(prepareFinalObject("materialReceipt[0].designation", desgnName[0].name));
            }
          }
          
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getSupllierData = async (  action, state,dispatch,)=>{
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getSearchResults(queryObject, dispatch,"supplier");
      dispatch(prepareFinalObject("supplier", response));
    } catch (e) {
      console.log(e);
    }
  }
  const getEmployeeData = async (action, state, dispatch) => {
    //fecthing employee details 
    const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryParams,
    );
    if(payload){
      if (payload.Employees) {
        const empDetails =
        payload.Employees.map((item, index) => {
            const deptCode = item.assignments[0] && item.assignments[0].department;
            const designation =   item.assignments[0] && item.assignments[0].designation;
            const empCode = item.code;
            const empName = `${item.user.name}`;
          return {
                  code : empCode,
                  name : empName,
                  dept : deptCode,
                  designation:designation,
          };
        });
      
        if(empDetails){
          dispatch(prepareFinalObject("createScreenMdmsData.employee",empDetails));  
        }
        
      }
    }

  }
  const getYearsList = (startYear, state, dispatch) => {
    var currentYear = new Date().getFullYear(),
      years = [];
    startYear = startYear || 1980;
  
    while (startYear <= currentYear) {
      years.push({ value: (startYear++).toString() });
    }
  
    dispatch(prepareFinalObject("yearsList", years));
  };
  
  const setRolesList = (state, dispatch) => {
    let rolesList = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.ACCESSCONTROL-ROLES.roles`,
      []
    );
    let furnishedRolesList = rolesList.filter(item => {
      return item.code;
    });
    dispatch(
      prepareFinalObject(
        "createScreenMdmsData.furnishedRolesList",
        furnishedRolesList
      )
    );
  };
  
  const setHierarchyList = (state, dispatch) => {
    let tenantBoundary = get(
      state.screenConfiguration.preparedFinalObject,
      `createScreenMdmsData.egov-location.TenantBoundary`,
      []
    );
    let hierarchyList = map(tenantBoundary, "hierarchyType", []);
    dispatch(
      prepareFinalObject("createScreenMdmsData.hierarchyList", hierarchyList)
    );
  };
  
  const freezeEmployedStatus = (state, dispatch) => {
    let employeeStatus = get(
      state.screenConfiguration.preparedFinalObject,
      "Employee[0].employeeStatus"
    );
    if (!employeeStatus) {
      dispatch(prepareFinalObject("Employee[0].employeeStatus", "EMPLOYED"));
    }
  };
  const getData = async (action, state, dispatch) => {
    
    await getEmployeeData(action, state, dispatch);
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "createMaterialReceiptNoteother",
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
      const tenantId = getstoreTenantId();
      const mdmsDataStatus = getMdmsData(state, dispatch, tenantId);
      const storedata = getstoreData(action,state, dispatch);
      const SupllierData = getSupllierData(action,state, dispatch);
      const step = getQueryArg(window.location.href, "step");
      const mrnNumber = getQueryArg(window.location.href, "mrnNumber");
      if(!step && !mrnNumber){
       dispatch(prepareFinalObject("materialReceipt[0]",null));
     }
     // SEt Default data

     dispatch(
      prepareFinalObject(
        "materialReceipt[0].receiptType",
        "PURCHASE RECEIPT",
      )
    );
   
    dispatch(
      prepareFinalObject(
        "materialReceipt[0].receivedBy",
        "sanjeev",
      )
    );
    dispatch(
      prepareFinalObject(
        "materialReceipt[0].inspectedBy",
        "Ramesh",
      )
    );

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
                  xs: 12,
                  sm: 10
                },
                ...header
              }
            }
          },
          stepper,
          formwizardFirstStep,
          formwizardSecondStep,
          formwizardThirdStep,
         
          footer
        }
      }
      // breakUpDialog: {
      //   uiFramework: "custom-containers-local",
      //   componentPath: "ViewBreakupContainer",
      //   props: {
      //     open: false,
      //     maxWidth: "md",
      //     screenKey: "apply"
      //   }
      // }
    }
  };
  
  export default screenConfig;
  



