import React from "react";
//import { getEventId } from "egov-ui-kit/utils/localStorageUtils";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

function StatusContainer(props) {
	return <div style={styles}>Status : {props.number }</div>;
}

export default StatusContainer;
