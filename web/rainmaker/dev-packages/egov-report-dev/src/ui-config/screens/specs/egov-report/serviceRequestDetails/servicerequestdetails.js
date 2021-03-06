import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getPattern, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { NumberOfTreesInPruning, TypeOfServiceRequest } from "../../../../../ui-utils/commons";
import "./index.css";


const getMapLocator = textSchema => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hc",
    componentPath: "MapLocator",
    props: {}
  };
};
const showHideMapPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["servicerequest"],
    "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.mapsDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "servicerequest",
      "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.mapsDialog",
      "props.open",
      !toggle
    )
  );
};
const setRadioButtonFeatures = (currentSelectedServiceType, state, dispatch) => {
  if(currentSelectedServiceType.value ===TypeOfServiceRequest.REMOVALOFDEADDRY )
  {
              dispatch(handleField("servicerequest",
              "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
              "props.buttons[0].disabled",
              false
            )
          );
          dispatch(handleField("servicerequest",
              "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
              "props.buttons[1].disabled",
              false
            )
          );
          dispatch(handleField("servicerequest",
              "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
              "props.buttons[2].disabled",
              false
            )
          );

    }
        else
          {
            dispatch(handleField("servicerequest",
            "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
            "props.buttons[0].disabled",
            true
          )
        );
        dispatch(handleField("servicerequest",
            "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
            "props.buttons[1].disabled",
            true
          )
        );
        dispatch(handleField("servicerequest",
            "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
            "props.buttons[2].disabled",
            true
          )
        );
        dispatch(handleField("servicerequest",
        "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
        "props.value",
        undefined
        )
        );
        };
      }

const setNumberOfTreesForPruning = (currentSelectedServiceType, state, dispatch) => {
  if(currentSelectedServiceType.value ===TypeOfServiceRequest.PRUNLESSTHAN90 || currentSelectedServiceType.value ===TypeOfServiceRequest.PRUNMORETHAN90 ){
        dispatch(handleField("servicerequest",
        "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
        "props.value",
        NumberOfTreesInPruning.DefaultTrees
      ))
      dispatch(handleField("servicerequest",
      "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
      "props.disabled",
      true
    ))
  }
  else{
    dispatch(handleField("servicerequest",
    "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
    "props.disabled",
    false
  ))
    
  dispatch(handleField("servicerequest",
        "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
        "props.value",
        NumberOfTreesInPruning.DefaultTrees
      ))
  }
};
export const servicerequestdetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Service Request Details",
      labelKey: "HC_SERVICE_REQUEST_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),


  break: getBreak(),
  servicerequestdetailsContainer: getCommonContainer({
  typeofrequest: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hc",
      componentPath: "AutosuggestContainer",
      jsonPath: "SERVICEREQUEST.serviceType",
            required: true,
            gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg:12
                  },
    props: {
    style: {
    width: "100%",
    cursor: "pointer"
    },
   
    className: "citizen-city-picker",
    label: { labelName: "Service Request Type", labelKey: "HC_SERVICE_REQUEST_TYPE" },
    placeholder: {
      labelName: "Select Service Request Type",
      labelKey: "HC_SERVICE_REQUEST_TYPE_PLACEHOLDER"
    },
    sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceType",
    jsonPath: "SERVICEREQUEST.serviceType",
    maxLength:5,
    labelsFromLocalisation: false,
    suggestions: [],
    fullwidth: true,
    required: true,
    inputLabelProps: {
      shrink: true
    },
    isMulti: false,
    labelName: "name",
    valueName: "name"
    },
    
    afterFieldChange: (action, state, dispatch) => {
      var currentSelectedServiceType = get(state, "screenConfiguration.preparedFinalObject.SERVICEREQUEST.serviceType")
    
      if (currentSelectedServiceType.value != undefined)
      {
        setRadioButtonFeatures(currentSelectedServiceType, state, dispatch)
        setNumberOfTreesForPruning(currentSelectedServiceType, state, dispatch)
      }
    }
    
  },
  serviceRequestSubtype: {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "SERVICEREQUEST.subType",
     
    props: {
      label: {
        name: "Subtype",
        key: "HC_SERVICE_REQUEST_SUBTYPE"
      },
      buttons: [
       
        {
          labelName: "DEAD",
          labelKey: "HC_COMMON_SUBTYPE_DEAD",
          disabled: true,
          value: "DEAD"
        },
        {
          labelName: "DANGEROUS",
          labelKey: "HC_COMMON_SUBTYPE_DANGEROUS",
          disabled: true,
          value: "DANGEROUS"
        },
        {
          labelName: "DRY",
          labelKey: "HC_COMMON_SUBTYPE_DRY",
          disabled: true,
          value: "DRY"
        }
      ],
      jsonPath:"SERVICEREQUEST.subType",
      required: false
    },
    required: false,
    type: "array",
    
  },
  nooftrees:{
    ...getTextField({
       label:{
          labelName:"No. of Trees for Cutting/Prunning/Removal",
          labelKey:"HC_NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL_LABEL"
       },
       placeholder:{
          labelName:"Enter No. of Trees for Cutting/Prunning/Removal",
          labelKey:"HC_NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL_PLACEHOLDER"
       },
       gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
        lg:12
      },
       required:true,
       pattern:getPattern("NoOfTree"),
       errorMessage:"ERR_INVALID_NUMBER_OF_TREES_FIELD_MSG",
       jsonPath:"SERVICEREQUEST.treeCount"
    })
  },
  details:{
    ...getTextField({
       label:{
          labelName:"Service Request Additional Details",
          labelKey:"HC_SERVICE_REQUEST_ADDITIONAL_DETAILS_LABEL"
       },
       placeholder:{
          labelName:"Enter Service Request Additional Details",
          labelKey:"HC_SERVICE_REQUEST_ADDITIONAL_DETAILS_LABEL_PLACEHOLDER"
       },
       gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
        lg:12
      },
      props:{
        className: "textfield-enterable-selection",
        multiline: true,
        rows: "4"
      },
       required:true,
       pattern:getPattern("serviceRequestDescription"),
       errorMessage:"ERR_INVALID_SERVICE_REQUEST_DESCRIPTION_FIELD_MSG",
       jsonPath:"SERVICEREQUEST.description"
    })
  },
  SILocationDetailsConatiner: getCommonContainer({
    propertyGisCoordinates:
    {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "gis-div-css",
        style: {
          width: "100%",
          cursor: "pointer"
        },
        jsonPath:
          "SERVICEREQUEST.address"
      },
      jsonPath: "SERVICEREQUEST.latitude",
      onClickDefination: {
        action: "condition",
        callBack: showHideMapPopup
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
        lg:12
      },
      children: {
        gisTextField: {
          ...getTextField({
            label: {
              labelName: "Locate on Map",
              labelKey: "HC_VIOLATION_DETAILS_GIS_CORD_LABEL"
            },
            placeholder: {
              labelName: "Select your property location on map",
              labelKey: "HC_VIOLATION_DETAILS_GIS_CORD_PLACEHOLDER"
            },
            jsonPath:
              "SERVICEREQUEST.latitude",
            iconObj: {
              iconName: "gps_fixed",
              position: "end"
            },
            gridDefination: {
              xs: 12,
              sm: 12
            },
            required:true,
            props: {
              disabled: true,
              cursor: "pointer",
              jsonPath:
                "SERVICEREQUEST.latitude"
            }
          })
        }
      }
    }
  }),
  mapsDialog: {
    componentPath: "Dialog",
    props: {
      open: false
    },
    children: {
      dialogContent: {
        componentPath: "DialogContent",
        children: {
          popup: getMapLocator()
        }
      }
    }

  },
 
  
  locality: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-hc",
    componentPath: "AutosuggestContainer",
    jsonPath: "SERVICEREQUEST.mohalla",
          required: true,
          gridDefination: {
                  xs: 12,
                  sm: 12,
                  md: 12,
                  lg:12
                },
  props: {
  style: {
  width: "100%",
  cursor: "pointer"
  },
 
  className: "citizen-city-picker",
  label: {
    labelName: "Locality/Mohalla",
    labelKey: "HC_LOCALITY_MOHALLA_LABEL"
  }, 
  placeholder: {
    labelName: "Select Locality/Mohalla",
    labelKey: "HC_LOCALITY_MOHALLA_LABEL_PLACEHOLDER"
  },
  sourceJsonPath: "applyScreenMdmsData.RAINMAKER-PGR.Sector",
  jsonPath: "SERVICEREQUEST.mohalla",
 
  labelsFromLocalisation: false,
  suggestions: [],
  fullwidth: true,
  required: true,
  inputLabelProps: {
    shrink: true
  },
  isMulti: false,
  labelName: "name",
  valueName: "name"
  },
},
  houseno:{
      ...getTextField({
         label:{
            labelName:"House No. and Street Name",
            labelKey:"HC_HOUSE_NO_STREET_NAME_LABEL"
         },
         placeholder:{
            labelName:"Enter House no and Street Name",
            labelKey:"HC_HOUSE_NO_STREET_NAME_LABEL_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
         required:true,
         pattern:getPattern("location"),
         errorMessage:"ERR_INVALID_HOUSE_NO._STREET_NAME_FIELD_MSG",
         jsonPath:"SERVICEREQUEST.houseNoAndStreetName"
      })
    },
    landmark:{
      ...getTextField({
         label:{
            labelName:"Landmark",
            labelKey:"HC_LANDMARK_LABEL"
         },
         placeholder:{
            labelName:"Enter Landmark",
            labelKey:"HC_LANDMARK_LABEL_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
        pattern:getPattern("location"),
         errorMessage:"ERR_INVALID_LANDMARK_FIELD_MSG",
         jsonPath:"SERVICEREQUEST.landmark"
      }),
      

    },
  })
});

