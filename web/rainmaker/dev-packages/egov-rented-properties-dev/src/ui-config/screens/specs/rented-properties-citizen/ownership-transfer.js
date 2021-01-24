import React from "react";
import { getCommonHeader, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { WORKFLOW_BUSINESS_SERVICE_OT } from "../../../../ui-constants";

const tenantId = getTenantId();

const header = getCommonHeader(
    {
      labelName: "Ownership Transfer",
      labelKey: "RP_OWNER_SHIP_TRANSFER_HEADER"
    },
    {
      classes: {
        root: "common-header-cont"
      }
    },
    {
    style: {
      wordWrap: "break-word",
      wordBreak:"break-all"
    }
  }
  );

let cardItems = [{
    label: {
        labelKey: "RP_APPLY_OWNERSHIP_TRANFER",
        labelName: "Apply for Ownership Transfer"
    },
    icon: <TradeLicenseIcon />,
    route: `ownership-apply`
  },
  {
    label: {
        labelKey: "RP_MY_APPLICATIONS",
        labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "ownership-my-applications"
  }
]

const getData = async (action, state, dispatch) => {
  const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: WORKFLOW_BUSINESS_SERVICE_OT }]
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
}

const ownershipHome = {
    uiFramework: "material-ui",
    name: "ownership-transfer",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch)
      return action
    },
    components: {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            header,
            applyCard: {
              uiFramework: "custom-molecules",
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

export default ownershipHome