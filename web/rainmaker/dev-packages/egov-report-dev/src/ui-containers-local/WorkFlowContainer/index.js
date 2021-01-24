import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "egov-workflow/ui-containers-local/TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import Footer  from "egov-workflow/ui-molecules-local/Footer";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar, toggleSpinner  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { getSearchResultsView } from "../../ui-utils/commons";

class WorkFlowContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentRoleOrAssignee: '',
      open: false,
    action: ""
  
    }
  }
  

  componentDidMount = async () => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    // debugger
    let tenantIdForBoth = JSON.parse(getUserInfo()).permanentCity;
    var response = await getSearchResultsView([
      { key: "tenantId", value: tenantIdForBoth },
      { key: "service_request_id", value: applicationNumber }
    ]);
    this.setState({currentRoleOrAssignee: response.ResponseBody[0].current_assignee
    })
    const { prepareFinalObject, toggleSnackbar } = this.props;
    
    const tenantId = getQueryArg(window.location.href, "tenantId");
    // const serviceRequestDetailResponse =
    
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        var finalProcessInstances = processInstances.map(function(element, index) {
          if(index == 0)
          {
          var o = Object.assign({}, element);
          o.numberOfDaysToTakeAction = Math.ceil((element.auditDetails.lastModifiedTime - element.auditDetails.createdTime)/(1000 * 3600 * 24) )
          return o;}
          else{
          var o = Object.assign({}, element);
          var currentDateArray = []
          var prevDateArray = []
          var prevDateArray = ((convertEpochToDate(processInstances[index-1].auditDetails.lastModifiedTime)).toString()).split("/")
          var currentDateArray =((convertEpochToDate(element.auditDetails.lastModifiedTime)).toString()).split("/")
          var prevDate = new Date(prevDateArray[2], prevDateArray[1]-1, prevDateArray[0])
          var currentDate = new Date(currentDateArray[2], currentDateArray[1]-1, currentDateArray[0])
          var prevDateString =  new Date(prevDate.toString())
          var currentDateString = new Date(currentDate.toString())
          
          
          var diff =(currentDateString.getTime() - prevDateString.getTime()) / 1000;
          diff /= (60 * 60 * 24);
          o.numberOfDaysToTakeAction = Math.abs(Math.round(diff));
          return o;
          }
        })
        
        addWflowFileUrl(finalProcessInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    
    this.setState({
      open: false
    });
  };
  getPurposeString = action => {
    switch (action) {
      //cases for HC
    case "REQUEST CLARIFICATION":      
        return "purpose=requestForClarification&status=success";
    case "VERIFY AND FORWARD":      
        return "purpose=verifyAndForward&status=success";
    case "VERIFY AND FORWARD TO SDO":      
        return "purpose=verifyAndForwardToSDO&status=success";
    case "COMPLETE":
        return "purpose=complete&status=success";
    case "INSPECT":
        return "purpose=inspect&status=success";  
    case "FORWARD FOR INSPECTION":
          return "purpose=forwardForInspection&status=success";
    case "VERIFY FOR CLOSURE":
      return "purpose=verifyForClosure&status=success";
      case "FORWARD FOR COMPLETION":
        return "purpose=forwardForCompletion&status=success";
      //cases for TL
      
      
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      
    }
  };
  

  wfUpdate = async label => {
    let { 
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      toggleSpinner
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    // if (moduleName === "HORTICULTURE") {
    //   datapath = data;
    // }
    if (moduleName === "NewTL") {
      if (getQueryArg(window.location.href, "edited")) {
        const removedDocs = get(
          preparedFinalObject,
          "LicensesTemp[0].removedDocs",
          []
        );
        if (data[0] && data[0].commencementDate) {
          data[0].commencementDate = convertDateToEpoch(
            data[0].commencementDate,
            "dayend"
          );
        }
        let owners = get(data[0], "tradeLicenseDetail.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "tradeLicenseDetail.owners", owners);
        set(data[0], "tradeLicenseDetail.applicationDocuments", [
          ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
          ...removedDocs
        ]);

        // Accessories issue fix by Gyan
        let accessories = get(data[0], "tradeLicenseDetail.accessories");
        let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
        set(
          data[0],
          "tradeLicenseDetail.tradeUnits",
          getMultiUnits(tradeUnits)
        );
        set(
          data[0],
          "tradeLicenseDetail.accessories",
          getMultiUnits(accessories)
        );
      }
    }
    if (dataPath === "BPA") {
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          });
        });
      }
      if (data.wfDocuments) {
        for (let i = 0; i < data.wfDocuments.length; i++) {
          data.wfDocuments[i].fileStore = data.wfDocuments[i].fileStoreId
        }
      }
    }

    const applicationNumber = getQueryArg(window.location.href,"applicationNumber");

    if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      data = data[0];
    }

    if (moduleName === "NewSW1") {
      dataPath = "SewerageConnection";
    }

    try {
      toggleSpinner()
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });

      this.setState({
        open: false
      });

      if (payload) {
        let path = "";
        toggleSpinner()
        if (moduleName == "PT.CREATE" || moduleName == "ASMT") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Properties[0].acknowldgementNumber', "")}&tenantId=${get(payload, 'Properties[0].tenantId', "")}`);
          return;
        }

        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        window.location.href = `acknowledgement?${this.getPurposeString(
          label
        )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;

        if (moduleName === "NewWS1" || moduleName === "NewSW1") {
          window.location.href = `acknowledgement?${this.getPurposeString(label)}&applicationNumber=${applicationNumber}&tenantId=${tenant}`;
        }

      }
    } catch (e) {
      toggleSpinner()
      if (moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow update error!",
            labelKey: "ERR_WF_UPDATE_ERROR"
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    // debugger;
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }
    set(data, `${appendToPath}action`, label);

    if (dataPath === "services")
    {
      // debugger;
      
      if(data.assignee.length> 0)
      {
        data.isRoleSpecific=false;
      }
      else{
        data.isRoleSpecific=true
      }

      var validated= true;

      if(data.comment.length=== 0)
      {
        validated= false;
        toggleSnackbar(
          true,
          { labelName: "Please provide comments", labelKey: "ERR_PLEASE_PROVIDE_COMMENTS" },
          "error"
        );
      }

      if(data.comment.length> 250)
      {
        validated= false;
        toggleSnackbar(
          true,
          { labelName: "Invalid comment length", labelKey: "ERR_INVALID_COMMENT_LENGTH" },
          "error"
        );
      }
 
        if(data.action==="VERIFY AND FORWARD" 
        ||data.action==="REQUEST CLARIFICATION" 
        || data.action==="VERIFY FOR CLOSURE"  
        || data.action==="FORWARDED FOR COMPLETION" ){
          if(data.roleList.length==0)
          {
            validated= false;  
            
            toggleSnackbar(
              true,
              { labelName: "Please select role !", labelKey: "ERR_SELECT_ROLE" },
              "error"
            );
  
          }}

          if(data.action==="INSPECT" ||data.action==="COMPLETE"){
            const documents = get(data, "wfDocuments");
            if (documents.length == 0) {
              validated= false;
              toggleSnackbar(
                true,
                { labelName: "Please upload file !", labelKey: "ERR_UPLOAD_FILE" },
                "error"
              );
            }}

          if (isDocRequired) {       
            const documents = get(data, "wfDocuments");
            if (documents.length == 0) {
              validated= false;
              toggleSnackbar(
                true,
                { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
                "error"
              );
            }
          }

          if(validated)
          {
            this.wfUpdate(label);

          }
          return;

    }
   

    if (isDocRequired) {
      const documents = get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.wfUpdate(label);
    }


  
  };


  getRedirectUrl = (action, businessId, moduleName) => {
 
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let baseUrl = "";
    let bservice = "";
    if (moduleName === "FIRENOC") {
      baseUrl = "fire-noc";
    } else if (moduleName === "BPA") {
      baseUrl = "egov-bpa";
      bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
    } else if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      baseUrl = "wns"
    }
    else if (moduleName.toUpperCase().trim() === "PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS"
    || moduleName.toUpperCase().trim() === "PRUNING OF TREES GIRTH GREATER THAN 90 CMS"
    || moduleName.toUpperCase().trim() === "REMOVAL OF GREEN TREES" 
    || moduleName.toUpperCase().trim() === "REMOVAL OF DEAD/DANGEROUS/DRY TREES"){
      // alert("inside edit")
      baseUrl = "egov-hc"
    } 
    else {
      baseUrl = "tradelicence";
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
    }
  };

  //not useful
  getHeaderName = action => {
    //alert("inside getHeaderName")
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    //alert("inside getEmployeeRoles")
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    }
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    return roles.toString();
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    // const nextState = data && data.length > 0 find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? find(data.states, { uuid: nextStateUUID }).isTerminateState : false;
    return isLastState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    // alert("getActionIfEditable")
    const data = find(businessServiceData, { businessService: moduleName });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    let actionsForEdit = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      
      });
     if(state.actions!==null)
     { if (state.actions.length > 0) 
      {
        for(var i = 0; i < state.actions.length; i++) {
          actionsForEdit.push( state.actions[i].action);

      }
    }
      if (state.actions === null) {
        actionsForEdit = [];
      }
      
    };
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });
    let isEditPresent=false;
    for(var i = 0; i < actionsForEdit.length; i++) {
      if(actionsForEdit[i]== "EDIT")
      {
        isEditPresent=true;
        break;
      }  
      
  }
    let editAction = {};
    
   if (isEditPresent && actions.length > 0 && roleIndex > -1) {
    // this.getRedirectUrl("EDIT", businessId, moduleName)
    // if ( actions.length > 0 && roleIndex > -1) {  
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };

  prepareWorkflowContract = (data, moduleName) => {

    const { 
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
   let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService; 
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];
    // debugger
    filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);

    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    actions = actions.filter(item => item.buttonLabel !== 'EDIT');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };

  convertOwnerDobToEpoch = owners => {
  //  //alert ("inside convertOwnerDobToEpoch")
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    // debugger
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
     let showFooter = false;
        // debugger
     if(moduleName=== 'HORTICULTURE')
     {      
      // alert("inside"+moduleName)
      var new_user_role_code
      var currentAssigneeString
      const currentRoleOrAssignee = this.state.currentRoleOrAssignee
      const currentlyLoggedInUserRoles = JSON.parse(getUserInfo()).roles;
      const currentlyLoggedInUserInfo = JSON.parse(getUserInfo());
      var currentRoleOrAssigneeArray = currentRoleOrAssignee.split(",")
      if (currentRoleOrAssigneeArray.length===1)
      {   
      for (var index = 0; index < currentlyLoggedInUserRoles.length; ++index)
       {
        var newUserRoleCode = currentlyLoggedInUserRoles[index];
        var assignedTo = currentlyLoggedInUserInfo.id;

        var userRoleFound=false; 
        if(assignedTo === parseInt(currentRoleOrAssigneeArray[0]))
        {      
          userRoleFound = true;          
          break;
        }
        try
       { 
         new_user_role_code = newUserRoleCode.code.toString()
         currentAssigneeString = currentRoleOrAssigneeArray[0].toString()
         if(new_user_role_code === currentAssigneeString)
        {      
          userRoleFound = true;          
          break;
        }}
        catch(e){}
       }      
  
      if(userRoleFound)
      //  alert("inside showfooter")
        showFooter=true;   
       }
       else if ((currentRoleOrAssigneeArray.length > 1)){
        { 
          for (var i = 0; i<currentRoleOrAssigneeArray.length; i++)
          {
            
         
          for (var index = 0; index < currentlyLoggedInUserRoles.length; ++index)
           {
            var newUserRoleCode = currentlyLoggedInUserRoles[index];
    
            var assignedTo = currentlyLoggedInUserInfo.id;
    
            var userRoleFound=false; 
            if(assignedTo === parseInt(currentRoleOrAssigneeArray[i]))
            {      
              userRoleFound = true;          
              break;
            }
            
            if(newUserRoleCode.code.toString() === currentRoleOrAssigneeArray[i].toString())
            {      
              userRoleFound = true;          
              break;
            }
           }  

          if(userRoleFound)
          {
            break
          }
          }   
 
    
          if(userRoleFound)
   
            showFooter=true;   
           }
       }}
      
     else
     {    
      if(moduleName==='NewWS1'||moduleName==='NewSW1'){
         showFooter=true;
      } else if( moduleName==='ROADCUTNOC'||moduleName==='PETNOC'||moduleName==='ADVERTISEMENTNOC'||moduleName==='SELLMEATNOC'){
        showFooter=true;
     }    
    //  else{     
    //      showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : false;
    //   }

    }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} />
        )}
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
      toggleSpinner: () =>
      dispatch(toggleSpinner()), 
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
