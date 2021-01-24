import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getQueryArg} from "egov-ui-framework/ui-utils/commons";
import "./index.css";

function ApplicationNoContainer(props) {
  const { number } = props;
  if(props.notice==="Notice"){
  return <div className="application-no-container"><LabelContainer labelName="Notice Id." labelKey ={"RP_NOTICE_ID"}/>
  {number}
  </div>;
} else if(props.type === "RP_MASTER") {
  return <div className="application-no-container"><LabelContainer labelName="Transit Site No." labelKey ={"RP_SITE_PLOT_LABEL"}/>
  {" "}{number}
  </div>
} else if(props.notice==="ALLOTMENT"){
  return <div className="application-no-container"><LabelContainer labelName="Allotment No." labelKey ={"RP_COMMOM_ALLOTMENT_NUMBER"}/>
  {" "}{number}
  </div>;
}{
  return <div className="application-no-container"><LabelContainer labelName="Application No." labelKey ={"RP_HOME_SEARCH_RESULTS_APP_NO_LABEL"}/>
  {number}
  </div>;
}
}

export default ApplicationNoContainer;
