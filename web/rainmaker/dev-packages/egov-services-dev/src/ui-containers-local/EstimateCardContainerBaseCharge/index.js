import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {
    render() {
        return <FeesEstimateCard estimate={this.props.estimate} />;
    }
}

const sortBillDetails = (billDetails = []) => {
    let sortedBillDetails = [];

    sortedBillDetails = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
    return sortedBillDetails;
};

const formatTaxHeaders = (billDetail = {}) => {
    let formattedFees = [];
    const { billAccountDetails = [] } = billDetail;
    formattedFees = billAccountDetails.map((taxHead) => {
        return {
            info: {
                labelKey: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
                labelName: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
            },
            name: {
                labelKey: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
                labelName: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
            },
            value: taxHead.amount,
            order: taxHead.order,
        };
    });
    formattedFees.sort(function (x, y) {
        return y.value - x.value;
    });
    //formattedFees.reverse();
    return formattedFees;
};

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    const fees = formatTaxHeaders(
        sortBillDetails(
            get(
                screenConfiguration,
                "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails",
                []
            )
        )[0]
    );
    // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
    const billDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails",
        []
    );
    let totalAmount = 0;
    let arrears = 0;
    for (let billDetail of billDetails) {
        totalAmount += billDetail.amount;
    }
    if (totalAmount > 0) {
        arrears = totalAmount - billDetails[0].amount;
    }
    const estimate = {
        header: { labelName: "Fee Estimate", labelKey: "BK_SUMMARY_FEE_EST" },
        fees,
        totalAmount,
        arrears,
    };
    return { estimate };
};

export default connect(mapStateToProps, null)(EstimateCardContainer);
