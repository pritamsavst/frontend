import React from "react";
import {
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import "../utils/index.css";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { EstateIcon } from "../../../../ui-atoms-local";

const tenantId = getTenantId();

const header = getCommonHeader({
  labelName: "Building Branch",
  labelKey: "ES_BUILDING_BRANCH_HEADER"
}, {
  classes: {
    root: "common-header-cont"
  }
});

const cardItems = [{
    label: {
      labelKey: "ES_APPLY_NOC_BUILDING_BRANCH",
      labelName: "NOC"
    },
    icon: < EstateIcon / > ,
    route: `property-search?branchType=BUILDING_BRANCH&type=BuildingBranch_CitizenService_NOC`
  },
  {
    label: {
      labelKey: "ES_MY_APPLICATIONS",
      labelName: "My Applications/Search Applications"
    },
    icon: < EstateIcon / > ,
    route: "my-applications?branchType=BuildingBranch&type=BuildingBranch_CitizenService_NOC"
  }
]


const buildingBranchHome = {
  uiFramework: "material-ui",
  name: "building-branch",
  // beforeInitScreen: (action, state, dispatch) => {
  //   return action
  // },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header,
        applyCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {},
            style: {
              width: "100%"
            }
          }
        }
      }
    }
  }
}

export default buildingBranchHome