import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  convertDateToEpoch,  
} from "../../utils";
const serviceDetailsCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      serviceDetailsCardContainer: getCommonContainer(
        {
          status: {
            ...getSelectField({
              label: {
                labelName: "Status",
                labelKey: "HR_STATUS_LABEL"
              },
              placeholder: {
                labelName: "Select Status",
                labelKey: "HR_STATUS_PLACEHOLDER"
              },
              required: true,
              jsonPath: "Employee[0].serviceHistory[0].serviceStatus",
              sourceJsonPath: "createScreenMdmsData.egov-hrms.EmployeeStatus",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                className: "hr-generic-selectfield",
                jsonPath: "Employee[0].serviceHistory[0].serviceStatus",
                // data: [
                //   {
                //     value: "Value 1",
                //     label: "Value 1"
                //   },
                //   {
                //     value: "Value 2",
                //     label: "Value 2"
                //   }
                // ],
                optionValue: "code",
                optionLabel: "status"
                // hasLocalization: false
              },
              localePrefix: {
                moduleName: "egov-hrms",
                masterName: "EmployeeStatus"
              }
            })
          },
          serviceFromDate: {
            ...getDateField({
              label: {
                labelName: "Service From Date",
                labelKey: "HR_SER_FROM_DATE_LABEL"
              },
              placeholder: {
                labelName: "Service From Date",
                labelKey: "HR_SER_FROM_DATE_LABEL"
              },
              required: true,
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].serviceHistory[0].serviceFrom",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                jsonPath: "Employee[0].serviceHistory[0].serviceFrom"
                // inputProps: {
                //   min: getTodaysDateInYMD(),
                //   max: getFinancialYearDates("yyyy-mm-dd").endDate
                // }
              }
            }),
            afterFieldChange: (action, state, dispatch) => { 
              
              if(action.value){
                let serviceToDtComponentPath = action.componentJsonpath;
                const appntDate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfAppointment).getTime();
                const annuationdate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfSuperannuation).getTime();
                const serviceFromdDt = new Date(action.value).getTime();
                // if( !(annuationdate >= serviceFromdDt && serviceFromdDt >= appntDate)){
                //   dispatch(toggleSnackbar(true, {
                //     labelName: "Date Must lie between Appointment date and Annuation date",
                //     labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
                //   }, "error"));
                // }
                if( (serviceFromdDt>=annuationdate || serviceFromdDt<appntDate)){
                  dispatch(toggleSnackbar(true, {
                    labelName: "Date Must lie between Appointment date and Annuation date",
                    labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
                  }, "warning"));
                  dispatch(prepareFinalObject("ValidServicedDt",false));
                  
                }
                else{
                  dispatch(prepareFinalObject("ValidServicedDt",true));
                }
               // const serviceTodDt = new Date(action.value).getTime();
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                //alert(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[cardIndex].serviceFrom);
                if(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[cardIndex].serviceTo)
                {
                const serviceTodDt = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[cardIndex].serviceTo).getTime();
                if( (serviceTodDt>=annuationdate || serviceTodDt<appntDate)){
                  dispatch(toggleSnackbar(true, {
                    labelName: "Date Must lie between Appointment date and Annuation date",
                    labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
                  }, "warning"));
                  
                  dispatch(prepareFinalObject("ValidServicedDt",false));
                  
                }
              }
            }
            }
          },
          serviceToDate: {
            ...getDateField({
              label: {
                labelName: "Service To Date",
                labelKey: "HR_SER_TO_DATE_LABEL"
              },
              placeholder: {
                labelName: "Service To Date",
                labelKey: "HR_SER_TO_DATE_LABEL"
              },
              required: true,
              pattern: getPattern("Date"),
              jsonPath: "Employee[0].serviceHistory[0].serviceTo",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                jsonPath: "Employee[0].serviceHistory[0].serviceTo"
                // inputProps: {
                //   min: getTodaysDateInYMD(),
                //   max: getFinancialYearDates("yyyy-mm-dd").endDate
                // }
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              if(action.value){
                let serviceToDtComponentPath = action.componentJsonpath;
                const appntDate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfAppointment).getTime();
                const annuationdate = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].dateOfSuperannuation).getTime();
                const serviceTodDt = new Date(action.value).getTime();
                // if( !(annuationdate >= serviceTodDt && serviceTodDt >= appntDate)){
                //   dispatch(toggleSnackbar(true, {
                //     labelName: "Date Must lie between Appointment date and Annuation date",
                //     labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
                //   }, "error"));
                  
                // }
                if( (serviceTodDt>annuationdate || serviceTodDt<appntDate)){
                  dispatch(toggleSnackbar(true, {
                    labelName: "Date Must lie between Appointment date and Annuation date",
                    labelKey: "SERVICE_DATE_TO_LIE_BETWEEN_ANNUATION_DATE_APPOINTMNET_DATE"
                  }, "warning"));
                  
                  dispatch(prepareFinalObject("ValidServicedDt",false));
                  
                }
                else{
                  dispatch(prepareFinalObject("ValidServicedDt",true));
                }
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                //alert(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[cardIndex].serviceFrom);
                const serviceFromDt = new Date(state.screenConfiguration.preparedFinalObject.Employee[0].serviceHistory[cardIndex].serviceFrom).getTime();
                if( (serviceTodDt<=serviceFromDt)){
                  dispatch(toggleSnackbar(true, {
                    labelName: "Service To Date greater then Service From Date",
                    labelKey: "SERVICE_DATE_TO_VALIDATIOM"
                  }, "warning"));
                  dispatch(prepareFinalObject("ValidServiceTodDt",false));
                }
                else{
                  dispatch(prepareFinalObject("ValidServiceTodDt",true));
                }
            }
            }
          },
          location: {
            ...getTextField({
              label: {
                labelName: "Location",
                labelKey: "HR_LOCATION_LABEL"
              },
              placeholder: {
                labelName: "Select Location",
                labelKey: "HR_LOCATION_PLACEHOLDER"
              },
              jsonPath: "Employee[0].serviceHistory[0].location",
              gridDefination: {
                xs: 12,
                sm: 4
              },
              props: {
                //   className: "hr-generic-selectfield",
                jsonPath: "Employee[0].serviceHistory[0].location"
                //   data: [
                //     {
                //       value: "ch.chandigarh",
                //       label: "Amritsar"
                //     }
                //   ],
                //   optionValue: "value",
                //   optionLabel: "label"
              }
            })
          },
          orderNo: {
            ...getTextField({
              label: {
                labelName: "Order No",
                labelKey: "HR_ORDER_NO_LABEL"
              },
              placeholder: {
                labelName: "Enter Order No",
                labelKey: "HR_ORDER_NO_PLACEHOLDER"
              },
              pattern: getPattern("TradeName") || null,
              jsonPath: "Employee[0].serviceHistory[0].orderNo",
              props: {
                jsonPath: "Employee[0].serviceHistory[0].orderNo"
              }
            }),
            gridDefination: {
              xs: 12,
              sm: 4
            }
          },
          currentlyWorkingHere: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-hrms",
            componentPath: "SwitchWithLabel",
            jsonPath: "Employee[0].serviceHistory[0].isCurrentPosition",
            props: {
              items: [
                {
                  label: {
                    labelName: "Currently Working Here",
                    labelKey: "HR_CURRENTLY_WORKING_HERE_SWITCH_LABEL"
                  }
                }
              ],
              SwitchProps: {
                color: "primary"
              },
              jsonPath: "Employee[0].serviceHistory[0].isCurrentPosition"
            },
            beforeFieldChange: (action, state, dispatch) => {
              let assignToComponentPath = action.componentJsonpath.replace(
                ".currentlyWorkingHere",
                ".serviceToDate"
              );
              if (action.value) {
                dispatch(
                  handleField(
                    "create",
                    assignToComponentPath,
                    "props.value",
                    null
                  )
                );
                dispatch(
                  handleField(
                    "create",
                    assignToComponentPath,
                    "props.disabled",
                    true
                  )
                );
              } else {
                dispatch(
                  handleField(
                    "create",
                    assignToComponentPath,
                    "props.disabled",
                    false
                  )
                );
              }
            }
          }
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    onMultiItemAdd: (state, muliItemContent) => {
      let preparedFinalObject = get(
        state,
        "screenConfiguration.preparedFinalObject",
        {}
      );
      let cardIndex = get(muliItemContent, "serviceFromDate.index");
      let cardId = get(
        preparedFinalObject,
        `Employee[0].assignments[${cardIndex}].id`
      );
        Object.keys(muliItemContent).forEach(key => {         
          if (key === "serviceFromDate") {
          let employeeObject = get(
            state.screenConfiguration.preparedFinalObject,
            "Employee",
            []
          );
        let serviceFromDate = convertDateToEpoch(get(employeeObject[0], "dateOfAppointment"))// convertDateToEpoch(action.value, "dayStart")
       
               
        set(muliItemContent[key], "props.value", new Date(serviceFromDate).toISOString().slice(0, 10));
        
        }

        if(key === "currentlyWorkingHere")
        {
          let isCurrentPosition = get(
            state.screenConfiguration.preparedFinalObject,
            `Employee[0].serviceHistory[${cardIndex}].isCurrentPosition`,
            []
          );
          if(isCurrentPosition)
          set(muliItemContent["serviceToDate"], "props.disabled", true);
          else
          set(muliItemContent["serviceToDate"], "props.disabled", false);

        }
        
       
        });
      
      return muliItemContent;
    },
    items: [],
    addItemLabel: {
      labelName: "ADD SERVICE ENTRY",
      labelKey: "HR_ADD_SERVICE_ENTRY"
    },
    headerName: "Service",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Employee[0].serviceHistory",
    prefixSourceJsonPath:
      "children.cardContent.children.serviceDetailsCardContainer.children",
    disableDeleteIfKeyExists: "id"
  },
  type: "array"
};

export const serviceDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Service Details",
      labelKey: "HR_SER_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subheader: getCommonSubHeader({
    labelName:
      "Verify entered details before submission. Service details cannot be edited once submitted.",
    labelKey: "HR_SER_DET_SUB_HEADER"
  }),

  serviceDetailsCard
});
