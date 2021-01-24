import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

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
const handleLevel1 = (timeline1, timeline2) => {
  if (timeline1.status === "escalatedlevel1pending") {
    if (timeline2.status === "resolved") return "ES_COMPLAINT_ESCALATED_LEVEL1_HEADER";
    else return "ES_COMPLAINT_ESCALATED_LEVEL1_SLA_BREACH";
  }
};

// const getEscalatingStatus = (timeline, status) => {
//   if (timeline && timeline.length > 2) {
//     if (timeline[0].status === "escalatedlevel1pending") return handleLevel1(timeline[0], timeline[1]);

//     if (timeline[0].status === "escalatedlevel2pending") {
//       if (timeline[1].status === "resolved") return "ES_COMPLAINT_ESCALATED_LEVEL2_HEADER";
//       else if (timeline[1].status === "escalatedlevel1pending" && status === "escalatedlevel1pending") return handleLevel1(timeline[1], timeline[2]);
//       else return "ES_COMPLAINT_ESCALATED_LEVEL2_SLA_BREACH";
//     }
//   }
// };

const getEscalatingStatus = (timeline, status) => {
  if(timeline && timeline.length > 0){
	if(status === "escalatedlevel1pending"){
			let statusIndex = timeline.findIndex( action => action.status === status);
			const action = timeline.filter( (action,index) =>  index === (statusIndex+1));
			
			if(action[0].status ==="resolved")
				return "ES_COMPLAINT_ESCALATED_LEVEL1_HEADER";
			else 
				return "ES_COMPLAINT_ESCALATED_LEVEL1_SLA_BREACH";
	}
	
	if(status === "escalatedlevel2pending"){
				let statusIndex = timeline.findIndex( action => action.status === status);
			const action = timeline.filter( (action,index) =>  index === (statusIndex+1));
			
        if(action[0].status ==="resolved")
          return "ES_COMPLAINT_ESCALATED_LEVEL2_HEADER";
        else 
          return "ES_COMPLAINT_ESCALATED_LEVEL2_SLA_BREACH";
  }
}
return;
};

class Details extends Component {
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
    window.open(this.getImageSource(source, "large"), "Image");
    // this.props.history.push(`/image?source=${source}`);
  };

  render() {
    const {
      status,
      complaint,
      applicationNo,
      description,
      submittedDate,
      address,
      addressDetail,
      mapAction,
      images,
      action,
      role,
      timeLine,
    } = this.props;
    const { houseNoAndStreetName, landmark, mohalla, city, locality, latitude, longitude } = addressDetail || "";
    const icon = {};
    icon.name = "location";
    icon.style = {
      display: "block",
    };
    let statusKey = "";

    if (status) {
      if (status.toLowerCase() == "open") {
        if (action && action === "reopen") {
          statusKey = `CS_COMMON_REOPENED`;
        } else {
          statusKey = `CS_COMMON_SUBMITTED`;
        }
      } else if (status.toLowerCase() == "reassignrequested") {
        if (role === "citizen") {
          statusKey = `CS_COMMON_${status.toUpperCase()}`;
        } else {
          statusKey = `CS_COMMON_CITIZEN_REQUEST_REASSIGN`;
        }
      } else if (status === "escalatedlevel1pending" || status === "escalatedlevel2pending") {
        statusKey = getEscalatingStatus(timeLine, status);
      } else {
        statusKey = `CS_COMMON_${status.toUpperCase()}`;
      }
    }
    const titleKey = complaint && "SERVICEDEFS." + complaint.toUpperCase();

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Icon action="notification" name="sms-failed" color="#767676" />{" "}
                <Label label="CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                {/* Dont delete !! */}
                {/* {role && role == "ao" ? (
                  <div className="rainmaker-displayInline">
                    <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                    <div onClick={this.navigateToComplaintType}>
                      <Icon action="editor" name="mode-edit" style={{ height: 18, width: 18, marginLeft: 16 }} color="#767676" />
                    </div>
                  </div>
                ) : (
                  <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                )} */}
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMMON_COMPLAINT_NO" />
                  <Label
                    labelStyle={{ color: "inherit" }}
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    id="complaint-details-complaint-number"
                    label={applicationNo}
                  />
                </div>
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMPLAINT_DETAILS_CURRENT_STATUS" />
                  <Label
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    id="complaint-details-current-status"
                    labelStyle={{ color: "inherit" }}
                    label={statusKey}
                  />
                </div>
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMPLAINT_DETAILS_SUBMISSION_DATE" />
                  <Label
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                  />
                </div>
                {description && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_ADDCOMPLAINT_COMPLAINT_DETAILS" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      label={description}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                <div style={{ marginTop: "16px" }} className="complaint-image-cont">
                  {images &&
                    images.map((image, index) => {
                      return (
                        image && (
                          <div className="complaint-image-wrapper" key={index}>
                            <Image
                              style={imageStyles}
                              size="medium"
                              className="complaint-image"
                              width="100%"
                              height={46}
                              source={image}
                              onClick={() => this.onImageClick(image)}
                            />
                          </div>
                        )
                      );
                    })}
                </div>
                {addressDetail && !isEmpty(addressDetail) && (
                  <div className="rainmaker-displayInline">
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: 13 }} color={"#767676"} />
                    <Label label="CS_COMPLAINT_DETAILS_ADDRESS_DETAILS" labelClassName="dark-heading" />
                  </div>
                )}
                {houseNoAndStreetName && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label
                      className="col-xs-6  col-sm-4 col-md-2 status-color"
                      label={"CS_COMPLAINTDETAILS_HOUSE"}
                      id="complaint-details-complaint-location"
                    />
                    <Label
                      label={houseNoAndStreetName}
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      id="complaint-details-complaint-location"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {mohalla && city && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label
                      className="col-xs-6  col-sm-4 col-md-2 status-color"
                      label={"CS_COMPLAINTDETAILS_MOHALLA"}
                      id="complaint-details-complaint-location"
                    />
                    <div className="col-xs-6  col-sm-8 col-md-10 no-padding complaint-address-display">
                      <Label
                        label={mohalla}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                      />
                      <Label
                        label={","}
                        className="comma-style"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="16px"
                      />
                      <Label
                        label={`TENANT_TENANTS_${city.toUpperCase().replace(/[.]/g, "_")}`}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                      />
                    </div>
                  </div>
                )}
                {landmark && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label={"CS_COMPLAINTDETAILS_LANDMARK"} />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      label={landmark}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {address && isEmpty(addressDetail) && (
                  <div className="rainmaker-displayInline">
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: "13px" }} color={"#767676"} />
                    <Label
                      label={address}
                      className="status-result-color"
                      id="complaint-details-complaint-location"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {latitude && longitude && (
                  <a href={`http://maps.google.com?q=${latitude},${longitude}`} target="_blank">
                    <Label
                      label={"PGR_GMAP_LINK"}
                      className="status-result-color"
                      id="complaint-details-complaint-location-gmap"
                      labelStyle={{ color: "blue", textDecoration: "underline" }}
                    />
                  </a>
                )}
                {/* <div style={{ marginTop: 10 }}>
                  {mapAction && complaintLoc.lat && (
                    <Button
                      className="employee-complaint-summary-mapBtn"
                      primary={true}
                      label={<Label buttonLabel={true} label={"ES_COMPLAINT_SUMMARY_MAP"} color="#ffffff" />}
                      style={{
                        height: "auto",
                        lineHeight: "auto",
                        minWidth: "inherit",
                      }}
                      labelStyle={{
                        padding: "0 12px 0 0 ",
                        letterSpacing: "0.6px",
                        display: "inline-block",
                        height: "22px",
                        lineHeight: "22px",
                      }}
                      icon={<Icon action="maps" name="place" style={mapIconStyle} color={"#ffffff"} />}
                      onClick={(e) => {
                        this.props.redirectToMap(true);
                      }}
                    />
                  )}
                </div> */}
                {/* {description && (
                  <div className="rainmaker-displayInline">
                    <Icon action="editor" name="format-quote" style={iconStyle} color={"#969696"} />
                    <Label
                      label={description}
                      id="complaint-details-complaint-description"
                      className="status-result-color"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )} */}
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default Details;
