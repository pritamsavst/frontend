import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";
import jp from "jsonpath";
import { getFileUrlFromAPI } from '../../../../modules/commonFunction'
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

class CGBookingDetails extends Component {

callApiForDocumentData = async (e) => {
  const { documentMap,userInfo } = this.props;
  var documentsPreview = [];
  if (documentMap && Object.keys(documentMap).length > 0) {
      let keys = Object.keys(documentMap);
      let values = Object.values(documentMap);
      let id = keys[0],
          fileName = values[0];

      documentsPreview.push({
          title: "DOC_DOC_PICTURE",
          fileStoreId: id,
          linkText: "View",
      });
      let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,changetenantId) : {};


      documentsPreview = documentsPreview.map(function (doc, index) {
          doc["link"] =
              (fileUrls &&
                  fileUrls[doc.fileStoreId] &&
                  fileUrls[doc.fileStoreId].split(",")[0]) ||
              "";

          doc["name"] =
              (fileUrls[doc.fileStoreId] &&
                  decodeURIComponent(
                      fileUrls[doc.fileStoreId]
                          .split(",")[0]
                          .split("?")[0]
                          .split("/")
                          .pop()
                          .slice(13)
                  )) ||
              `Document - ${index + 1}`;
          return doc;
      });
      setTimeout(() => {
          window.open(documentsPreview[0].link);
      }, 100);
      prepareFinalObject('documentsPreview', documentsPreview)
  }
}


  render() {
    const { documentMap } = this.props;
     
return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                
                <Label label="BK_MYBK_PCC_Document" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
              <div className="col-md-4">
                          <Label                                    
                           className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={documentMap && Object.values(documentMap) ? Object.values(documentMap) : "BK_MYBK_PCC_DOCNOT_FOUND"}
                                />
                                <button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
                            </div>        
                          </div>                             
                          </div>
            </div>
        }
      />
    </div>
  );
}
}

const mapStateToProps = state => {

  const { bookings, common, auth, form } = state;
  const { createPACCApplicationData } = bookings;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
  let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";
  const { userInfo } = state.auth;
  return {
      createPACCApplicationData,
      documentMap, bkLocation,userInfo
  }

}
const mapDispatchToProps = dispatch => {
  return {

      createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
      updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
      toggleSnackbarAndSetText: (open, message, error) =>
          dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CGBookingDetails);
