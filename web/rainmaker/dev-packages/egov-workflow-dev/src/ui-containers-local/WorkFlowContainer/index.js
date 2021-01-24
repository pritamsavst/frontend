import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "../TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";

const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
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
        addWflowFileUrl(processInstances, prepareFinalObject);
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
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "VERIFY":
        return "purpose=verify&status=success";
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
      case "ACTIVATE_TEMP_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated";

      case "VERIFY_AND_FORWARD_EE":
      case "VERIFY_AND_FORWARD_JE_BR":
          return "purpose=forward&status=success";

      case "PAY":
      case "PAY_FOR_REGULAR_CONNECTION":
      case "PAY_FOR_TEMPORARY_CONNECTION":
          return "purpose=payment&status=success";
          
      case "INITIATE":
          return "purpose=initiated&status=success";
          
      case "APPLY_SECURITY_DEPOSIT":
      case "APPLY_FOR_REGULAR_CONNECTION":
      case "APPLY_CONNECTION_REACTIVATION":
          return "purpose=apply&status=success";

      case "APPROVE":
      case "APPROVE_TEMP_CONNECTION":
      case "APPROVE_FOR_CONNECTION_CONVERSION":
      case "APPROVE_ACTIVATE_CONNECTION":
      case "APPROVE_AND_STOP_BILLING":
      case "APPROVE_AND_TEMP_STOP_BILLING":
      case "APPROVE_FOR_CONNECTION_RENAME":
      case "APPROVE_FOR_CONNECTION":
      case "APPROVE_BY_JE_BR":
          return "purpose=approve&status=success";

      case "SEND_BACK_FOR_ADDON_PAYMENT":
      case "SEND_BACK":
          return "purpose=sendback&status=success";
      default :
        return "purpose=forward&status=success";
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
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

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );

    if (moduleName === "NewWS1" || moduleName === "NewSW1"|| moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL") {
      data = data[0];
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          })
        })
      }
      data.processInstance = {
        documents: data.wfDocuments,
        assignes: data.assignees,
        comment: data.comment,
        action: data.action
      }
      data.waterSource = data.waterSource + "." + data.waterSubSource;
    
    }

    if (moduleName === "NewSW1") {
      dataPath = "SewerageConnection";
    }

    try {
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });

      this.setState({
        open: false
      });

      if (payload) {
        let path = "";

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

        if (moduleName === "NewWS1" || moduleName === "NewSW1" || moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL") {
          window.location.href = `acknowledgement?${this.getPurposeString(label)}&applicationNumber=${applicationNumber}&tenantId=${tenant}`;
        }

      }
    } catch (e) {
      if (moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      }else if(moduleName === "NewWS1" || moduleName === "NewSW1" || moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL" ){
        toggleSnackbar(
          true,
          {
            labelName: "Workflow update error!",
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
    const { toggleSnackbar, dataPath, preparedFinalObject,moduleName } = this.props;
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
    } 
    else {
      var validated = true;
      const{WaterConnection} = preparedFinalObject
      if(moduleName === "NewWS1" || moduleName === "NewSW1" || moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL" ){
        if (WaterConnection[0].comment.length === 0) {
          validated = false;
          toggleSnackbar(
            true,
            { labelName: "Please provide comments", labelKey: "ERR_PLEASE_PROVIDE_COMMENTS" },
            "error"
          );
        }
  
        if (WaterConnection[0].comment.length > 128) {
          validated = false;
          toggleSnackbar(
            true,
            { labelName: "Invalid comment length", labelKey: "ERR_INVALID_COMMENT_LENGTH" },
            "error"
          );
        }
      } 

      if (validated) {
        data.workFlowDetails = data.workFlowDetails
        this.wfUpdate(label);

      }

     // this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    //console.log("modulenamewater", moduleName);
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
    } else if (moduleName === "NewWS1" || moduleName === "NewSW1" ||moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL") {
      baseUrl = "wns"
      if (moduleName === "NewWS1" || moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL") {
        bservice = "WS.ONE_TIME_FEE"
        if(moduleName === "NewWS1")   window.localStorage.setItem("isTubeWell",false);
        if( moduleName === "WS_TUBEWELL") window.localStorage.setItem("isTubeWell",true);
      } else {
        bservice = "SW.ONE_TIME_FEE"
      }
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.MUTATION") {
      bservice = "PT.MUTATION"
    } else {
      baseUrl = "tradelicence";
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY_FOR_TEMPORARY_CONNECTION":
      case "PAY_FOR_REGULAR_CONNECTION":
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
        case "WATERMODIFY":
          return isAlreadyEdited
          ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&service=WATER`
          : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&service=WATER`;
    }
  };


  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
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
    const data = find(businessServiceData, { businessService: moduleName });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
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
  getWNSButtonForCitizen = (preparedFinalObject, status, businessId, moduleName) =>{   
   // const btnName = ["Apply for Regular Connection","Reactivate Connection","Connection Conversion","Temporary Disconnection","Permanent Disconnection"]
    const btnName = ["UPDATE_CONNECTION_HOLDER_INFO","APPLY_FOR_REGULAR_INFO","REACTIVATE_CONNECTION","CONNECTION_CONVERSION","TEMPORARY_DISCONNECTION","PERMANENT_DISCONNECTION"];
      let actions  = btnName.map(btn => {
              const buttonObj = {
                buttonLabel: btn,
                moduleName: moduleName,
                tenantId: "ch.chandigarh",
                isLast: true,
                buttonUrl: this.getRedirectUrl("WATERMODIFY", businessId, moduleName)
              }

              return buttonObj;
            });

            //logic based on conditions  preparedFinalObject
            const {WaterConnection} = preparedFinalObject;
            let inWorkflow = false ;
            inWorkflow = WaterConnection && WaterConnection[0].inWorkflow;
            const connectionUsagesType = WaterConnection && WaterConnection[0].connectionUsagesType;
            if(inWorkflow){
              actions = [];
            }
            else if(status === "PENDING_FOR_REGULAR_CONNECTION"){
              actions = actions.filter(item => item.buttonLabel === 'APPLY_FOR_REGULAR_INFO'); 
            }
            else if(status === "TEMPORARY_DISCONNECTED"){
              actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION'); 
            }
            else if (moduleName === "WS_TUBEWELL"){
              actions = actions.filter(item => item.buttonLabel === 'UPDATE_CONNECTION_HOLDER_INFO');
            }
            else if(connectionUsagesType && connectionUsagesType !=="COMMERCIAL"){
              actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'CONNECTION_CONVERSION'&& item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            } 
            else{
              actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            }

    return actions;
}
  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles,
      getWNSButtonForCitizen
    } = this;
    const {preparedFinalObject , prepareFinalObject} = this.props;
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];

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
        isLast: item.action === "PAY"||  item.action ===  "PAY_FOR_TEMPORARY_CONNECTION"||item.action === "PAY_FOR_REGULAR_CONNECTION" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: (businessService === "NewWS1" || businessService === "NewSW1" ||businessService === "WS_CONVERSION" || businessService === "WS_DISCONNECTION" || businessService === "WS_RENAME" || businessService === "WS_TUBEWELL") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    //workflow change for water connection 
    if(businessService=='NewWS1' && applicationStatus == 'PENDING_FOR_SDE_APPROVAL'){
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      if(  pipeSize == '15'){
        actions = actions.filter(item => item.buttonLabel !== 'FORWARD');
      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'APPROVE_FOR_CONNECTION');
      }
    }
    if(businessService=='NewWS1' && applicationStatus == 'PENDING_FOR_PAYMENT'){
      const {WaterConnection} = preparedFinalObject;
      let connectionType = "" ;
      connectionType = WaterConnection && WaterConnection[0].waterApplicationType;
      if(  connectionType == 'REGULAR'){
        actions = actions.filter(item => item.buttonLabel !== 'PAY_FOR_TEMPORARY_CONNECTION'); 
      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'PAY_FOR_REGULAR_CONNECTION');
      }
    }
    if(businessService=='NewWS1' && applicationStatus == 'PENDING_FOR_TEMPORARY_TO_REGULAR_CONNECTION_APPROVAL'){
      //    actions.forEach(item => {
      //     if(item.buttonLabel === 'APPROVE_FOR_CONNECTION_CONVERSION')
      //     // prepareFinalObject("WaterConnection[0].waterApplicationType","REGULAR")
      // });
    }
    if(businessService=='WS_DISCONNECTION' && applicationStatus == 'PENDING_FOR_SUPERINTENTENT_APPROVAL'){
      const {WaterConnection} = preparedFinalObject;;
      const  activityType = WaterConnection && WaterConnection[0].activityType;

      if(activityType ==="TEMPORARY_DISCONNECTION"){
        actions = actions.filter(item => item.buttonLabel !== 'APPROVE_AND_STOP_BILLING');
      }
      else if(activityType ==="PERMANENT_DISCONNECTION"){
        actions = actions.filter(item => item.buttonLabel !== 'APPROVE_AND_TEMP_STOP_BILLING');
      }
    }

    if(businessService=='NewWS1' || businessService ==='WS_RENAME' ||businessService === "WS_CONVERSION" || businessService === "WS_DISCONNECTION" || businessService === "WS_TUBEWELL"){
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
      const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
      if(roleIndex && !isButtonPresent ){
      //   const buttonArray = getWNSButtonForCitizen(preparedFinalObject, applicationStatus, businessId,businessService);
      //  actions = actions.concat(buttonArray);
      }
        
    }
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };



  convertOwnerDobToEpoch = owners => {
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
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
     let showFooter;
      if(moduleName==='NewWS1'||moduleName==='NewSW1' ||moduleName === "WS_CONVERSION" || moduleName === "WS_DISCONNECTION" || moduleName === "WS_RENAME" || moduleName === "WS_TUBEWELL"){
         showFooter=true;
      } else if(moduleName==='ROADCUTNOC'||moduleName==='PETNOC'||moduleName==='ADVERTISEMENTNOC'||moduleName==='SELLMEATNOC'){
        showFooter=false;
     }      else{
         showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName}/>
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
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
