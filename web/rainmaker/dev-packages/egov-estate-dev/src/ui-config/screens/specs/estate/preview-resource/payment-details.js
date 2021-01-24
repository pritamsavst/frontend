import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    getCommonGrayCard,
    getLabel,
    getCommonSubHeader,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    convertEpochToDate,
    getTodaysDateInYMD
  } from "../../utils";
  import get from "lodash/get";
  
 
export const paymentHeader = getCommonTitle({
    labelName: "Payment Details",
    labelKey: "ES_PAYMENT_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
 /* Ground rent review */
const dueDateOfPaymentLabel = {
    labelName: "Due Date of payment",
    labelKey: "ES_DUE_DATE_OF_PAYMENT_LABEL"
  }
  const payableLabel = {
    labelName: "Payable",
    labelKey: "ES_PAYABLE_LABEL"
  }
  const amountOfGRLabel = {
    labelName: "Amount of GR",
    labelKey: "ES_AMOUNT_OF_GR_LABEL"
  }
  const totalGRLabel = {
    labelName: "Total GR",
    labelKey: "ES_TOTAL_GR_LABEL"
  }
  const dateOfDepositLabel = {
    labelName: "Date of Deposit",
    labelKey: "ES_DATE_OF_DEPOSIT_LABEL"
  }
  const delayInPaymentLabel = {
    labelName: "Delay in Payment",
    labelKey: "ES_DELAY_IN_PAYMENT_LABEL"
  }
  const interestForDelayLabel = {
    labelName: "Interest for Delay",
    labelKey: "ES_INTERES_FOR_DELAY_LABEL"
  }
  const totalAmountDueWithInterestLabel = {
    labelName: "Total Amount Due with Interest",
    labelKey: "ES_TOTAL_AMOUNT_DUE_WITH_INTERES_LABEL"
  }
  const amountDepositedGRLabel = {
    labelName: "Amount Deposited GR",
    labelKey: "ES_AMOUNT_DEPOSITED_GR_LABEL"
  }
  const amountDepositedInttLabel = {
    labelName: "Amount Deposited Intt",
    labelKey: "ES_AMOUNT_DEPOSITED_INTT_LABEL"
  }
  const balanceGRLabel = {
    labelName: "Balance(+due, -excess) GR",
    labelKey: "ES_BALANCE_GR_LABEL"
  }
  const balanceInttLabel = {
    labelName: "Balance(+due, -excess) Intt",
    labelKey: "ES_BALANCE_INTT_LABEL"
  }
  const totalDueLabel = {
    labelName: "Total Due",
    labelKey: "ES_TOTAL_DUE_LABEL"
  }
  const receiptNumberLabel = {
    labelName: "Receipt Date",
    labelKey: "ES_RECEIPT_NUMBER_LABEL"
  }

  const receiptDateLabel = {
    labelName: "Receipt Date",
    labelKey: "ES_RECEIPT_DATE_LABEL"
  }

   const paymentMadeByLabel = {
    labelName: "Payment Made By",
    labelKey: "ES_PAYMENT_MADE_BY_LABEL"
  }
  
  export const groundRentHeader = getCommonTitle({
    labelName: "Ground Rent Details",
    labelKey: "ES_GROUND_RENT_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18,
      width: "100%"
    }
  })
  
  export const serviceTaxHeader = getCommonTitle({
    labelName: "Service Tax/GST Details",
    labelKey: "ES_SERVICE_TAX_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18,
      width: "100%"
    }
  })
  
  /* Service tax review */
  const rateOfStOrGstLabel = {
    labelName: "Rate of ST/GST",
    labelKey: "ES_RATE_ST_GST_LABEL"
  }
  const amountOfGstLabel = {
    labelName: "Amount of GST",
    labelKey: "ES_AMOUNT_OF_GST_LABEL"
  }
  const amountDueLabel = {
    labelName: "Amount Due",
    labelKey: "ES_AMOUNT_DUE_LABEL"
  }
  const amountDepositedSTLabel = {
    labelName: "Amount Deposited ST/GST",
    labelKey: "ES_AMOUNT_DEPOSITED_ST_LABEL"
  }
  const balanceStLabel = {
    labelName: "Balance ST/GST",
    labelKey: "ES_BALANCE_ST_LABEL"
  }
  const balanceInttLabelST = {
    labelName: "Balance Intt",
    labelKey: "ES_BALANCE_INTT_LABEL"
  }
  

  export const editSection = {
    componentPath: "Button",
    props: {
        color: "primary"
    },
    gridDefination: {
        xs: 12,
        sm: 2,
        align: "right"
    },
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
    }
}

  const masterEntryEditSection = (isEditable) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", 0);
        }
    }
})
export const headerDiv = {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    }
}

export const getReviewPayment = (isEditable = true,parentIndex=0,index=0) => {
    return getCommonGrayCard({
      headerDiv: {
        ...headerDiv,
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Payment Details",
              labelKey: "ES_PAYMENT_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 3)
        }
      },
      viewGroundRent: getCommonContainer({
        header: groundRentHeader,
        dueDateOfPayment: getLabelWithValue(
          dueDateOfPaymentLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grDueDateOfPayment`,
            callBack: convertEpochToDate
          }
        ),
        payable: getLabelWithValue(
          payableLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grPayable`
          }
        ),
        amountOfGR: getLabelWithValue(
          amountOfGRLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grAmountOfGr`
          }
        ),
        totalGR: getLabelWithValue(
          totalGRLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grTotalGr`
          }
        ),
        dateOfDeposit: getLabelWithValue(
          dateOfDepositLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grDateOfDeposit`,
            callBack: convertEpochToDate
          }
        ),
        delayInPayment: getLabelWithValue(
          delayInPaymentLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grDelayInPayment`
          }
        ),
        interestForDelay: getLabelWithValue(
          interestForDelayLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grInterestForDelay`
          }
        ),
        totalAmountDueWithInterest: getLabelWithValue(
          totalAmountDueWithInterestLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grTotalAmountDueWithInterest`
          }
        ),
        amountDepositedGR: getLabelWithValue(
          amountDepositedGRLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grAmountDepositedGr`
          }
        ),
        amountDepositedIntt: getLabelWithValue(
          amountDepositedInttLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grAmountDepositedIntt`
          }
        ),
        balanceGR: getLabelWithValue(
          balanceGRLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grBalanceGr`
          }
        ),
        balanceIntt: getLabelWithValue(
          balanceInttLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grBalanceIntt`
          }
        ),
        totalDue: getLabelWithValue(
          totalDueLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grTotalDue`
          }
        ),
        receiptNumber: getLabelWithValue(
            receiptNumberLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grReceiptNumber`
          }
        ),
        receiptDate : getLabelWithValue(
            receiptDateLabel,{
                jsonPath:`Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].grReceiptDate`,
                callBack: convertEpochToDate
            }
        )
      }),
      viewServiceTax: getCommonContainer({
        header: serviceTaxHeader,
        rateOfStOrGst: getLabelWithValue(
          rateOfStOrGstLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stRateOfStGst`
          }
        ),
        amountOfGst: getLabelWithValue(
          amountOfGstLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stAmountOfGst`
          }
        ),
        amountDue: getLabelWithValue(
          amountDueLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stAmountDue`
          }
        ),
        dateOfDeposit: getLabelWithValue(
          dateOfDepositLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stDateOfDeposit`,
            callBack: convertEpochToDate
          }
        ),
        delayInPayment: getLabelWithValue(
          delayInPaymentLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stDelayInPayment`
          }
        ),
        interestForDelay: getLabelWithValue(
          interestForDelayLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stInterestForDelay`
          }
        ),
        totalAmountDueWithInterest: getLabelWithValue(
          totalAmountDueWithInterestLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stTotalAmountDueWithInterest`
          }
        ),
        amountDepositedSt: getLabelWithValue(
          amountDepositedSTLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stAmountDepositedStGst`
          }
        ),
        amountDepositedIntt: getLabelWithValue(
          amountDepositedInttLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stAmountDepositedIntt`
          }
        ),
        balanceSt: getLabelWithValue(
          balanceStLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stBalanceStGst`
          }
        ),
        balanceIntt: getLabelWithValue(
          balanceInttLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stBalanceIntt`
          }
        ),
        totalDue: getLabelWithValue(
          totalDueLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stTotalDue`
          }
        ),
        receiptNumberAndDate: getLabelWithValue(
            receiptNumberLabel, {
            jsonPath: `Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stReceiptNumber`
          }
        ),
        receiptDate : getLabelWithValue(
            receiptDateLabel,{
                jsonPath:`Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stReceiptDate`,
                callBack: convertEpochToDate
            }
        ),
        paymentMadeBy: getLabelWithValue(
          paymentMadeByLabel,{
            jsonPath:`Properties[0].propertyDetails.owners[${parentIndex}].ownerDetails.paymentDetails[${index}].stPaymentMadeBy`
          }
        )
      })
    })
  }