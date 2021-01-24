import {
    getCommonHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {stepper, formwizardFirstStep, formwizardSecondStep, formwizardThirdStep,recoveryNoticeFirstStep} from './applyResource/applyConfig'
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {footer,recoveryNoticefooter} from './applyResource/footer';
import { searchResults } from "./search-preview";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareDocumentTypeObj } from "../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import set from "lodash/set";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";




const header = getCommonHeader({
    labelName: "Apply For Recovery Notice",
    labelKey: "RP_RECOVERY_NOTICE_APPLY"
  });
  export const getMdmsData = async (dispatch, body) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: body
      }
    };
    try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return payload;
    } catch (e) {
      console.log(e);
    }
  };
  export const getColonyTypes = async(action, state, dispatch) => {
    const colonyTypePayload = [{
      moduleName: "RentedProperties",
      masterDetails: [{name: "recoverytype"}]
    }
  ]
    const colonyRes = await getMdmsData(dispatch, colonyTypePayload);
     const {RentedProperties} = !!colonyRes && !!colonyRes.MdmsRes ? colonyRes.MdmsRes : {}
     const {colonies = []} = RentedProperties || []
      dispatch(prepareFinalObject("applyScreenMdmsData.rentedPropertyColonies", RentedProperties.recoverytype))
      const propertyTypes = RentedProperties.recoverytype.map(item => ({
        code: item.code,
        label: item.code
      }))
      dispatch(prepareFinalObject("applyScreenMdmsData.propertyTypes", propertyTypes))
  }

  const beforeInitFn =async(action, state, dispatch)=>{
    set(state, 'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.demandStartdate',"");
    set(state,'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.demandlastdate',"");
    set(state,'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.recoveryType',"");
    set(state,'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.payment[0].amountPaid',"");
    set(state,'screenConfiguration.preparedFinalObject.Properties[0].owners[0].ownerDetails.editor',"")
  }

  const getData = async(action, state, dispatch) => {
    getColonyTypes(action, state, dispatch);
    const propertyArr = get(
      state.screenConfiguration.preparedFinalObject,
      "Properties[0]",
      [])
    const orgOwner = propertyArr.owners.find(item => !!item.isPrimaryOwner)
      if(!!orgOwner){
          dispatch(
              prepareFinalObject(
                  "Properties[0].owners[0].ownerDetails.originalAllottee",
                  orgOwner.ownerDetails.name
              )
              )
      }
  }

const recoveryNotice = {
    uiFramework: "material-ui",
    name: "notice-recovry",
    beforeInitScreen: (action, state, dispatch) => {
        getData(action, state, dispatch);
        beforeInitFn(action, state, dispatch);
        return action;
      },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                              xs: 12,
                              sm: 10
                            },
                            ...header
                          }
                    }
                },
                // stepper,
                formwizardFirstStep: recoveryNoticeFirstStep,
                footer: recoveryNoticefooter
                
            }
        }
    }
}

export default recoveryNotice