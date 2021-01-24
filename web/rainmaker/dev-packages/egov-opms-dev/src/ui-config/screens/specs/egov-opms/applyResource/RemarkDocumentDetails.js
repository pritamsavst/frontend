import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const RemarkDocumentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "PET_REMARK_DOCUMENT_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "PET_REMARK_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-opms",
    componentPath: "DocumentListContainer",
    props: {
      RemarksDocuments: [
        {
          name: "Identity Proof ",
          required: true,
          jsonPath: "PetNOC.documents.remarkProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [
              { value: "AADHAAR", label: "Aadhaar Card" },
              { value: "VOTERID", label: "Voter ID Card" },
              { value: "DRIVING", label: "Driving License" }
            ]
          }
        },        
      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      description: "Only .jpg and .pdf files. 1MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 1000
    },
    type: "array"
  } 
});
