import React, { Component } from "react";
import { connect } from "react-redux";
import { FilePicker, Icon, Image, LoadingIndicator } from "egov-ui-kit/components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { getFileSize, isFileImage } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import { fileUpload, removeFile } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import "./index.css";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";
const iconStyle = {
  width: "19px",
  height: "19px",
  fontSize: "12px",
};

const labelStyle = {
  letterSpacing: "0.6px",
  lineHeight: 1,
  margin: "0 auto",
  width: "75px",
};
const inlineLabelStyle = {
  letterSpacing: "0.6px",
  lineHeight: 1,
  margin: "0 auto",
};

const Placeholder = ({ className, onFilePicked, inputProps, hide }) => {
  return (
    <div className={`${className} upload-placeholder`} style={hide ? { visibility: "hidden" } : {}}>
      <FilePicker inputProps={{ ...inputProps, multiple: false }} handleimage={onFilePicked}>
        <FloatingActionButton backgroundColor="#767676" iconStyle={{ height: "40px", width: "40px" }} style={{ boxShadow: 0, marginBottom: "4px" }}>
          <Icon id="image-upload" name="add-a-photo" action="image" style={{ height: "20px", width: "20px" }} color={"#ffffff"} />
        </FloatingActionButton>
        <Label label="CS_COMMON_UPLOAD_PHOTOS" labelStyle={labelStyle} fontSize="12px" />
      </FilePicker>
    </div>
  );
};

class ImageUpload extends Component {
  fillPlaceholder = (images, onFilePicked, inputProps) => {
    const {imageLength = 3} = this.props
    const placeholders = [];
    if(getapplicationType() === "HORTICULTURE" || getapplicationType() === "HORTICULTUREWF" ||  getapplicationType() === "egov-echallan" )
    {
      for (let i = 0; i < 5 - images.length; i++) {
        placeholders.push(<Placeholder key={i} inputProps={inputProps} onFilePicked={onFilePicked} hide={i === 1 ? false : false} />);
      }
    }
    else{
      for (let i = 0; i < imageLength - images.length; i++) {
        placeholders.push(<Placeholder key={i} inputProps={inputProps} onFilePicked={onFilePicked} hide={this.props.hasOwnProperty("hide") ? this.props.hide : i === 1 ? true : false} />);
      }
    }
    return placeholders;
  };

  removeImage = (fileIndex) => {
    const { formKey, fieldKey, removeFile } = this.props;
    removeFile(formKey, fieldKey, fileIndex);
  };

  onFilePicked = (file, imageUri) => {
    const { images, formKey, fieldKey, module, fileUpload, toggleSnackbarAndSetText, MAX_IMAGE_SIZE = 5000, imageLength = 3,labelKey = "RP_ERR_FILE_MORE_THAN_FIVEMB" } = this.props;
    const fileSize = getFileSize(file);
    const isImage = isFileImage(file);
    if (!isImage) {
      toggleSnackbarAndSetText(true, { labelName: "The file is not a valid image", labelKey: "RP_ERR_NOT_VALID_IMAGE" }, "error");
    } else if (fileSize > MAX_IMAGE_SIZE) {
      let code = labelKey
      if(getapplicationType() === "egov-echallan" )
      {
        code ="COMMON_ERR_FILE_MORE_THAN_FIVEMB"
      }
      toggleSnackbarAndSetText(true, { labelName: "The file is more than 5mb", labelKey: code },"error");
      
    } else {
      if(getapplicationType() === "HORTICULTURE" || getapplicationType() === "HORTICULTUREWF" ||  getapplicationType() === "egov-echallan" ){
        if (images.length < 5) {
          fileUpload(formKey, fieldKey, { module, file, imageUri });
        }
      }else{
        if (images.length < imageLength) {
          fileUpload(formKey, fieldKey, { module, file, imageUri });
        }
      }
    }
  };

  render() {
    const { onFilePicked, removeImage } = this;
    const { images, loading , labelKey = "RP_ERR_FILE_MORE_THAN_FIVEMB"} = this.props;
    let {imageLength =  3} = this.props ;
    if(getapplicationType() === "HORTICULTURE" || getapplicationType() === "HORTICULTUREWF" ||  getapplicationType() === "egov-echallan"){
      imageLength = 5 ;
    }
    const inputProps = { accept: "image/*", maxFiles: imageLength, multiple: true };

    return (
      <div >
        {loading && <LoadingIndicator />}
        {!images.length ? (
          <FilePicker inputProps={inputProps} handleimage={onFilePicked}  className="upload-photo-overlay">
            <div className="upload-icon-cont">
              <Icon id="image-upload" action="image" name="add-a-photo" style={iconStyle} color={"#ffffff"} />
            </div>
            <Label label="CS_COMMON_UPLOAD_PHOTOS" labelStyle={labelStyle} fontSize="12px" />
          </FilePicker>
        ) : (
          <div  className="upload-photo-overlay">
          <div className="upload-image">
            {images.map((image, index) => {
              return (
                <div key={index} className="upload-image-cont" style={{border: "1px solid black",borderStyle: "dotted"}}>
                  <Image source={image.imageUri} style={{ height: "100px" }} />
                  <div className="image-remove" onClick={() => removeImage(index)}>
                    <Icon id="image-close-icon" action="navigation" name="close" color="#ffffff" style={{ width: "14px", height: "14px" }} />
                  </div>
                </div>
               
              );
            })}
            {this.fillPlaceholder(images, onFilePicked, inputProps)}
          </div>
          </div>
        )}
        <Label label={labelKey} labelStyle={inlineLabelStyle} fontSize="12px" />
      </div>
      
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const images = (state.form[ownProps.formKey] && state.form[ownProps.formKey].files && state.form[ownProps.formKey].files[ownProps.fieldKey]) || [];
  const loading = images.reduce((loading, file) => {
    return loading || file.loading;
  }, false);
  return { images, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    fileUpload: (formKey, fieldKey, module, fileObject) => dispatch(fileUpload(formKey, fieldKey, module, fileObject)),
    removeFile: (formKey, fieldKey, index) => dispatch(removeFile(formKey, fieldKey, index)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUpload);
