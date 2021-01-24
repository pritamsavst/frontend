import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { handleSubmit,handleReject,handlesave,handleApprove,handleDelete } from "./functions";

const gotoCreateFlow = (state, dispatch) => {
  const createUrl = `/egov-nulm/log-maintenance`;
  dispatch(setRoute(createUrl));
};

const getCommonCreateFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};
export const buttonController = () => {
    return {
      saveButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
             minWidth: "200px",
            height: "48px",
            marginRight: "16px",
          },
        },
        children: {
          resetButtonLabel: getLabel({
            labelName: "Save",
            labelKey: "NULM_COMMON_SAVE_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: handlesave,
        },
        visible: false,
      },
      submitButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "HR_SUBMIT_LABEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: handleSubmit
        }
      }
    };
};

export const poCommonFooter = () => {
  return getCommonCreateFooter({
    ...buttonController(),
  });
};

const getRoleBaseViewButton = () => {
  if (process.env.REACT_APP_NAME === "Employee")
  return {
    rejectButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
           //minWidth: "200px",
          height: "48px",
          marginRight: "16px",
        },
      },
      children: {
        resetButtonLabel: getLabel({
          labelName: "Reject",
          labelKey: "NULM_COMMON_REJECT_BUTTON",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: handleReject,
      },
      visible: false,
    },
    approvedButton: {
      componentPath: "Button",
      props: {
        variant: "outlined", 
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "16px",
        },
      },
      children: {
        updateButtonLabel: getLabel({
          labelName: "Approved",
          labelKey: "NULM_COMMON_APPROVED_BUTTON",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: handleApprove,
      },
      visible: false,
    },
  };
else  return {
  deleteButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
         minWidth: "200px",
        height: "48px",
        marginRight: "16px",
      },
    },
    children: {
      resetButtonLabel: getLabel({
        labelName: "Delete",
        labelKey: "NULM_COMMON_DELETE_BUTTON",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: handleDelete,
    },
    visible: true,
  }
}
}

export const poViewFooter = () => {
  return getCommonCreateFooter({
    ...getRoleBaseViewButton(),
    editDetails: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        editDetailsButtonLabel: getLabel({
          labelName: "EDIT DETAILS",
          labelKey: "HR_EDIT_DETAILS_LABEL"
        }),
        editDetailsButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: gotoCreateFlow
      },
      visible: false,
    }
  });
};
