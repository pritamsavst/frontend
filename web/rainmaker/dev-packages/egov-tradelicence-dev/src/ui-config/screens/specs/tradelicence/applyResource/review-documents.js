import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { changeStep } from "./footer";

export const getReviewDocuments = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          gridDefination: {
            xs: 8,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Documents",
            labelKey: "TL_COMMON_DOCS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary",
            style: {
              padding: "0px 16px",
              minHeight: "initial"
            }
          },
          gridDefination: {
            xs: 4,
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
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        },
        documents: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-tradelicence",
          componentPath: "DownloadFileContainer",
          props: {
            sourceJsonPath: "LicensesTemp[0].reviewDocData",
            className: "review-documents"
          }
        }
      }
    }
  });
};