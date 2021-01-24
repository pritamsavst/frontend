import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { changeStep } from "./footer";
import {
  changeStep as changeStepAllotment
} from "./footerAllotment"

export const getReviewDocuments = (isEditable = true, screenkey, sourceJsonPath = "PropertiesTemp[0].reviewDocData", step = 3) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Documents",
            labelKey: "ES_COMMON_DOCS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          visible: isEditable,
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "ES_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              if (screenkey == "apply") {
                changeStep(state, dispatch, screenkey, "", step);
              }
              else if (screenkey == "allotment") {
                changeStepAllotment(state, dispatch, screenkey, "", step)
              }
            }
          }
        },
        documents: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "DownloadFileContainer",
          props: {
            sourceJsonPath,
            className: "review-documents"
          }
        }
      }
    }
  });
};