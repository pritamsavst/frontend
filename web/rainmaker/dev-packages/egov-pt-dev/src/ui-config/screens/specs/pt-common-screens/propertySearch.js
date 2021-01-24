import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchPropertyTable} from "./searchResource/searchResults";
import { httpRequest } from "../../../../ui-utils";
import { getTenantId,getUserInfo,setModule,getLocale } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
// import { showHideAdhocPopup } from "../utils";
import { resetFields } from "./mutation-methods";
import { propertySearch} from "./searchResource/searchFunctions";
import "./index.css"
import {searchPropertyDetails} from "./mutation-methods"
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

const url = getQueryArg(
  window.location.href,
  "redirectUrl"
);

const getMDMSData = async (dispatch) => {
  const mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },{name: "citymodule"}
          ]
        }
      ]
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    if(process.env.REACT_APP_NAME != "Citizen"){
      dispatch(
        prepareFinalObject(
          "searchScreen.tenantId",
          tenant
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
};
const getPropertyResults = async(state, dispatch) => {
  propertySearch  (state, dispatch)
}
const header = getCommonHeader({
  labelName: "Property Registry",
  labelKey: "PT_COMMON_PROPERTY_REGISTRY_HEADER"
});
const screenConfig = {
  uiFramework: "material-ui",
  name: "propertySearch",

  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch);
    getMDMSData(dispatch);
  setModule("rainmaker-ws,rainmaker-pt");
  const userInfo = JSON.parse(getUserInfo());
  const tenantId = process.env.REACT_APP_NAME === "Citizen" ? (userInfo.permanentCity || userInfo.tenantId): getTenantId();
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    if(process.env.REACT_APP_NAME == "Citizen"){
      let userName = JSON.parse(getUserInfo()).userName;
     // let tenant =  JSON.parse(getUserInfo()).permanentCity;
      dispatch( prepareFinalObject( "searchScreen.mobileNumber",  userName ));
      dispatch( prepareFinalObject( "searchScreen.tenantId", tenantId ));
      getPropertyResults(state, dispatch);
      // setModule("rainmaker-pt");
      // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    }
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },

                buttonLabel: getLabel({
                  labelName: "Verify Property Details",
                  labelKey: "PT_COMMON_VERIFY_PROPERTY_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  let link="/pt-common-screens/verify-propertyDetails";
                  let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
                  window.location.href = `${moduleName}${link}?redirectUrl=${url}`
                }
              },
            }
          }
        },
        searchPropertyDetails : process.env.REACT_APP_NAME == "Citizen" ? {} : searchPropertyDetails,
        breakAfterSearch: getBreak(),
        searchPropertyTable 

      }
    }
  }
};

export default screenConfig;