
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg,   } from "egov-ui-framework/ui-utils/commons";
import {  getTenantId, getUserInfo,  } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";

import { httpRequest } from "./api";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const role_name = JSON.parse(getUserInfo()).roles[0].code
export const getstoreTenantId = () => {
  let gettenantId = getTenantId()
  gettenantId = gettenantId.split('.')  
  return gettenantId[0];
};
export const getMaterialMasterSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const createMaterial = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_create",
      "",
      queryObject,
      { materials: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateMaterial = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materials/_update",
      "",
      queryObject,
      { materials: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getStoresSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "store-asset-services/stores/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    store.dispatch(toggleSpinner());
    //throw error;
  }

};
// price List API 
export const getPriceListSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const createPriceList = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_create",
      "",
      queryObject,
      { pricelists: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const UpdatePriceList = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/pricelists/_update",
      "",
      queryObject,
      { priceLists: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
// Opening Balance API
// price List API 
export const getOpeningBalanceSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const createOpeningBalance = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_create",
      "",
      queryObject,
      { materialReceipt: payload,workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateOpeningBalance = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const prepareDocumentsUploadData = async (state, dispatch, type) => {
  let documents = '';
  if (type == "pricelist") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.DocumentType_PriceList",
      []
    );
  }
  else  if (type == "materialReceipt") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.DocumentType_MaterialReceipt",
      []
    );
  }

  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.store.Documents",
      []
    );
  }

  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["url"] = doc.url;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
 
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["url"] = doc.url;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));

};

export const getMaterialIndentSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const createMaterialIndent = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_create",
      "",
      queryObject,
      { indents: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateMaterialIndent = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/indents/_update",
      "",
      queryObject,
      { indents: payload }
    );
    return response;
  } catch (error) {
    console.log(error)
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const getmaterialissuesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};

export const getprintpdf = async (queryObject , api) => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      api,     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    store.dispatch(toggleSpinner());
   // throw error;
  }

};
export const getMaterialBalanceRateResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_balance",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    store.dispatch(toggleSpinner());
   // throw error;
  }

};
export const creatematerialissues = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_create",
      "",
      queryObject,
      { materialIssues: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatematerialissues = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_update",
      "",
      queryObject,
      { materialIssues: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getreceiptnotesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const creatreceiptnotes = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatereceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const getmiscellaneousreceiptnotesSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const creatmiscellaneousreceiptnotes = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_create",
      "",
      queryObject,
      { materialReceipt: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updatemiscellaneousreceiptnotes = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/miscellaneousreceiptnotes/_update",
      "",
      queryObject,
      { materialReceipt: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

//Non-Indent Material Issue Note
export const getNonIndentMaterialIssueSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const creatNonIndentMaterialIssue = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_create",
      "",
      queryObject,
      { materialIssues: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateNonIndentMaterialIssue = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-ni/_update",
      "",
      queryObject,
      { materialIssues: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};


export const GetMdmsNameBycode = (state, dispatch,jsonpath, code) => {
  //Material
  let Obj  = get(state, `screenConfiguration.preparedFinalObject.${jsonpath}`,[]) 
  let Name = code
  Obj = Obj.filter(x=>x.code === code)
  if(Obj &&Obj[0])
  Name = Obj[0].name
  return Name;
};

export const ValidateCard = (state,dispatch,cardJsonPath,pagename,jasonpath,value) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'') 
    
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code) 
    if(pagename ==='createMaterialIndentNote')  
    {
      let matcode = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${'material.code'}`,'')
      matcode = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",matcode) 
    // code =`${code}_${matcode}`;
    code = matcode;
    }     
    matcode.push(code)
    }
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardMultiItem = (state,dispatch,cardJsonPath,pagename,jasonpath,value, value1) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'')  
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let value1_ = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value1}`,'') 
    value1_ = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",value1_)      
    matcode.push(code+'_'+value1_)
    }
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
   // replace char
   if(duplicates.indexOf('_') !== -1)
   duplicates = duplicates.replace("_", ",");
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardMultiItemSupplier = (state,dispatch,cardJsonPath,pagename,jasonpath,value, value1) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'')  
    //code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
        
    matcode.push(code)
    }
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
   // replace char
   if(duplicates.indexOf('_') !== -1)
   duplicates = duplicates.replace("_", ",");
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:true
      }      
    )  
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsDuplicatItem:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardUserQty = (state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'') 
    if(pagename==='createopeningbalence')
    code = GetMdmsNameBycode(state, dispatch,"searchScreenMdmsData.store-asset.Material",code)  
    else
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let InputQtyValue_ = Number( get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0))
    let CompareQtyValue_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${CompareQtyValue}`,0)) 
    let balanceQuantity_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${balanceQuantity}`,0))
    if(doubleqtyCheck)
    {
     if(balanceQuantity_>CompareQtyValue_)
     {
      if(pagename ==='createMaterialIndentNote')
      {
        

        let IssueQty = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.issuedQuantity`,0))
        let poOrderedQuantity = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.poOrderedQuantity`,0))
        let applicationNumber =  getQueryArg(window.location.href, "applicationNumber");
        if(applicationNumber)
        {
          //if(InputQtyValue_<poOrderedQuantity)
          // if(InputQtyValue_<poOrderedQuantity)
          // poOrderedQuantity = poOrderedQuantity-InputQtyValue_
          // if(InputQtyValue_<=IssueQty)
          // {
          //   IssueQty = IssueQty-InputQtyValue_
          // }

        }
        if(!applicationNumber)
        CompareQtyValue_ = CompareQtyValue_ - (IssueQty+poOrderedQuantity);
        if(applicationNumber)
        {
          // if(InputQtyValue_<=IssueQty)
          // CompareQtyValue_ =CompareQtyValue_+IssueQty
          CompareQtyValue_ = CompareQtyValue_ - (poOrderedQuantity);
        }
        if(InputQtyValue_>CompareQtyValue_ || InputQtyValue_ === 0)  
        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:1
              }
            )
          }

        }     
        
      }
      else{
        if(pagename ==='create-material-transfer-outward')
        {
          
          let quantityIssued = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].quantityIssuedE`,0))
          console.log(quantityIssued);
          CompareQtyValue_ = CompareQtyValue_- quantityIssued
        }
        if(InputQtyValue_>CompareQtyValue_ || InputQtyValue_ === 0)       
        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:1
              }
            )
          }

        } 

      }
     
     }
     else if (balanceQuantity_<=CompareQtyValue_)
     {
      if(pagename ==='createMaterialIndentNote')
      {
        let applicationNumber =  getQueryArg(window.location.href, "applicationNumber");
        let IssueQty = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.issuedQuantity`,0))
        let poOrderedQuantity = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.poOrderedQuantity`,0))
        if(applicationNumber)
        {
          // if(IssueQty>InputQtyValue_)
          // {
          //   IssueQty = IssueQty-InputQtyValue_
          // }
          if(InputQtyValue_<IssueQty)
          {
            IssueQty = IssueQty-InputQtyValue_
          }
          // else if(IssueQty<InputQtyValue_)
          // {
          //   IssueQty = InputQtyValue_-IssueQty 
          // }
          // else
          // IssueQty = IssueQty-InputQtyValue_
        }
        balanceQuantity_ = balanceQuantity_// - (IssueQty+poOrderedQuantity);
        if(applicationNumber)
        {
         // balanceQuantity_ =balanceQuantity_+IssueQty
          // if(InputQtyValue_<IssueQty)
          // balanceQuantity_ =balanceQuantity_+IssueQty
        }
       
        if(InputQtyValue_>balanceQuantity_ || InputQtyValue_ === 0)  
        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:1
              }
            )
          }

        }     
        
      }
      else
      {
      if(InputQtyValue_>balanceQuantity_ || InputQtyValue_ === 0)       
      {
        if(InputQtyValue_ === 0)
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:0
            }
          )
        }
        else
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:1
            }
          )
        }

      } 
    }
     }

    }
    else{
      if(pagename ==='create-purchase-order')
      {
        let IssueQty = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].issuedQuantity`,0))
        let poOrderedQuantity = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].poOrderedQuantity`,0))
        let applicationNumber =  getQueryArg(window.location.href, "poNumber");
        if(applicationNumber)
        {
          // if(InputQtyValue_<=poOrderedQuantity)
          // poOrderedQuantity = poOrderedQuantity-InputQtyValue_
          // else if(InputQtyValue_=== poOrderedQuantity)
          // poOrderedQuantity = poOrderedQuantity-InputQtyValue_//-poOrderedQuantity)+poOrderedQuantity
          // else
          // poOrderedQuantity = poOrderedQuantity-InputQtyValue_
        }
        if(!applicationNumber)
        {
        CompareQtyValue_ = CompareQtyValue_ - (IssueQty+poOrderedQuantity);
        }
        if(applicationNumber)
        {
          // if(InputQtyValue_<=poOrderedQuantity)
          // CompareQtyValue_ =CompareQtyValue_+ poOrderedQuantity
          // else
          // CompareQtyValue_ =(CompareQtyValue_-IssueQty)
          CompareQtyValue_ = CompareQtyValue_ - (IssueQty);
        }
        if(InputQtyValue_>CompareQtyValue_ || InputQtyValue_ === 0)  

        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:1
              }
            )
          }

        } 

      }
     else if(pagename ==='createMaterialIndentNote')
      {
        let IssueQty = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.issuedQuantity`,0))
        let poOrderedQuantity = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].indentDetail.poOrderedQuantity`,0))
        let applicationNumber =  getQueryArg(window.location.href, "applicationNumber");
        if(applicationNumber)
        {
          if(IssueQty>InputQtyValue_)
          {
            IssueQty = IssueQty-InputQtyValue_
          }
          else if(IssueQty<InputQtyValue_)
          {
            IssueQty = InputQtyValue_-IssueQty 
          }
          else
          IssueQty = IssueQty-InputQtyValue_
        }
        CompareQtyValue_ = CompareQtyValue_ - (IssueQty+poOrderedQuantity);
        if(InputQtyValue_>CompareQtyValue_ || InputQtyValue_ === 0)  

        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:1
              }
            )
          }

        } 

      }
      else if(pagename ==='creatindent' || pagename ==='create-material-transfer-indent')
      {
        if(InputQtyValue_ === 0 )       
        matcode.push(
          {
            code:code,
            InputQtyValue:0
          }
        )
      }
      else{
        if(InputQtyValue_>CompareQtyValue_ || InputQtyValue_ === 0 )       
        {
          if(InputQtyValue_ === 0)
          {
            matcode.push(
              {
                code:code,
                InputQtyValue:0
              }
            )
          }
          else
          {
            let isAdHoc = get(
              state.screenConfiguration.preparedFinalObject,
              `materialReceipt[0].isAdHoc`,
              ''
            ); 
            if(pagename ==='createMaterialReceiptNoteMisc' && isAdHoc ==="YES" )
            {
              matcode.push(
                {
                  code:code,
                  InputQtyValue:1
                }
              )

            }
            else if(pagename ==='createMaterialReceiptNoteMisc' && isAdHoc ==="NO" )
            {
              matcode =[];
            }
            else
            {
              matcode.push(
                {
                  code:code,
                  InputQtyValue:1
                }
              )
            }
           
          }

        } 

      }
      
    }
    }
    
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name.code,
      Qty: name.InputQtyValue
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    a[b.Qty] = (a[b.Qty] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 0)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
   if(duplicates.toLowerCase().indexOf("0,") !== -1)
   {
    duplicates =duplicates.replace('0,','')
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false,
        IsZeroQty:true
      }      
    )
   }
   else
   {
    duplicates =duplicates.replace('1,','')
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:true,
        IsZeroQty:false
      }      
    )
   }
      
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false,
        IsZeroQty:false
      });

  }

  return DuplicatItem;
};
export const ValidateCardQty = (state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck,value2,InputQtyValue2) => {
  let  DuplicatItem =[];
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );
 let matcode =[];
 let PONumber =[];
  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {
    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'') 
    code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
    let InputQtyValue_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0))
    let InputQtyValue2_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue2}`,0))
    let CompareQtyValue_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${CompareQtyValue}`,0))
    let balanceQuantity_ = Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${balanceQuantity}`,0))
    if(doubleqtyCheck)
    {
     if(balanceQuantity_>CompareQtyValue_)
     {
      if(InputQtyValue_>CompareQtyValue_ ||InputQtyValue_ === 0)       
      {
        if(InputQtyValue_ === 0)
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:0
            }
          )
        }
        else
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:1
            }
          )
        }

      } 
     }
     else if (balanceQuantity_<=CompareQtyValue_)
     {
      if(InputQtyValue_>balanceQuantity_ || InputQtyValue_ === 0)       
      {
        if(InputQtyValue_ === 0)
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:0
            }
          )
        }
        else
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:1
            }
          )
        }

      } 
     }

    }
    else{
      if(InputQtyValue_>CompareQtyValue_ || InputQtyValue2_ > CompareQtyValue_ ||InputQtyValue_ === 0)       
      {
        if(InputQtyValue_ === 0)
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:0
            }
          )
        }
        else
        {
          matcode.push(
            {
              code:code,
              InputQtyValue:1
            }
          )
        }

      } 
    }
    }
    
  } 
  var uniq = matcode
  .map((name) => {
    return {
      count: 1,
      name: name.code,
      Qty: name.InputQtyValue
    }
  })
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    a[b.Qty] = (a[b.Qty] || 0) + b.count
    return a
  }, {})  
  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 0)
  if(duplicates.length>0)
  {
  duplicates= duplicates.map(itm => {
      return `${itm}`;
    })
    .join() || "-"
   // IsDuplicatItem = true;  
   if(duplicates.toLowerCase().indexOf("0,") !== -1)
   {
    duplicates =duplicates.replace('0,','')
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false,
        IsZeroQty:true
      }      
    )
   }
   else
   {
    duplicates =duplicates.replace('1,','')
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:true,
        IsZeroQty:false
      }      
    )
   } 
  } 
  else{
    DuplicatItem.push(
      {
        duplicates: duplicates,
        IsInvalidQty:false,
        IsZeroQty:false
      });

  }

  return DuplicatItem;
};

export const GetTotalQtyValue = (state,cardJsonPath,pagename,jasonpath,InputQtyValue,TotalValue,TotalQty) => {
  let  CardTotalQty =[];
  let InputQtyValue_ =0;
  let TotalValue_ = 0;
  let TotalQty_ = 0;
  let CardItem = get(
    state.screenConfiguration.screenConfig[`${pagename}`],
    cardJsonPath,
    []
  );

  for (let index = 0; index < CardItem.length; index++) {
    if(CardItem[index].isDeleted === undefined ||
    CardItem[index].isDeleted !== false)
    {   
     InputQtyValue_ = InputQtyValue_+Number( get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${InputQtyValue}`,0) )
    TotalValue_  = TotalValue_+ Number(get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${TotalValue}`,0) )
    TotalQty_ = TotalQty_ + Number( get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${TotalQty}`,0))
    }
  }
  //Material Indent Issue Note: For engineering Dept. 3% amount should be deducted from Total amount
  if(pagename ==='createMaterialIndentNote' || pagename ==="createMaterialNonIndentNote")
  {
    // if deptCategory is "Engineering"
    let store = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
    let storecode = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].fromStore.code`,'')
    let fromstore = store.filter(x=> x.code === storecode)
    if(fromstore[0].department.deptCategory.toUpperCase() ==='ENGINEERING')
    {
      let deduction = TotalValue_ + (TotalValue_*3)/100;
      TotalValue_ = deduction 
    }
    
  }
  // else if( pagename ==="createMaterialNonIndentNote")
  // {
  //   // if deptCategory is "Engineering"
  //   let store = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
  //   let storecode = get(state.screenConfiguration.preparedFinalObject,`materialIssues[0].fromStore.code`,'')
  //   let fromstore = store.filter(x=> x.code === storecode)
  //   if(fromstore[0].department.deptCategory.toUpperCase() ==='ENGINEERING')
  //   {
  //     let deduction = TotalValue_ - (TotalValue_*3)/100;
  //     TotalValue_ = deduction 
  //   }
    
  // }
  CardTotalQty.push(
    {
      InputQtyValue: InputQtyValue_,
      TotalValue : TotalValue_,
      TotalQty:TotalQty_
    }
  )

  return CardTotalQty;
};



export const getCommonFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}


// indent outword api call
export const getmaterialOutwordSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/materialissues-to/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};


//Material Indent Inword Apis
export const getIndentInwordSearchResults = async queryObject => {

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_search",     
      "",
      queryObject
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
   // throw error;
  }

};
export const creatIndentInword = async (queryObject, payload, dispatch,wfobject) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_create",
      "",
      queryObject,
      { transferInwards: payload, workFlowDetails: wfobject }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
export const updateIndentInword = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/store-asset-services/transferinwards/_update",
      "",
      queryObject,
      { transferInwards: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const getWFPayload = (state, dispatch) => {
  try {
    let businessSeviceTypeData =
      get(state, "screenConfiguration.preparedFinalObject.businessServiceTypeData.store-asset.businessService", [])

    let roles = JSON.parse(getUserInfo()).roles
    let businessServiceName = "";
    businessSeviceTypeData.map(item => {
      roles.some(r => {
        if (item.role.includes(r.code)) {
          businessServiceName = item.name
        }
      })
    });
    let wfobject = {
      "businessService": businessServiceName,
      "action": "CREATED",
      "comments": "",
      "assignee":[JSON.parse(getUserInfo()).uuid]
    }
    return wfobject;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};
