import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 // import { getTodaysDateInYMD } from "../../utils";
 import set from "lodash/set";
 import get from "lodash/get";
 import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import{getMaterialBalanceRateResults} from '../../../../../ui-utils/storecommonsapi'
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import {  handleScreenConfigurationFieldChange as handleField, prepareFinalObject  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 import { httpRequest } from "../../../../../ui-utils/api";
 import { getSTOREPattern} from "../../../../../ui-utils/commons";
 import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
 let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
 let disabled = false
 if(applicationNumber)
 disabled = true

 const getMaterialData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId(),
    },
  ];
  let storecode = get(state,"screenConfiguration.preparedFinalObject.materialIssues[0].fromStore.code",'')
  queryObject.push({
    key: "issueingStore",
    value: storecode
  });

  //get Material based on Indent
  let material =[]
  let  indents =  get(
    state.screenConfiguration.preparedFinalObject,
    `indents`,
    []
  );
  //indents = get(indents,'indents');
  if(indents && indents[0])
  {
  let indentDetails = get(
    indents[0],
    `indentDetails`,
    []
  );
  for (let index = 0; index < indentDetails.length; index++) {
    const element = indentDetails[index];
    material.push( element.material.code)
    
  }
  let matcodes= material.map(itm => {
                return `${itm}`;
              })
              .join() || "-"
 // dispatch(prepareFinalObject("indentsmaterial",material));
  queryObject.push({
    key: "material",
    value: matcodes
  });
console.log(matcodes)
    
  try {
    let response = await getMaterialBalanceRateResults(queryObject, dispatch);

    dispatch(prepareFinalObject("indentsmaterial", response.MaterialBalanceRate));
    let stores = get(state,"screenConfiguration.preparedFinalObject.store.stores",[])
   stores = stores.filter(x=>x.code === storecode)
   //set materialIssues[0].issuedToEmployee
  // const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "code", value: stores[0].storeInCharge.code },{ key: "tenantId", value:  getTenantId() }];
   const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
   const payload = await httpRequest(
     "post",
     "/egov-hrms/employees/_search",
     "_search",
     queryParams,
   );
  
   
   //alert(stores[0].storeInCharge.code)
   if(payload){
     if (payload.Employees) {
       const {screenConfiguration} = state;
        // const {stores} = screenConfiguration.preparedFinalObject;
        const {designationsById} = state.common;
        const empdesignation = payload.Employees[0].assignments[0].designation;
       const empDetails = 
       payload.Employees.filter((item, index) =>  stores[0].storeInCharge.code === item.code);
     
       if(empDetails && empDetails[0] ){
         //alert(empDetails[0].user.name)        
         dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",empDetails[0].user.name));  
         if(designationsById){
          const desgnName = Object.values(designationsById).filter(item =>  item.code === empdesignation )
          dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", desgnName[0].name));
          }
       }
       else{
        dispatch(prepareFinalObject("materialIssues[0].issuedToEmployee",""));  
        dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", ''));
       }
     }
   }
  } catch (e) {
    console.log(e);
  }
}
};
  export const IndentMaterialIssueDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Indent Material Issue",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    IndentMaterialIssueContainer: getCommonContainer({
      indentNumber: {
        ...getTextField({
          label: {
            labelName: "Indent No.",
            labelKey: "STORE_PURCHASE_ORDER_INDENT_NO"
          },
          placeholder: {
            labelName: "Enter Indent No.",
            labelKey: "STORE_PURCHASE_ORDER_INDENT_NO_PLACEHOLDER"
          },
          props: {
            disabled: true,       
          },
          jsonPath: "materialIssues[0].indent.indentNumber"
        })
      },
      indentDate: {
        ...getDateField({
          label: {
            labelName: "Indent Date",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
          },
          placeholder: {
            labelName: "Indent Date",
            labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
          },
          pattern: getPattern("Date"),
          jsonPath: "materialIssues[0].indent.indentDate",
          props: {
            disabled:true,
            inputProps: {
              max: new Date().toISOString().slice(0, 10),
            }
          }
        }),
      }, 
      IssueStoreName: {
        ...getSelectField({
          label: {
            labelName: "Issuing Store Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME"
          },
          placeholder: {
            labelName: "Select Issuing Store Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME_SELECT"
          },
          required: true,
          errorMessage: "STORE_VALIDATION_ISSUE_STORE_NAME_SELECT",
          jsonPath: "materialIssues[0].fromStore.code",
          sourceJsonPath: "store.stores",
            props: {
              optionValue: "code",
              optionLabel: "name",
              disabled: disabled, 
            },
           
        }),
        beforeFieldChange: (action, state, dispatch) => {
          //alert(action.value)
          let id = get(
            state.screenConfiguration.preparedFinalObject,
            "materialIssues[0].id",
            null
          );
          // if (!id) {
          // dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails",[]));
          // }
          let store = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
          let fromstore = store.filter(x=> x.code === action.value)
          let toStore = get(state, "screenConfiguration.preparedFinalObject.materialIssues[0].toStore.code",'') 
          // if(action.value !== toStore)
          // {
            if(fromstore&&fromstore[0])
            {
                dispatch(prepareFinalObject("materialIssues[0].fromStore.id",fromstore[0].id));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.code",fromstore[0].code));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.name",fromstore[0].name));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.description",fromstore[0].description));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.billingAddress",fromstore[0].billingAddress));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.department",fromstore[0].department));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.divisionName", fromstore[0].divisionName));              
                //dispatch(prepareFinalObject("materialIssues[0].fromStore.department.name",fromstore[0].department));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.deliveryAddress",fromstore[0].deliveryAddress));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.storeInCharge.code",fromstore[0].storeInCharge.code));
                dispatch(prepareFinalObject("materialIssues[0].fromStore.tenantId",getTenantId())); 
                const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
                if(!applicationNumber)        
                getMaterialData(action,state,dispatch)               
            }
          // }
          // else{
           
          // }
          
        }
      },
      IndentingStore: {
        ...getTextField({
          label: { labelName: "Indenting Store", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE" },
          placeholder: {
            labelName: "Indenting Store",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE"
          },
          props: {
            disabled: true,       
          },
          required: false,
          jsonPath: "materialIssues[0].toStore.name",
          
        })
      },
      divisionName: getTextField({
        label: {
          labelName: "Issuing Store Division Name",
          labelKey: "STORE_DETAILS_ISSUING_STORE_DIVISION_NAME",
        },
        props: {
          className: "applicant-details-error",
          disabled: true
        },
        placeholder: {
          labelName: "Enter Issuing Store Division Name",
          labelKey: "STORE_DETAILS_ISSUING_STORE_DIVISION_NAME_PLACEHOLDER",
        },
        pattern: getPattern("non-empty-alpha-numeric"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "materialIssues[0].fromStore.divisionName",
      }),
  

      IndentingDetpName: {
        ...getTextField({
          label: {
            labelName: "Issuing Dept. Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_DEP_NAME"
          },
          placeholder: {
            labelName: "Enter Issuing Dept. Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_DEP_NAME_PLACEHOLDER"
          },
          props: {
            disabled: true,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialIssues[0].fromStore.department.name"
        })
      },
      issuedToEmployee: {
        ...getTextField({
          label: {
            labelName: "Issued to Employee",
            labelKey: "STORE_MTON_ISSUED_TO_EMP"
          },
          placeholder: {
            labelName: "Issued to Employee",
            labelKey: "STORE_MTON_ISSUED_TO_EMP"
          },
          props: {
            disabled: true,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialIssues[0].issuedToEmployee"
        })
      },
      issuedToDesignation: {
        ...getTextField({
          label: {
            labelName: "Issued to Employee Degignation",
            labelKey: "STORE_MTON_ISSUED_TO_EMP_DEGIGNATION"
          },
          placeholder: {
            labelName: "Issued to Employee Degignation",
            labelKey: "STORE_MTON_ISSUED_TO_EMP_DEGIGNATION"
          },
          props: {
            disabled: true,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialIssues[0].issuedToDesignation"
        })
      },
      IssueDate: {
        ...getDateField({
          label: {
            labelName: "Issue Date",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE"
          },
          placeholder: {
            labelName: "Enter Issue Date",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_PLACEHOLDER"
          },
          required: true,
          props:{
            disabled: disabled, 
          },
          errorMessage: "STORE_VALIDATION_ISSUE_DATE_SELECT",
          pattern: getPattern("Date") ,
          jsonPath: "materialIssues[0].issueDate",
          // props: {           
          //   inputProps: {
          //     max: new Date().toISOString().slice(0, 10),
          //   }
          // }
        })
      },
      createdBy: {
        ...getTextField({
          label: {
            labelName: "Issued By Employee",
            labelKey: "STORE_CREATEBY_MR_ISSUE"
          },
          placeholder: {
            labelName: "Enter Issued By Employee",
            labelKey: "STORE_CREATEBY_MR_ISSUE"
          },
          props: {
            disabled: true
          },
         // pattern: getPattern("Email"),
          jsonPath: "materialIssues[0].createdByName"
        })
      },
      designation: {
        ...getTextField({
          label: {
            labelName: "Issued By Employee Designation",
            labelKey: "STORE_DSGNTN_MR_ISSUE"
          },
          placeholder: {
            labelName: "Enter Issued By Employee Designation",
            labelKey: "STORE_DSGNTN_MR_ISSUE"
          },
          props: {
            disabled: true
          },
         // pattern: getPattern("Email"),
          jsonPath: "materialIssues[0].designation"
        })
      },
      // IssueToEmployee: {
      //   ...getTextField({
      //     label: {
      //       labelName: "Issue To Employee",
      //       labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_TO_EMPLOYEE"
      //     },
      //     placeholder: {
      //       labelName: "Select Issue To Employee",
      //       labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_TO_EMPLOYEE"
      //     },         
      //     required: false,
      //     jsonPath: "materialIssues[0].issuedToEmployee",         
      //     props: {
      //       disabled: true,       
      //     },
      //   })
      // },
      // issuedToDesignation: {
      //   ...getTextField({
      //     label: { labelName: "Designation", labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION" },
      //     placeholder: {
      //       labelName: "Enter Designation",
      //       labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION_PLACEHOLDER"
      //     },
      //     required: false,
      //     jsonPath: "materialIssues[0].issuedToDesignation",
          
      //     props: {
      //       disabled: true,       
      //     },
      //   })
      // },
      Remark: {
        ...getTextField({
          label: {
            labelName: "Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
          },
          placeholder: {
            labelName: "Enter Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          required: true,
          errorMessage: "STORE_VALIDATION_REMARK",
          pattern: getSTOREPattern("Comment"),
          jsonPath: "materialIssues[0].description"
        })
      },
      IssueBy: {
        ...getTextField({
          label: {
            labelName: "Issue By",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_BY"
          },
          placeholder: {
            labelName: "Issue By",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_BY"
          },
          props: {
            disabled: true,       
          },
          required: false,
          visible:false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialIssues[0].IssueBy"
        })
      },
      DesignationIssueBy: {
        ...getTextField({
          label: { labelName: "Designation", labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION" },
          placeholder: {
            labelName: "Designation",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION"
          },
          required: false,
          visible:false,
          jsonPath: "materialIssues[0].DesignationIssueBy",           
           props: {
            disabled: true,       
          },
        })
      },
      Status: {
        ...getTextField({
          label: {
            labelName: "Status",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS"
          },
          placeholder: {
            labelName: "Status",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS"
          },
          props: {
            disabled: true,       
          },
          required: false,
          pattern: getPattern("Name") || null,
          jsonPath: "materialIssues[0].materialIssueStatus"
        })
      },
    })
  });