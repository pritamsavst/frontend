import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header:  getCommonParagraph(
  // getCommonTitle(
    {
      labelName: "Email Attachment",
      labelKey: "PR_EMAIL_ATTACHMENT_HEADER"
    },
    {
      style: {
        marginBottom: 10
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload and 1MB max file size.",
    labelKey: "PR_EMAILDOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pr",
    componentPath: "DocumentListTenderContainer",
    
    props: {      
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PR_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      description: "Only .jpg and .pdf files. 1MB max file size.",
      inputProps: {
        accept: ".pdf,.png,.jpeg,.zip,WAV, AIFF, AU, PCM or BWF, mp3"
      },
      maxFileSize: 2000
    },
    type: "array"
  } 

});