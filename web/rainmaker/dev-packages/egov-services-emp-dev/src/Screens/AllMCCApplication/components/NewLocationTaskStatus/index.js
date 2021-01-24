import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
// import HistoryIcon from "@material-ui/icons/History";
// import { LabelContainer } from "egov-ui-framework/ui-containers";
import DialogContainer from "../../../../modules/DialogContainer"

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TaskStatusComponents from "../TaskStatusComponents";
import TaskStatusContainer from "../TaskStatusContainer";

import PropTypes from "prop-types";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Divider from "@material-ui/core/Divider";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import HistoryIcon from '@material-ui/icons/History';


const styles = (theme) => ({
  root: {
    marginTop: 24,
    width: "100%"
  },
  closeButton: {
    position: 'absolute',
    right: "10px",
    top: "5px"
  }

});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({

}))(MuiDialogContent);



const iconStyle = {
  marginRight: "13px",
  height: "24px",
  width: "24px",
};

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const mapIconStyle = {
  marginRight: "7px",
  height: "12px",
  width: "14px",
  borderRadius: "50%",
};

class BookingDetails extends Component {
  state = {
    open: false
  };


  handleClickOpen = () => {

    this.setState({
      open: true
    })

  };
  handleClose = () => {
    this.setState({
      open: false
    })
  };

  getCurrentStatus = status => {
    switch (status) {
      case "INITIATED":
        return "Initiated";
      case "APPLIED":
        return "Pending for Document verification";
      case "FIELDINSPECTION":
        return "Pending for Field inspection";
      case "PENDINGPAYMENT":
        return "Pending payment";
      case "WF_NLUJM_PENDINGAPPROVAL":
        return "Panding for Approval 1st level";
      case "APPROVED":
        return "Approved";
      case "WF_NLUJM_PUBLISHED":
        return "Published";
      case "WF_NLUJM_PENDINGPUBLISH":
        return "Panding for Published";
      case "WF_NLUJM_PENDINGAPPROVALOSD":
        return "Panding for Approval 2ndlevel";



    }
  };

  convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}-${month}-${year}`;
  };

  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };
  getImageSource = (imageSource, size) => {
    const images = imageSource.split(",");
    if (!images.length) {
      return null;
    }
    switch (size) {
      case "small":
        imageSource = images[2];
        break;
      case "medium":
        imageSource = images[1];
        break;
      case "large":
      default:
        imageSource = images[0];
    }
    return imageSource || images[0];
  };
  onImageClick = (source) => {
    window.open(this.getImageSource(source, "large"), 'Image');
    // this.props.history.push(`/image?source=${source}`);
  };

  render() {
    const { status, historyApiData, bkBookingVenue,bkFromDate, bkToDate,applicantName, applicationNo, submittedDate, dateCreated, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;
    var ProcessInstances = [];

    if (historyApiData != undefined && historyApiData.ProcessInstances && historyApiData.ProcessInstances.length > 0) {
      ProcessInstances = [...historyApiData.ProcessInstances];
    } 
    return (
      <div>
        <Card
          textChildren={
            <div>
                <div className="rainmaker-displayInline row">

                <div className="col-8" style={{paddingLeft:"10px"}}>
                  <Label label="BK_MYBK_TASK_STATUS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div style={{ position: "absolute", right: "100px" }} className="col-4">
                <button
                    style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", background: "white" }}
                    onClick={() => { this.handleClickOpen() }}>
                   <HistoryIcon />
                    <h5 style={{ marginTop: "-25px", marginBottom: "60px", marginLeft: "130px"}}>
                    VIEW HISTORY
                    </h5>
                  </button>
                </div>
              </div>
              <div key={10} className="complaint-detail-full-width">
                <Dialog maxWidth={false} style={{ zIndex: 2000 }} onClose={() => { this.handleClose() }} aria-labelledby="customized-dialog-title" open={this.state.open} >
                  <DialogTitle id="customized-dialog-title" onClose={() => { this.handleClose() }}>
                    <b>Task Status</b>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      <Stepper orientation="vertical">
                        {ProcessInstances.map(
                          (item, index) =>
                            item && (
                              <Step key={index} active={true}>
                                <StepLabel>
                                  <LabelContainer
                                    labelName={this.getCurrentStatus(item.state.applicationStatus)}
                                    labelKey={
                                       item.businessService
                                        ? `BK_WF_${item.businessService.toUpperCase()}_${
                                        item.state.applicationStatus
                                        }`
                                        : ""
                                    }
                                  />
                                </StepLabel>
                                <StepContent>
                                  <TaskStatusComponents currentObj={item} index={index} />
                                  <Divider style={{ width: "1000px" }} />
                                </StepContent>
                              </Step>
                            )
                        )}
                      </Stepper>
                    </Typography>
                  </DialogContent>
                </Dialog>

  <div className="complaint-detail-detail-section-status row">
  <div className="col-md-2">
     <Typography variant="caption">
     <LabelContainer labelName="Date" labelKey="BK_DATE_LABEL" />
        </Typography>
        <Typography variant="body2">
          {/* <LabelContainer  complaint && complaint.applicantName ? complaint.applicantName : 'NA',
            labelName={this.convertEpochToDate(lastModifiedTime,"dayend")}
          /> */}
<LabelContainer

            labelName={ProcessInstances && ProcessInstances.length>0 && ProcessInstances[0].auditDetails?
              this.convertEpochToDate(ProcessInstances[0].auditDetails.lastModifiedTime): ''}
          /> 

        </Typography>
        </div>
        <div className="col-md-3">
        <Typography variant="caption">
          <LabelContainer
            labelName="Updated By"
            labelKey="BK_UPDATED_BY_LABEL"
          />
        </Typography>
        <Typography variant="body2">
          
          <LabelContainer labelName={ProcessInstances && ProcessInstances.length>0 && ProcessInstances[0].assigner? ProcessInstances[0].assigner.name : ''} />
        </Typography>
          </div>
          <div className="col-md-3">

          <Typography variant="caption">
          <LabelContainer
            labelName="Status"
            labelKey="BK_COMMON_TABLE_COL_STATUS"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
        {/*<LabelContainer
            labelName={ProcessInstances && ProcessInstances.length>0 && 
              ProcessInstances[0].state? ProcessInstances[0].state.state: ''
            }
          />*/}
<LabelContainer
            labelName={ProcessInstances && ProcessInstances.length>0 && 
              ProcessInstances[0].state? this.getCurrentStatus(ProcessInstances[0].state.state): ''
            }

 labelKey={
  ProcessInstances && ProcessInstances.length>0 && ProcessInstances[0].businessService
                ? `BK_WF_${ProcessInstances[0].businessService.toUpperCase()}_${
                  ProcessInstances[0]. state.state          
                  }`
                : ""
            }           
          />

          {/* <LabelContainer
            labelName={getCurrentStatus(ProcessInstances[0].state.state)}
            labelKey={
              ProcessInstances[0].businessService
                ? `WF_${ProcessInstances[0].businessService.toUpperCase()}_${
                  ProcessInstances[0],
                  state.state
                  }`
                : ""
            }
          /> */}
        </Typography>
          </div>
          <div className="col-md-2">
          <Typography variant="caption">
          <LabelContainer
            labelName="Current Owner"
            labelKey="BK_CURRENT_OWNER_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer
            labelName={ ProcessInstances && ProcessInstances.length>0 && ProcessInstances[0].assignee?
                ProcessInstances[0].assignee.name
                : "NA"
            }
          />
        </Typography>          
            </div>
            <div className="col-md-2">
            <Typography variant="caption">
          <LabelContainer
            labelName="Comments"
            labelKey="BK_APPROVAL_CHECKLIST_COMMENTS_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer   
            labelName= {
              ProcessInstances && ProcessInstances.length>0 && ProcessInstances[0].comment ?
              ProcessInstances[0].comment : ''}
           />
        </Typography>
              </div>
</div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default BookingDetails;
