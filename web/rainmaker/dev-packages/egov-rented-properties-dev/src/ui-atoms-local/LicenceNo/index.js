import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getQueryArg} from "egov-ui-framework/ui-utils/commons";
import "./index.css";

function licenceNoContainer(props) {
  
  const { number } = props;
  return <div className="application-no-container"><LabelContainer labelName="License No." labelKey ={"RP_LICENSE_NO_CODE"} />{number}</div>;
}
export default licenceNoContainer;
