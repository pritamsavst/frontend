import React from "react";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Hidden from "@material-ui/core/Hidden";
import { TaskDialog } from "egov-workflow/ui-molecules-local";
import { addWflowFileUrl, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { Card } from "components";
import { getWFConfig } from "./workflowRedirectionConfig";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import "./index.css";
import get from "lodash/get"
import {  convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";

class InboxData extends React.Component {
  state = {
    dialogOpen: false,
    workflowHistory: [],
    sortOrder: "asc",
    isSorting: false,
    wfSlaConfig:[]
  };

  componentDidMount = async () => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: process.env.REACT_APP_DEFAULT_TENANT_ID,
        moduleDetails: [
         {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "wfSlaConfig"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      if(payload){
        this.setState({
          wfSlaConfig : get(payload.MdmsRes, "common-masters.wfSlaConfig")
        })
      }
    } catch (e) {
      console.log(e);
    }
  }

  getProcessIntanceData = async (pid) => {
    const tenantId = getTenantId();
    const queryObject = [
      { key: "businessIds", value: pid },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId },
    ];
    const payload = await httpRequest("egov-workflow-v2/egov-wf/process/_search?", "", queryObject);
    const processInstances = payload && payload.ProcessInstances.length > 0 && orderWfProcessInstances(payload.ProcessInstances);
    var horticultureBusinessServices =
    ["PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS",
     "PRUNING OF TREES GIRTH GREATER THAN 90 CMS",
     "REMOVAL OF GREEN TREES",
     "REMOVAL OF DEAD/DANGEROUS/DRY TREES" ]
     if(horticultureBusinessServices.includes(processInstances[0].businessService))
    {
      var finalProcessInstancesHorticulture = processInstances.map(function(element, index) {
        if(index == 0)
        {
        var o = Object.assign({}, element);
        o.numberOfDaysToTakeAction = Math.ceil((element.auditDetails.lastModifiedTime - element.auditDetails.createdTime)/(1000 * 3600 * 24) )
        return o;
      
      }
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

    return finalProcessInstancesHorticulture
  }
  else
  {
    return processInstances;
  
  }
  };

  onHistoryClick = async (moduleNumber) => {
    const { toggleSnackbarAndSetText, prepareFinalObject } = this.props;
    const processInstances = await this.getProcessIntanceData(moduleNumber.text);
    if (processInstances && processInstances.length > 0) {
      await addWflowFileUrl(processInstances, prepareFinalObject);
      this.setState({
        dialogOpen: true,
      });
    } else {
      toggleSnackbarAndSetText(true, {
        labelName: "API error",
        labelKey: "ERR_API_ERROR",
      });
    }
  };

  onDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  getModuleLink = async (item, row, index) => {
    const status = row[2].text && row[2].text.props.defaultLabel;
    const taskId = index === 0 && item.text;
    const tenantId = getTenantId();
	    const wfStatus = row[2].text.props.label.substring(row[2].text.props.label.lastIndexOf('_') + 1);

    // const processInstances = await this.getProcessIntanceData(row[0].text);
    // if (processInstances && processInstances.length > 0) {
    //   await addWflowFileUrl(processInstances, prepareFinalObject);
    // }
	
    let contextPath = status === "Initiated" ? getWFConfig(row[0].hiddenText,row[0].subtext,taskId).INITIATED : getWFConfig(row[0].hiddenText,row[0].subtext,taskId).DEFAULT;
    let queryParams = `applicationNumber=${taskId}&tenantId=${tenantId}`;
    
    if(contextPath=='/egov-services/application-details'||contextPath=='/egov-services/bwt-application-details'|| contextPath=="/egov-services/newLocation-application-details"){
      queryParams = `${taskId}`;
    }

    //for only pension module
    if(row[0].subtext.toUpperCase()==='RRP_SERVICE' ||row[0].subtext.toUpperCase()=='DOE_SERVICE'||row[0].subtext.toUpperCase()=='DOP_SERVICE')
    {
      queryParams=`applicationNumber=${taskId}&tenantId=${tenantId}&step=${row[2].text.props.label}&module=${row[0].subtext.toUpperCase()}`;
    }
    if(row[0].subtext=="PT.CREATE"){
      queryParams+='&type=property';
    }
    else  if(row[0].subtext=="ASMT"){
      queryParams+='&type=assessment';
    } else if(row[0].subtext === "MasterRP") {
      queryParams = `transitNumber=${taskId}&tenantId=${tenantId}`
    }
    else if (row[0].subtext === "NewWS1" || row[0].subtext === "WS_CONVERSION" || row[0].subtext === "WS_DISCONNECTION" || row[0].subtext === "WS_RENAME" || row[0].subtext === "WS_TUBEWELL") {
      queryParams += '&history=true&service=WATER';
      window.localStorage.setItem("wns_workflow",row[0].subtext);
    }
    else if (row[0].subtext === "NewSW1") {
      queryParams += '&history=true&service=SEWERAGE';
    }
    else if (row[0].subtext == "Engineering" || row[0].subtext == "IT" || row[0].subtext == "Caretaker" || row[0].subtext == "MOH") {
      queryParams += `&Status=${wfStatus}`;
    }
	  else if (row[0].subtext == "NULM") {
      queryParams += `&status=${wfStatus}`;
    } 
    else if(row[0].subtext === "ES-EB-AllotmentOfSite" || row[0].subtext === "ES-EB-PropertyMaster" || row[0].subtext === "ES-BB-PropertyMaster" || row[0].subtext === "ES-MM-PropertyMaster") {
      queryParams = `fileNumber=${taskId}&tenantId=${tenantId}`
    } 
    // else if(row[0].subtext.startsWith("ES-")) {
    //   queryParams = `applicationNumber=${taskId}&tenantId=${tenantId}&branchType=${row[0].hiddenText}`
    // } 

    if(contextPath=='/egov-services/application-details'||contextPath=='/egov-services/bwt-application-details'||contextPath== "/egov-services/newLocation-application-details"){
      this.props.setRoute(`${contextPath}/${queryParams}`);

    }else{
    this.props.setRoute(`${contextPath}?${queryParams}`);
    }
  };

  getSlaColor = (sla, businessService) => {
    const { businessServiceSla } = this.props;
    const { wfSlaConfig } = this.state;
    const MAX_SLA = businessServiceSla[businessService];
    if(wfSlaConfig){
      if( (MAX_SLA - (MAX_SLA*eval(wfSlaConfig[0].slotPercentage)) <= sla) && sla <= MAX_SLA){
        return wfSlaConfig[0].positiveSlabColor;
       }else if(0 < sla && sla < MAX_SLA - (MAX_SLA*eval(wfSlaConfig[0].slotPercentage))){
         return wfSlaConfig[0].middleSlabColor;
       }else{
         return wfSlaConfig[0].negativeSlabColor;
       }
    }
  };

  sortingTable = (order) => {
    const { sortOrder } = this.state;
    if (sortOrder !== order) {
      this.setState({
        sortOrder: order,
        isSorting: true,
      });
    }
  };

  render() {
    const { data, ProcessInstances } = this.props;
    const { onHistoryClick, onDialogClose, getModuleLink } = this;
    const { isSorting, sortOrder } = this.state;
    if (isSorting) {
      data.rows.reverse();
    }
    return (
      <div>
        <Hidden only={["xs"]}>
          <Table>
            <TableHead style={{backgroundColor: "white", borderBottom: "1px solid rgb(211, 211, 211)"}}>
              <TableRow>
                {data.headers.map((item, index) => {
                  let classNames = `inbox-data-table-headcell inbox-data-table-headcell-${index}`;
                  return (
                    <TableCell className={classNames}>
                      {index === 4 ? (
                        <div className = "rainmaker-displayInline sortstyle">
                          {sortOrder === "desc" && (
                            <div className="arrow-icon-style" onClick={() => this.sortingTable("asc")}>
                              <Label label={item} labelStyle={{ fontWeight: "500" }} color="#000000" />
                              <ArrowDropUpIcon />
                            </div>
                          )}
                          {sortOrder === "asc" && (
                            <div className="arrow-icon-style" onClick={() => this.sortingTable("desc")}>
                              <Label label={item} labelStyle={{ fontWeight: "500" }} color="#000000" />
                              <ArrowDropDownIcon />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Label label={item} labelStyle={{ fontWeight: "500" }} color="#000000" />
                      )}
                    </TableCell>
                  );
                })}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {data.rows.length === 0 ? (
              <TableBody>
                <Label labelClassName="" label="COMMON_INBOX_NO_DATA" />
              </TableBody>
            ) : (
              <TableBody>
                {data.rows.map((row, i) => {
                  return (
                    <TableRow key={i} className="inbox-data-table-bodyrow">
                      {row.map((item, index) => {
                        if(index !== 1 && index !== 4 ){
                        let classNames = `inbox-data-table-bodycell inbox-data-table-bodycell-${index}`;
                        if (item.subtext) {
                          return (
                            <TableCell className={classNames}>
                              <div onClick={() => getModuleLink(item, row, index)} className="inbox-cell-text">
                                {<a style={{color: "#FE7A51"}}>{item.text} </a>}
                              </div>
                              <div className="inbox-cell-subtext">
                                {<Label label={`CS_COMMON_INBOX_${item.subtext.toUpperCase()}`} color="#000000" />}
                              </div>
                            </TableCell>  
                          );
                        } else if (item.badge) {
                          return (
                            <TableCell className={classNames}>
                              <span class={"inbox-cell-badge-primary"} style={{backgroundColor : this.getSlaColor(item.text, row[2].text.props.label.split("_")[1])}}>{item.text}</span>
                            </TableCell>
                          );
                        } else if (item.historyButton) {
                          return (
                            <TableCell className={classNames}>
                              <div onClick={() => onHistoryClick(row[0])} style={{ cursor: "pointer" }}>
                                <i class="material-icons">history</i>
                              </div>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell className={classNames}>
                              <div>{item.text}</div>
                            </TableCell>
                          );
                        }
                      }})}
                    </TableRow>
                  );
                })}
                <TaskDialog open={this.state.dialogOpen} onClose={onDialogClose} history={ProcessInstances} />
              </TableBody>
            )}
          </Table>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]} implementation="css">
          <div class="sort-icon-flex">
              {sortOrder === "asc" && (
                <div className = "rainmaker-displayInline sortstyle" onClick={() => this.sortingTable("desc")}>
                  <ImportExportIcon />
                  <Label className="sort-icon" label={"INBOX_SORT_ICON"} />
                </div>
              )}
              {sortOrder === "desc" && (
                <div className = "rainmaker-displayInline sortstyle" onClick={() => this.sortingTable("asc")}>
                  <ImportExportIcon />
                  <Label className="sort-icon" label={"INBOX_SORT_ICON"} />
                </div>
              )}            
          </div>
          {data.rows.length === 0 ? (
            <Card textChildren={<Label labelClassName="NodataFound" label="COMMON_INBOX_NO_DATA" />} />
          ) : (
            <div>
              {data.rows.map((row, index) => {
                return (
                  <Card
                    key={index}
                    textChildren={
                      <div>
                        <div className="head" onClick={() => getModuleLink(row[0], row, 0)}>
                          <a style={{ color: "#FE7A51" }}>{row[0].text}</a>
                        </div>
                        <div className="head">
                          <Label label={`CS_COMMON_INBOX_${row[0].subtext.toUpperCase()}`} color="#000000" />
                        </div>

                         <div className="card-div-style">
                          <Label label={data.headers[1]} labelStyle={{ fontWeight: "500" }} />
                        </div>
                        {/* <div className="card-div-style">{row[1].text}</div> */} 
                        <div className="card-div-style">{row[2].text}</div>

                        <div className="card-div-style">
                          <Label label={data.headers[2]} labelStyle={{ fontWeight: "500" }} />
                        </div>
                        <div className="card-div-style">{row[3].text}</div>

                        <div className="card-div-style">
                          <Label label={data.headers[3]} labelStyle={{ fontWeight: "500" }} />
                        </div>
                      

                        {/* <div className="card-div-style">
                          <Label label={data.headers[4]} labelStyle={{ fontWeight: "500" }} />
                        </div>
                        <div className="card-sladiv-style">
                          <span class={"inbox-cell-badge-primary"} style={{backgroundColor : this.getSlaColor(row[4].text, row[2].text.props.label.split("_")[1])}}>{row[4].text}</span>
                        </div> */}

                        <div className="card-viewHistory-icon" onClick={() => onHistoryClick(row[0])}>
                          <i class="material-icons">history</i>
                        </div>
                      </div>
                    }
                  />
                );
              })}
              <TaskDialog open={this.state.dialogOpen} onClose={onDialogClose} history={ProcessInstances} />
            </div>
          )}
        </Hidden>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: (url) => dispatch(setRoute(url)),
    toggleSnackbarAndSetText: (open, message) => dispatch(toggleSnackbarAndSetText(open, message)),
    prepareFinalObject: (path, value) => dispatch(prepareFinalObject(path, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxData);

export const Taskboard = ({ data }) => {
  return (
    <div>
      {data.map((item, i) => (
        <div className="col-sm-4">
          <Card
            className="inbox-card inbox-worklist-card"
            key={i}
            textChildren={
              <div>
                <div className="head">{item.head}</div>
                <div className="body">{item.body}</div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
};
// this method not in use
const onModuleCardClick = (route) => {

 
};
