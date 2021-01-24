
import { getCommonApplyFooter, } from "../../utils";
import { getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";

import { initiateWFApiCall } from "./functions";


export const footer = () => {

  return getCommonApplyFooter({
  // export const footer = getCommonApplyFooter({
    //  ActionButton:{
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-pms",
    //   componentPath: "DropdownButton",
    //   props: {
    //       dataPath: "ProcessInstances",
    //       moduleName: "INITIATE_RRP",
    //       pageName:"applyrrp",
    //       Visible:true,
    //       Accesslable:[]
    //     }

    //  },
      SubmitButton: {
      componentPath: "Button",
      
      props: {
        variant: "contained",
        color: "primary",
        style: {
          //minWidth: "200px",
          height: "48px",
          marginRight: "10px"
        }
      },
      children: {
        
        submitButtonLabel: getLabel({
          labelName: "Submit",
          labelKey: "PENSION_INITIATE"
        }),
        
        
      },
      onClickDefination: {
        action: "condition",
        callBack: initiateWFApiCall
      },
      visible: true
    },
  
  
});
}
