import React from "react";
import "../utils/index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getMdmsData } from "../utils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";

const _applicationTypes = [
  {
    "name": "Transfer of Ownership on the basis of Registered Sale/Gift/Exchange/Family Transfer Deed",
    "code": "ES_TRANSFER_OF_OWNERSHIP_REGISTERED_DEED",
    "type": "EstateBranch_OwnershipTransfer_SaleDeed",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Transfer of Ownership on the basis of Registered Will",
    "code": "ES_TRANSFER_OF_OWNERSHIP_REGISTERED_WILL",
    "type": "EstateBranch_OwnershipTransfer_RegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Transfer of Ownership on the basis of Un-registered Will",
    "code": "ES_TRANSFER_OF_OWNERSHIP_UNREGISTERED_WILL",
    "type": "EstateBranch_OwnershipTransfer_UnRegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Transfer of Ownership on the basis of Intestate Death",
    "code": "ES_TRANSFER_OF_OWNERSHIP_INTESTATE_DEATH",
    "type": "EstateBranch_OwnershipTransfer_IntestateDeath",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Transfer of Ownership on the basis of Partnership deed/Dissolution deed/Change of Director in case of Private Limited Company",
    "code": "ES_TRANSFER_OF_OWNERSHIP_PARTNERSHIP_DEED",
    "type": "EstateBranch_OwnershipTransfer_PatnershipDeed",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": "!!property.propertyDetails.entityType && (property.propertyDetails.entityType === 'ET.PUBLIC_LIMITED_COMPANY' || property.propertyDetails.entityType === 'ET.PRIVATE_LIMITED_COMPANY')"
  },
  {
    "name": "Transfer of Ownership on the basis of Court Decree/Family Settlement",
    "code": "ES_TRANSFER_OF_OWNERSHIP_COURT_DECREE",
    "type": "EstateBranch_OwnershipTransfer_FamilySettlement",
    "active": true,
    "filter": "!!property.propertyDetails.decreeDate && !!property.propertyDetails.courtDetails && !!property.propertyDetails.civilTitledAs",
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "No Objection Certificate for Transfer of Lease Rights by way of Sale/Gift/Family Transfer Deed/Exchange Deed",
    "code": "ES_NO_OBJECTION_CERTIFICATE",
    "type": "EstateBranch_OtherCitizenService_NOC",
    "active": true,
    "category": "ES_NO_OBJECTION_NO_DUE_CERTIFICATE",
    "filter": true
  },
  {
    "name": "No Dues Certificate",
    "code": "ES_NO_DUES_CERTIFICATE",
    "type": "EstateBranch_OtherCitizenService_NDC",
    "active": true,
    "category": "ES_NO_OBJECTION_NO_DUE_CERTIFICATE",
    "filter": true
  },
  {
    "name": "Conversion of Property from residential to Commercial (SCF to SCO)",
    "code": "ES_CONVERSION_OF_PROPERTY_RES_TO_COMM",
    "type": "EstateBranch_OtherCitizenService_ScfToSco",
    "active": true,
    "category": "ES_CONVERSION_OF_PROPERTY",
    "filter": "!!property.propertyDetails.entityType && (property.propertyDetails.entityType === 'ET.PUBLIC_LIMITED_COMPANY' || property.propertyDetails.entityType === 'ET.PRIVATE_LIMITED_COMPANY')"
  },
  {
    "name": "Conversion from Leasehold to Freehold Property",
    "code": "ES_CONVERSION_FROM_LEASEHOLD_TO_FREEHOLD",
    "type": "EstateBranch_OtherCitizenService_LeaseholdToFreehold",
    "active": true,
    "category": "ES_CONVERSION_OF_PROPERTY",
    "filter": true
  },
  {
    "name": "Duplicate Allotment Letter/Possession Letter",
    "code": "ES_DUPLICATE_ALLOTMENT_POSSESSION_LETTER",
    "type": "EstateBranch_OtherCitizenService_DuplicateCopy",
    "active": true,
    "filter": true
  },
  {
    "name": "Execution of Lease Deed/Deed of Conveyance",
    "code": "ES_EXECUTION_OF_LEASE_DEED",
    "type": "EstateBranch_OtherCitizenService_LeaseDeed",
    "active": true,
    "filter": true
  },
  {
    "name": "Permission to Mortgage",
    "code": "ES_PERMISSION_TO_MORTGAGE",
    "type": "EstateBranch_OtherCitizenService_Mortgage",
    "active": true,
    "filter": true
  },
  {
    "name": "Change of Trade",
    "code": "ES_CHANGE_OF_TRADE",
    "type": "EstateBranch_OtherCitizenService_ChangeInTrade",
    "active": true,
    "filter": true
  }
]

const getData = async (action, state, dispatch) => {
   await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    const queryObject = {
      MdmsCriteria: {
        tenantId: getTenantId(),
        moduleDetails: [
          {
            moduleName: ESTATE_SERVICES_MDMS_MODULE,
            masterDetails: [
              { name: "applicationTypes" }
            ]
          }
        ]
      }
    }
    const response = await getMdmsData(queryObject);
    const propertyId = getQueryArg(window.location.href, "propertyId")
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const branchType = getQueryArg(window.location.href, "branchType")
    const propertyQueryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const propertyResponse = await getSearchResults(propertyQueryObject)
    try {
      const property = propertyResponse.Properties[0]
      const applicationTypes = response.MdmsRes.EstateServices.applicationTypes
      const listItems = applicationTypes.filter(item => item.branchType === branchType).filter(item => eval(item.filter)).reduce((prev, curr) => {
        if(!!curr.category) {
          let type = {}
          const findIndex = prev.findIndex(item => item.code === curr.category);
          if(findIndex !== -1) {
            type = {...prev[findIndex], SubTypes: [...prev[findIndex].SubTypes, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}]}
            return [...prev.slice(0, findIndex), type, ...prev.slice(findIndex+1)]
          } else {
            type = {code: curr.category, name: curr.category, SubTypes: [{...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}] }
            return [...prev, type]
          }
        } else {
          return [...prev, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}]
        }
      }, [])
    return {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            applyCard: {
              moduleName: "egov-estate",
              uiFramework: "custom-containers-local",
              componentPath: "NestedListContainer",
              props: {
                items: listItems,
                history: {},
                style: {
                  width: "100%"
                },
                gridDefination: {
                  xs: 12,
                  sm: 12
                }
              }
            }
          }
        }
    }
  } catch (error) {
      console.log("error", error)
      return {}
  }
}

const applicationTypesHome = {
  uiFramework: "material-ui",
  name: "application-types",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
    dispatch(toggleSpinner())
        // await getPropertyData(action, state, dispatch)
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "application-types",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "application-types",
            components
          }
        }
  }
}

export default applicationTypesHome