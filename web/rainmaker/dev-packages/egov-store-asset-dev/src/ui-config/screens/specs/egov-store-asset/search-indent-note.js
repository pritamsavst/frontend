import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest,getsto } from "../../../../ui-utils";
  import { getstoreTenantId,getStoresSearchResults } from "../../../../ui-utils/storecommonsapi";
  import { searchForm } from "./searchindentnoteResource/searchForm";
  import { searchResults } from "./searchindentnoteResource/searchResults";
  import { getTenantId , getOPMSTenantId} from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Indent Material Issue Note",
    labelKey: "STORE_COMMON_CREATE_INDENT_MATERIAL_ISSUE_NOTE",
  });
  
  const createMaterialIndentHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/creatindent`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {
    const tenantId = getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" },
              { name: "InventoryType"},
              { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
            ],
          },
         
          {
            moduleName: "tenant",
            masterDetails: [{ name: "tenants" }],
          },
        ],
      },
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const getcreatorList = async (action, state, dispatch) => {
    const tenantId = getTenantId();  
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
  
    try {
     let response = await getSearchResults(queryObject, dispatch,"creatorList");

      if(response)
      {
        let payloadprocess = [];
    for (let index = 0; index < response.users.length; index++) {
      const element = response.users[index];
      let pay = {
        element: element
      }
      payloadprocess.push(pay);
    }
    dispatch(prepareFinalObject("applyScreenMdmsData.creatorList", payloadprocess));
      }
      
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
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
   // await getstoreData(action,state, dispatch);
   await getcreatorList(action, state, dispatch)
  };
  
  const materialMasterSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-indent-note",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
      const storedata = getstoreData(action,state, dispatch);
      //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6,
                },
                ...header,
              },
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right",
                },
                visible: false,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px",
                  },
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Add Material Indent",
                    labelKey: "STORE_MATERIAL_INDENT_NOTE_ADD_MATERIAL_INDENT",//
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: createMaterialIndentHandle,
                },
              },
            },
          },
          searchForm,
          breakAfterSearch: getBreak(),
          searchResults,
        },
      },
    },
  };
  
  export default materialMasterSearchAndResult;
  