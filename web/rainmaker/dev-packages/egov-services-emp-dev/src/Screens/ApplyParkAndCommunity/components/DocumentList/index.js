import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Card, TextField,Button } from "components";
import {
    LabelContainer,
    TextFieldContainer,
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrlFromAPI,
    handleFileUpload,
    getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import UploadSingleFile from "../UploadSingleFile";
import "./index.css";

const themeStyles = (theme) => ({
    documentContainer: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "16px",
    },
    documentCard: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "16px",
    },
    documentSubCard: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "10px",
        border: "#d6d6d6",
        borderStyle: "solid",
        borderWidth: "1px",
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
        lineHeight: "24px",
    },
    documentSuccess: {
        borderRadius: "100%",
        width: "36px",
        height: "36px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#39CB74",
        color: "white",
    },
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none",
    },
    iconDiv: {
        display: "flex",
        alignItems: "center",
    },
    descriptionDiv: {
        display: "flex",
        alignItems: "center",
    },
    formControl: {
        minWidth: 250,
        padding: "0px",
    },
    fileUploadDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingTop: "5px",
    },
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px"
    },
    input: {
        display: "none !important"
    }


});

const styles = {
    documentTitle: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "16px",
        fontWeight: 500,
        letterSpacing: "0.67px",
        lineHeight: "19px",
        paddingBottom: "5px",
    },
    documentName: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "16px",
        fontWeight: 400,
        letterSpacing: "0.67px",
        lineHeight: "19px",
    },
    dropdownLabel: {
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: "12px",
    },
};

const requiredIcon = (
    <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {

    state = {
        uploadedDocIndex: 0,
        documentsUploadRedux: [
            {
                documentCode: "BK_DOC.DOC_PICTURE",
                documentType: "DOC",
                isDocumentRequired: false,
                isDocumentTypeRequired: false,
                mendatoryDoc : false,
                mydocstate : false
            }
        ]
    };

    componentDidMount = () => {
        const {
            documentsList, buttonLabel, description, inputProps, maxFileSize, documentsUploadReduxOld, documentsUploadRedux, handleChange,
            prepareFinalObject
        } = this.props;
        let index = 0;

        documentsList.forEach((docType) => {
            docType.cards &&
                docType.cards.forEach((card) => {
                    if (card.subCards) {
                        card.subCards.forEach((subCard) => {
                            let oldDocType = get(
                                documentsUploadRedux,
                                `[${index}].documentType`
                            );
                            let oldDocCode = get(
                                documentsUploadRedux,
                                `[${index}].documentCode`
                            );
                            let oldDocSubCode = get(
                                documentsUploadRedux,
                                `[${index}].documentSubCode`
                            );
                            if (
                                oldDocType != docType.code ||
                                oldDocCode != card.name ||
                                oldDocSubCode != subCard.name
                            ) {
                                documentsUploadRedux[index] = {
                                    documentType: docType.code,
                                    documentCode: card.name,
                                    documentSubCode: subCard.name,
                                };
                            }
                            index++;
                        });
                    } else {
                        let oldDocType = get(
                            documentsUploadRedux,
                            `[${index}].documentType`
                        );
                        let oldDocCode = get(
                            documentsUploadRedux,
                            `[${index}].documentCode`
                        );
                        if (
                            oldDocType != docType.code ||
                            oldDocCode != card.name
                        ) {
                           
                            let newDocumentData = {
                                documentType: docType.code,
                                documentCode: card.name,
                             isDocumentRequired: card.required,
                                isDocumentTypeRequired: card.dropdown
                                    ? card.dropdown.required
                                    : false,
                             mydocstate: false
                            };
                           
                            documentsUploadRedux[index] = { ...newDocumentData };
                        }
                        index++;
                    }
                });
        });
        prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
      
    };

    onUploadClick = (uploadedDocIndex) => {
        const { fetchUploadedDoc, userInfo } = this.props;
            this.setState({ uploadedDocIndex });
    };

    handleDocument = async (file, fileStoreId) => {
        let { uploadedDocIndex } = this.state;
        let documentMap = {};
        const { prepareFinalObject, documentsUploadRedux, fetchUploadedDoc, userInfo } = this.props;
       
        documentMap[`${fileStoreId}`] = file.name;

        this.props.prepareFinalObject(
            "documentMap",
            documentMap
        );

        this.setState({
            documentMap: documentMap
        })
        let documentMap2 = [{ fileStoreId: file.name }]

        const fileUrl = await getFileUrlFromAPI(fileStoreId);
            prepareFinalObject("documentsUploadRedux", {
                ...documentsUploadRedux,
                [uploadedDocIndex]: {
                    ...documentsUploadRedux[uploadedDocIndex],
                    mydocstate : true,
                    documents: [
                        {
                            fileName: file.name,
                            fileStoreId,
                            fileUrl: Object.values(fileUrl)[0],
                            mendatoryDoc: true
                        },
                    ],
                },
            });


    };

    removeDocument = (remDocIndex) => {  
        const { prepareFinalObject } = this.props;
    
        this.props.prepareFinalObject(
            "documentMap",
            "Document Not Found"
        );
        prepareFinalObject(
            `documentsUploadRedux.${remDocIndex}.mydocstate`,
            false
        );
        prepareFinalObject(
            `documentsUploadRedux.${remDocIndex}.documents`,
            undefined
        );
        this.forceUpdate();
    };

    handleChangeTwo = (key, event) => {
       
        const { documentsUploadRedux, prepareFinalObject } = this.props;  
        prepareFinalObject(`documentsUploadRedux`, {
            ...documentsUploadRedux,
            [key]: {
                ...documentsUploadRedux[key],
                dropdown: { value: event.target.value },
            },
        });
    };

    getUploadCard = (card, key) => {
       
        let { classes, documentsUploadRedux } = this.props;
        documentsUploadRedux.documents = documentsUploadRedux;
        let jsonPath = `documentsUploadRedux[${key}].dropdown.value`;
        return (
            <div>
                <Label
                    label="BK_MYBK_REQUIRED_DOC_HEADING"
                    color="#000000"
                    fontSize="21px"
                    alignItems="left"
                    labelClassName={"myDOC"}                   
                />
                <Label label="BK_MYBK_DOCUMENT_VALIDATION_MSG"
                />
                <Grid container={true}>
                    <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
                        {documentsUploadRedux[key] &&
                            documentsUploadRedux[key].documents ? (
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
                    <Grid
                        item={true}
                        xs={10}
                        sm={5}
                        md={4}
                        align="left"
                        className={classes.descriptionDiv}
                    >
                        <LabelContainer
                            labelKey={getTransformedLocale(card.name)}
                            style={styles.documentName}
                        />
                        {card.required && requiredIcon}
                    </Grid>
                    <Grid item={true} xs={12} sm={6} md={4}>
                        {card.dropdown && (
                            <TextFieldContainer
                                select={true}
                                label={{
                                    labelKey: getTransformedLocale(
                                        card.dropdown.label
                                    ),
                                }}
                                placeholder={{ labelKey: card.dropdown.label }}
                                data={card.dropdown.menu}
                                optionValue="code"
                                optionLabel="label"
                                onChange={(event) => this.handleChange(key, event),
                                    (event) => this.handleChangeTwo(key, event)
                                }
                                jsonPath={jsonPath}
                            />
                        )}
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={3}
                        className={classes.fileUploadDiv}
                    >
                        <UploadSingleFile
                            classes={this.props.classes}
                            handleFileUpload={(e) =>
                                handleFileUpload(e, this.handleDocument, this.props)
                            }
                            uploaded={
                                documentsUploadRedux[key] &&
                                    documentsUploadRedux[key].documents
                                    ? true
                                    : false
                            }
                            removeDocument={() => this.removeDocument(key)}
                            documents={
                                documentsUploadRedux[key] &&
                                documentsUploadRedux[key].documents
                            }
                            onButtonClick={() => this.onUploadClick(key)}
                            inputProps={this.props.inputProps}
                            buttonLabel={this.props.buttonLabel}

                        />
                    </Grid>
                </Grid>
            </div>
        );
    };

    render() {
        const { classes, documentsList, handleChange } = this.props;
    
        let index = 0;



        return (
            <div>
               
                <Card
                    textChildren={
                        <div>
                            {documentsList &&
                                documentsList.map((container) => {
                                    return (
                                        <div>
                                            {container.cards.map((card) => {
                                                return (
                                                    <div
                                                        className={
                                                            classes.documentContainer
                                                        }
                                                    >
                                                        {card.hasSubCards && (
                                                            <LabelContainer
                                                                labelKey={card.name}
                                                                style={styles.documentTitle}
                                                            />
                                                        )}
                                                        {card.hasSubCards &&
                                                            card.subCards.map((subCard) => {
                                                                return (
                                                                    <div
                                                                        className={
                                                                            classes.documentSubCard
                                                                        }
                                                                    >
                                                                        {this.getUploadCard(
                                                                            subCard,
                                                                            index++
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        {!card.hasSubCards && (
                                                            <div>
                                                                {this.getUploadCard(
                                                                    card,
                                                                    index++
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                        </div>
                    }
                />
            </div>
        );
    }
}

DocumentList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const { complaints, common, auth, form, screenConfiguration, documentMap } = state;
    const { applicationData } = complaints;
    const { DocumentUploadMap } = complaints;
    const { id } = auth.userInfo;
    const { userInfo } = state.auth;
    const { moduleName } = screenConfiguration;
    const documentsUploadRedux = get(
        screenConfiguration.preparedFinalObject,
        "documentsUploadRedux",
        {}
    );
    return { documentsUploadRedux, moduleName, DocumentUploadMap, userInfo, documentMap };
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    };
};

export default withStyles(themeStyles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(DocumentList)
);
