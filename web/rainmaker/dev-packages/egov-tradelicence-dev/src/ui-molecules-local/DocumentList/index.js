import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import {
  getFileUrlFromAPI,
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { UploadSingleFile, SimpleModal } from "../../ui-molecules-local";
import { handleFileUpload, getFileSize } from "../../ui-utils/commons"
import { LabelContainer } from "egov-ui-framework/ui-containers";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import Button from "@material-ui/core/Button";
import { LoadingIndicator } from "egov-ui-framework/ui-molecules";

const styles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginBottom: "16px"
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    opacity: 0
  }
});
const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px"
};

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    uploadedIndex: [],
    uploadedDocuments: [],
    showLoader: false,
    open: false
  };

  componentDidMount = () => {
    let {
      prepareFinalObject,
      uploadedDocsInRedux: uploadedDocuments,
      documents
    } = this.props;
    let uploadedDocumentsArranged = uploadedDocuments
    if (uploadedDocuments && Object.keys(uploadedDocuments).length) {
      let simplified = Object.values(uploadedDocuments).map(item => item[0]);
       uploadedDocumentsArranged = documents.reduce((acc, item, ind) => {
        const index = simplified.findIndex(i => i && i.documentType === item.name);
        // !isUndefined(index) && (acc[ind] = [simplified[index]]);
        index > -1 && (acc[ind] = [simplified[index]]);
        return acc;
      }, {});

      const uploadedIndex = Object.keys(uploadedDocumentsArranged).reduce(
        (res, curr) => {
          if (uploadedDocumentsArranged[curr].length > 0) {
            res.push(parseInt(curr)); //returns string so convert to integer
          }
          return res;
        },
        []
      );
      this.setState({
        uploadedDocuments: uploadedDocumentsArranged,
        uploadedIndex
      });
      prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", {
        ...uploadedDocumentsArranged
      });
    }
    getQueryArg(window.location.href, "action") !== "edit" &&
      Object.values(uploadedDocumentsArranged).forEach((item, index) => {
        prepareFinalObject(
          `Licenses[0].tradeLicenseDetail.applicationDocuments[${index}]`,
          { ...item[0] }
        );
      });
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex, uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, tenantId } = this.props;
    const { jsonPath, name } = documents[uploadedDocIndex];
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    uploadedDocuments = {
      ...uploadedDocuments,
      [uploadedDocIndex]: [
        {
          fileName: file.name,
          fileStoreId,
          fileUrl: Object.values(fileUrl)[0],
          documentType: name,
          tenantId
        }
      ]
    };

    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", {
      ...uploadedDocuments
    });
    prepareFinalObject(jsonPath, {
      fileName: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      documentType: name,
      tenantId
    });
    this.setState({ uploadedDocuments, showLoader: false });
    this.getFileUploadStatus(true, uploadedDocIndex);
  };

  changeFile = (key) => async (e) => {
    this.setState({showLoader: true});
    const input = e.target;
    const { maxFileSize } = this.props.inputProps[key]
    if (input.files && input.files.length > 0) {
      const files = input.files;
      Object.keys(files).forEach(async (key, index) => {
        const file = files[key];
        const isSizeValid = getFileSize(file) <= maxFileSize;
        if (!isSizeValid) {
          // SimpleModal(true);
          this.setState(state => ({
            open: true,
            maxFileSizeMsg: `Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`
          }));
        }
      })
    }
    await handleFileUpload(e, this.handleDocument, 
      this.props.inputProps[key], this.stopLoading)
  }

  closeModal = () => {
    this.setState(state => ({
      open: false
    }));
  }

  stopLoading = () => {
    this.setState({showLoader: false})
  }

  removeDocument = remDocIndex => {
    let { uploadedDocuments } = this.state;
    const { prepareFinalObject, documents, preparedFinalObject } = this.props;
    const jsonPath = documents[remDocIndex].jsonPath;
      uploadedDocuments[remDocIndex][0].id &&
      prepareFinalObject("LicensesTemp[0].removedDocs", [
        ...get(preparedFinalObject, "LicensesTemp[0].removedDocs", []),
        {
          ...uploadedDocuments[remDocIndex][0],
          active: false
        }
      ]);
    uploadedDocuments[remDocIndex] = [];
    prepareFinalObject(jsonPath, uploadedDocuments[remDocIndex]);
    prepareFinalObject(
      "LicensesTemp[0].uploadedDocsInRedux",
      uploadedDocuments
    );
    this.setState({ uploadedDocuments });
    this.getFileUploadStatus(false, remDocIndex);
  };

  getFileUploadStatus = (status, index) => {
    const { uploadedIndex } = this.state;
    if (status) {
      uploadedIndex.push(index);
      this.setState({ uploadedIndex });
    } else {
      const deletedIndex = uploadedIndex.findIndex(item => item === index);
      uploadedIndex.splice(deletedIndex, 1);
      this.setState({ uploadedIndex });
    }
  };

  downloadPdf = (fileUrl, fileName) => {
    fetch(fileUrl).then(function(t) {
      return t.blob().then((b)=>{
          var a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.setAttribute("target","_blank");
          a.setAttribute("download", fileName);
          a.click();
      });
    });
  }

  render() {
    const { classes, documents, documentTypePrefix, description ,imageDescription ,inputProps } = this.props;
    const { uploadedIndex,showLoader } = this.state;
    
    return (
      <div>        
      <div style={{ paddingTop: 10 }}>
        {documents &&
          documents.map((document, key) => {
            const currentDocumentProps =  inputProps.filter(item => item.type === document.name);
            return (
              <div
                key={key}
                id={`document-upload-${key}`}
                className={classes.documentContainer}
              >
                <Grid container={true}>
                  <Grid item={true} xs={2} sm={1} align="center">
                    {uploadedIndex.indexOf(key) > -1 ? (
                      <div className={classes.documentSuccess}>
                        <Icon>
                          <i class="material-icons">done</i>
                        </Icon>
                      </div>
                    ) : (
                      <div className={classes.documentIcon}>
                        <span>{key + 1}</span>
                      </div>
                    )}
                  </Grid>
                  <Grid item={true} xs={10} sm={6} align="left">
                    <LabelContainer
                      labelName={documentTypePrefix + document.name}
                      labelKey={documentTypePrefix + document.name}
                      style={documentTitle}
                    />
                    {document.required && (
                      <sup style={{ color: "#E54D42" }}>*</sup>
                    )}
                    <Typography variant="caption">
                      <LabelContainer
                        labelName={"Allowed documents are Aadhar Card / Voter ID Card / Driving License"}
                        labelKey={!!document.statement ? documentTypePrefix + document.statement: ""}
                        />
                    </Typography>
                    <Typography variant="caption">
                      <LabelContainer
                     labelName={currentDocumentProps[0].description.labelName}
                     labelKey={documentTypePrefix + currentDocumentProps[0].description.labelKey}
                      />
                    </Typography>
                  </Grid>
                  <Grid item={true} xs={12} sm={5} align="right">
                    {!!currentDocumentProps[0].downloadUrl ?  
                    <label htmlFor="contained-button-file">
                      <Button onClick={() => this.downloadPdf(currentDocumentProps[0].downloadUrl, document.name)} component="span" className={this.props.classes.button} color="primary" variant="outlined">
                      <LabelContainer labelName={this.props.downloadButtonLabel.labelName}
                     labelKey={this.props.downloadButtonLabel.labelKey} />
                      </Button> 
                    </label> : null}
                    <UploadSingleFile
                      classes={this.props.classes}
                      id={`upload-button-${key}`}
                      handleFileUpload={this.changeFile(key)}
                      uploaded={uploadedIndex.indexOf(key) > -1}
                      removeDocument={() => this.removeDocument(key)}
                      documents={this.state.uploadedDocuments[key]}
                      onButtonClick={() => this.onUploadClick(key)}
                      buttonLabel={this.props.buttonLabel}
                      inputProps={currentDocumentProps[0].formatProps}
                    />
                  </Grid>
                </Grid>
              </div>
            );
          })}
      </div>
      {<SimpleModal open={this.state.open} maxFileSizeMsg={this.state.maxFileSizeMsg} closeModal={this.closeModal}/>}
      {!!showLoader && <LoadingIndicator status={"loading"} />}
      </div>
    );
  }
}

DocumentList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(DocumentList)
);
