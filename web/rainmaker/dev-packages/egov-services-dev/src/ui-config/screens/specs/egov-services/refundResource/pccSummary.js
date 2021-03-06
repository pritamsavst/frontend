import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import {
    convertDateInDMY
} from "../../utils";

export const pccSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Applicant Details",
                    labelKey: "BK_CGB_APPLICATION_DETAILS_HEADER",
                }),
            },
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicationContainer: getCommonContainer({

                    Purpose: getLabelWithValue(
                        {
                            labelName: "Purpose",
                            labelKey: "BK_PCC_PURPOSE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingPurpose",
                            callBack: (value) => {
                                if (
                                    value === undefined ||
                                    value === "" ||
                                    value === null
                                ) {
                                    return "NA";
                                } else {
                                    return value;
                                }
                            },
                        }
                    ),
                    Sector: getLabelWithValue(
                        {
                            labelName: "Sector",
                            labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSector",
                        }
                    ),
                    Dimension: getLabelWithValue(
                        {
                            labelName: "Dimension",
                            labelKey: "BK_PCC_DIMENSION_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkDimension",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return `${value} Sq Yard`;
                                }
                            }
                        }
                    ),
                    Location: getLabelWithValue(
                        {
                            labelName: "Location",
                            labelKey: "BK_PCC_LOCATION_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkLocation",
                        }
                    ),
                    FromDate: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "BK_PCC_FROM_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFromDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
                        }
                    ),
                    ToDate: getLabelWithValue(
                        {
                            labelName: "To Date",
                            labelKey: "BK_PCC_TO_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkToDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
                        }
                    ),
                    CleansingCharges: getLabelWithValue(
                        {
                            labelName: "Cleansing Charges",
                            labelKey: "BK_PCC_CLEANING_CHARGES_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCleansingCharges",
                        }
                    ),
                    Rent: getLabelWithValue(
                        {
                            labelName: "Rent",
                            labelKey: "BK_PCC_RENT_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkRent",
                        }
                    ),

                    SurchargeRent: getLabelWithValue(
                        {
                            labelName: "Surcharge on Rent",
                            labelKey: "BK_PCC_SURCHARGE_RENT_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSurchargeRent",
                        }
                    ),
                    Utgst: getLabelWithValue(
                        {
                            labelName: "Utgst",
                            labelKey: "BK_PCC_UTGST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkUtgst",
                        }
                    ),
                    Cgst: getLabelWithValue(
                        {
                            labelName: "Cgst",
                            labelKey: "BK_PCC_UTGST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCgst",
                        }
                    ),
                    bkRefundAmount: getLabelWithValue(
                        {
                            labelName: "Refundable Amount",
                            labelKey: "BK_PCC_RefundAmount_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkRefundAmount",
                        }
                    ),
                    CustomerGstNo: getLabelWithValue(
                        {
                            labelName: "Customer Gst No",
                            labelKey: "BK_PCC_CUSTOMER_GST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCustomerGstNo",
                            callBack: (value) => {
                                if (
                                    value === undefined ||
                                    value === "" ||
                                    value === null
                                ) {
                                    return "NA";
                                } else {
                                    return value;
                                }
                            },
                        }
                    ),
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
        },
        type: "array",
    },
});
