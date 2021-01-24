import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer,
    getCommonParagraph,
    getLabelWithValue,
    getCommonTitle,
    getDateField,
    getLabel,
    getPattern,
    getSelectField,
    getTextField,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  //import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getSearchPensioner,getPMSPattern } from "../../../../ui-utils/commons";
  import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  //import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    getTenantId
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {  
    DashbordData
    } from "../utils/sampleResponses";
    import { httpRequest } from "../../../../ui-utils";
   // import { getSearchResults } from "../../../../ui-utils/commons"; 
    const resetFields = (state, dispatch) => {
      const textFields = ["minDeptCode",];
      for (let i = 0; i < textFields.length; i++) {
        if (
          `state.screenConfiguration.screenConfig.dashboardPT.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
        ) {
          dispatch(
            handleField(
              "dashboardPT",
              `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}`,
              "props.value",
              ""
            )
          );
        }
      }
      dispatch(prepareFinalObject("searchScreen", {}));
    }; 
  const ActionSubmit = async (state, dispatch) => {
    let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    }
   
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  if( Object.keys(searchScreenObject).length == 0 )
  {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ALL_FIELDS"
        },
        "warning"
      )
    );
  }
  else
  {
  
  for (var key in searchScreenObject) {  
    
    queryObject.push({ key: key, value: (searchScreenObject[key]) });
  }
  
  queryObject.push({
    key: "isprint",
    value: false
  });
  
  try {
    let payload =[];
  
   let Responce = await httpRequest(
      "post",
      "store-asset-services/openingbalance/_report",
      "_report",    
      queryObject
    );
  
  // payload = InventoryData()
  // dispatch(prepareFinalObject("InventoryData", payload));
  if(get(Responce,"records",[]))
  dispatch(prepareFinalObject("APIData", get(Responce,"records",[])));
  else
  {
   let  APIData =[] 
   dispatch(prepareFinalObject("APIData",DashbordData()));
  }
    console.log(payload)
  
  
    
  
  
  return payload
  
  } catch (e) {
    console.log(e);
  }
  }
  
  
  }
  
  export const getData = async (action, state, dispatch) => {
   
    await getMdmsData(state, dispatch);
    
     //fetching store name
     const queryObject = [{ key: "tenantId", value: getTenantId()  }];
    //  getSearchResults(queryObject, dispatch,"storeMaster")
    //  .then(response =>{
    //    if(response){
    //      const storeNames = response.stores.map(item => {
    //        let code = item.code;
    //        let name = item.name;
    //        let department = item.department.name;
    //        let divisionName = item.divisionName;
    //        return{code,name,department,divisionName}
    //      } )
    //      dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
    //    }
    //  });
  };
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "egf-master",
            masterDetails: [{ name: "FinancialYear" }]
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
      dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "MdmsRes"))
      );
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  const header = getCommonHeader({
    labelName: "RTI Data",
    labelKey: "RTI_DATA_HEADER"
  });
  const RegisterReviewResult = {
    uiFramework: "material-ui",
    name: "dashboard",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();   
      dispatch(prepareFinalObject("searchScreen",{}));
      // getData(action, state, dispatch).then(responseAction => {
      
      // }); 
         //get Eployee details data       
  // prepareEditFlow(state, dispatch,  tenantId).then(res=>
  //   {
  //   }
  // );
  let  APIData =[] 
  dispatch(prepareFinalObject("APIData",DashbordData()));
  //dispatch(prepareFinalObject("APIData",APIData)); 
          return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "review"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                ...header
              },
              
            }
          },
   
      SearchCard: getCommonCard({
  
        appPRSearchContainer: getCommonContainer({
            datefrom: {
                ...getDateField({
                  label: { labelName: " Receipt Date", labelKey: "Date From" },
                  placeholder: {
                    labelName: "Enter Receipt Date",
                    labelKey: "Date From"
                  },
                  required: false,
                  jsonPath: "searchScreen.receiptDate",
                  pattern: getPattern("Date"),
                  gridDefination: {
                    xs: 12,
                    sm: 4,
                  },
                   
                })
              },
              dateto: {
                ...getDateField({
                  label: { labelName: " Receipt Date", labelKey: "Date To" },
                  placeholder: {
                    labelName: "Enter Receipt Date",
                    labelKey: "Date To"
                  },
                  required: false,
                  jsonPath: "searchScreen.receiptDate",
                  pattern: getPattern("Date"),
                  gridDefination: {
                    xs: 12,
                    sm: 4,
                  },
                   
                })
              },
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6,
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
              float: "right",
            },
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Reset",
              labelKey: "COMMON_RESET_BUTTON",
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
            sm: 6,
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
              labelKey: "COMMON_SEARCH_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: ActionSubmit,
          },
        },
      }),
    }),
  
      }),
   
    breakAfterSearch: getBreak(),
          Dashbord: {
            uiFramework: "custom-containers-local",        
            componentPath: "DashbordContainer",
            moduleName: "egov-common",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"RTI_PT",
  
              }
          },
  
       
         
        }
      },
      
    }
  };
  
  export default RegisterReviewResult;
  