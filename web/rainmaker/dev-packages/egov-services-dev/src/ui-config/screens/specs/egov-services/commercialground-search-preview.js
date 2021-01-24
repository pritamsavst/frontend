import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    localStorageGet,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getFileUrlFromAPI,
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import {
    generageBillCollection,
    generateBill,
} from "../utils";
import { commercialGroundSummary } from "./summaryResource/commercialGroundSummary";
import { applicantSummary } from "./summaryResource/applicantSummaryCgb";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { remarksSummary } from "./searchResource/remarksSummary";
import { footer } from "./searchResource/citizenFooter";
import {
    footerReviewTop,
} from "./searchResource/footer";
import {
    getLocale,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsView
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import {
    getPerDayRateCgb

} from "../utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    }
});

const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];

    // Get all documents from response
    let bookingDocs = get(
        state,
        "screenConfiguration.preparedFinalObject.BookingDocument",
        {}
    );

    if (Object.keys(bookingDocs).length > 0) {
        let keys = Object.keys(bookingDocs);
        let values = Object.values(bookingDocs);
        let id = keys[0],
            fileName = values[0];

        documentsPreview.push({
            title: "BK_GFCP_DOCUMENT",
            fileStoreId: id,
            linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
            fileStoreIds.length > 0
                ? await getFileUrlFromAPI(fileStoreIds)
                : {};
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
        dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
};

const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
    // console.log("actionnew", action);
    let showFooter = false;
    if (bookingStatus === "PENDINGPAYMENT") {
        showFooter = true;
    }
    // set(
    //     action,
    //     "screenConfig.components.div.children.footer.children.cancelButton.visible",
    //     role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    // );
    set(
        action,
        "screenConfig.components.div.children.footer.children.submitButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
};

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId
) => {
    const response = await getSearchResultsView([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);

    let recData = get(response, "bookingsModelList", []);
    dispatch(
        prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
    );

    let venue = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking.bkBookingVenue",
        []
    );

    let baseCharge = await getPerDayRateCgb(venue)
    dispatch(prepareFinalObject("BaseCharge", `  @ Rs.${baseCharge.data.ratePerDay}/day`));
    dispatch(
        prepareFinalObject("BookingDocument", get(response, "documentMap", {}))
    );

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus",
        {}
    );
    if (bookingStatus === "APPLIED") {
        await generageBillCollection(state, dispatch, applicationNumber, tenantId)
    } else {
        await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].businessService);
    }



    localStorageSet("bookingStatus", bookingStatus);
    HideshowFooter(action, bookingStatus);

    prepareDocumentsView(state, dispatch);

    const CitizenprintCont = footerReviewTop(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        ""
    );

    set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        CitizenprintCont
    )
};

const getPaymentGatwayList = async (action, state, dispatch) => {
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/pg-service/gateway/v1/_search",
            "_search",
            [],
            {}
        );
        let payloadprocess = [];
        for (let index = 0; index < payload.length; index++) {
            const element = payload[index];
            let pay = {
                element: element
            }
            payloadprocess.push(pay);
        }

        dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
    } catch (e) {
        console.log(e);
    }
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "commercialground-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(
            window.location.href,
            "tenantId"
        );
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);


        getPaymentGatwayList(action, state, dispatch).then(response => {
        });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "GFCP" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 8,
                            },
                            ...titlebar,
                        },
                        helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                                color: "primary",
                                style: { justifyContent: "flex-end" },
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right",
                            },
                        },
                    },
                },
                taskStatus: {
                    uiFramework: "custom-containers-local",
                    componentPath: "WorkFlowContainer",
                    moduleName: "egov-services",
                    visible: true,
                },
                body: getCommonCard({
                    estimateSummary: estimateSummary,
                    applicantSummary: applicantSummary,
                    commercialGroundSummary: commercialGroundSummary,
                    documentsSummary: documentsSummary,
                    // remarksSummary: remarksSummary,
                }),
                // break: getBreak(),
                // footer: footer,
            }
        }
    }
};

export default screenConfig;
