import React from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Button } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import "react-day-picker/lib/style.css";
import "./index.css";
import get from "lodash/get";
import set from "lodash/set";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

class BookingCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state = {
            filterfromDate: "",
            filtertoDate: "",
            dselectedDays: [],
        };
    }

    componentDidMount() {
        const { availabilityCheckData } = this.props;
       
        console.log('availabilityCheckDataVal in bcalendar111111',availabilityCheckData)
  //      console.log('availabilityCheckDataVal in bcalendar',availabilityCheckDataVal&&availabilityCheckDataVal.reservedDays)

        if (availabilityCheckData&&availabilityCheckData.reservedDays) {
            console.log('pushReservedDayssssssssssssssssssssssssssssss');
            let pushReservedDay = [];
            availabilityCheckData.reservedDays.length > 0 &&
                availabilityCheckData.reservedDays.map((el) => {
                    pushReservedDay.push(new Date(el));
                });
                console.log('pushReservedDay',pushReservedDay);
            this.setState({
                dselectedDays: pushReservedDay,
                from: new Date(availabilityCheckData.bkFromDate),
                to: new Date(availabilityCheckData.bkToDate),
                enteredTo: new Date(availabilityCheckData.bkToDate),
            });
        }

        // for (let i = 0; i < this.props.reservedDays.length; i++) {
        //     pushReservedDay.push(new Date(this.props.reservedDays[i]));
        // }

        //  if(this.props.reservedDays.length > 0) {

        //     this.setState({
        //         from: new Date(this.props.availabilityCheckData.bkFromDate),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(this.props.availabilityCheckData.bkToDate),
        //     });
        // }
        // if(applicationNumber !== null || applicationNumber !== undefined){
        //     alert("in it")
        //     this.setState({
        //         from: new Date(localStorageGet("fromDateCG")),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(localStorageGet("toDateCG")),
        //     });
        // }
    }

    componentWillReceiveProps(nextProps) {
        console.log(
            nextProps.availabilityCheckData,
            "myNextprops.availabilityCheckData"
        );
        if (
            nextProps.availabilityCheckData === undefined ||
            nextProps.availabilityCheckData.length === 0
        ) {
            this.setState({
                dselectedDays: [],
                from: null,
                to: null,
                enteredTo: null,
            });
        } else {
            if (
                nextProps.availabilityCheckData.bkFromDate === null &&
                nextProps.availabilityCheckData.bkToDate === null
            ) {
                this.setState({
                    from: null,
                    to: null,
                    enteredTo: null,
                });
            }
            if ("reservedDays" in nextProps.availabilityCheckData) {
                let pushReservedDay = [];
                nextProps.availabilityCheckData.reservedDays.length > 0 &&
                    nextProps.availabilityCheckData.reservedDays.map((el) => {
                        pushReservedDay.push(new Date(el));
                    });
                let previousDates = this.getPreviousTodayDates();
                previousDates.map((val) => {
                    pushReservedDay.push(val);
                });
                this.setState({
                    dselectedDays: pushReservedDay,
                });
            }

            if ("bkApplicationNumber" in nextProps.availabilityCheckData) {
                if (
                    nextProps.availabilityCheckData.bkFromDate !== null &&
                    nextProps.availabilityCheckData.bkToDate !== null
                ) {
                    this.setState({
                        from: new Date(
                            nextProps.availabilityCheckData.bkFromDate
                        ),
                        to: new Date(nextProps.availabilityCheckData.bkToDate),
                        enteredTo: new Date(
                            nextProps.availabilityCheckData.bkToDate
                        ),
                    });
                } else if (
                    nextProps.availabilityCheckData.bkFromDate !== null &&
                    nextProps.availabilityCheckData.bkToDate === null
                ) {
                    this.setState({
                        from: new Date(
                            nextProps.availabilityCheckData.bkFromDate
                        ),
                        to: null,
                        enteredTo: null,
                    });
                } else {
                    this.setState(this.getInitialState());
                }
            }
        }
    }

    getInitialState() {
        return {
            from: null,
            to: null,
            enteredTo: null, // Keep track of the last day for mouseEnter.
        };
    }

    continue = e => {
        // this.props.history.push(`/egov-services/applyPark-community-center`);
    }

    isSelectingFirstDay(from, to, day) {
       // console.log('isSelectingFirstDay',from,to,day)
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    handleDayClick = (day, modifiers = {}) => {
        console.log('day====>>>',day)
        console.log('availabilityCheckData====>>>',availabilityCheckData)
        const { availabilityCheckData } = this.props;
        // if ("reservedDays" in availabilityCheckData) {
            const { from, to } = this.state;
            if (from && to && day >= from && day <= to) {
                this.handleResetClick();
                return;
            }
            if (this.isSelectingFirstDay(from, to, day)) {
                if (day >= new Date()) {
                    this.props.prepareFinalObject(
                        "availabilityCheckData.bkFromDate",
                        day
                    );

                    this.setState({
                        from: day,
                        to: null,
                        enteredTo: null,
                    });
                } else {
                    this.handleResetClick();
                }
            } else {
                this.setState({
                    to: day,
                    enteredTo: day,
                });
                this.props.prepareFinalObject(
                    "availabilityCheckData.bkToDate",
                    day
                );
                this.checkRangeValidity();
            }
        // } else {
        //     console.log('in else handleDayClick')
        //     this.handleResetClick();
        //     this.props.showError2();
        //     return;
        // }
    };

    handleDayMouseEnter = (day) => {
     //   console.log('day',day)
        const { from, to } = this.state;
        if (!this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                enteredTo: day,
            });
        }
    };

    handleResetClick = () => {
       // console.log('this.props---->>>>',this.props)
        this.setState(this.getInitialState());
        this.props.prepareFinalObject("availabilityCheckData.bkToDate", null);
        this.props.prepareFinalObject("availabilityCheckData.bkFromDate", null);
    };

    checkRangeValidity() {
        let Range = {
            from: this.state.from,
            to: this.state.enteredTo,
        };

        for (let i = 0; i < this.state.dselectedDays.length; i++) {
            let bookedDate = this.state.dselectedDays[i];

            if (DateUtils.isDayInRange(bookedDate, Range)) {
                this.props.showError();
                this.handleResetClick();
            } else {
                //  this.props.showBookButton()
            }
        }
    }

    getPreviousTodayDates() {
        let date = new Date();
        var d = date.getDate();
        let m = date.getMonth();
        let y = date.getFullYear();
        var defaultDisabledDate = [];
        while (d > 1) {
            d = d - 1;
            let nd = new Date(y, m, d);

            defaultDisabledDate.push(nd);
        }
        return defaultDisabledDate;
    }

    render() {
    
        const {ChangeFromDate, ChangeToDate, resetDate} = this.props;
        
        console.log("propsInBookingCalender--",this.props)
        let { from, to, enteredTo } = this.state;
        console.log("ResetDateInrender--",resetDate)
        if(resetDate){
            from = ChangeFromDate;
            to = ChangeToDate
        }
        console.log("fromInrender--",from),
        console.log("toInrender--",to)
        const modifiers = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDays = [from, { from, to: enteredTo }];
        const WEEK_DAY_LONG = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const DATAE = this.getPreviousTodayDates();
        const past = {
            value: DATAE.map((val) => {
                return new Date(val);
            }),
        };
        let data = new Date();
        let newData = new Date(data.setMonth(data.getMonth() + 5));
        return (
            <div className="calendar-wrapper">
                <div className="calendar-section">
                    <DayPicker
                        className="Selectable"
                        numberOfMonths={2}
                        initialMonth={new Date()}
                        disabledDays={this.state.dselectedDays}
                        fromMonth={new Date()}
                        toMonth={newData}
                        modifiers={modifiers}
                        weekdaysShort={WEEK_DAY_LONG}
                        // modifiers={past}
                        selectedDays={selectedDays}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter}
                    />
                </div>
                <div className="calendar-info">
                    {/* <h2 className="calendar-info-title">
                        Select From &amp; To Date in Calendar{" "}
                    </h2> */}
                    <div style={{ marginBottom: 12 }}>
                        <span
                            style={{
                                display: "block",
                                color: "rgba(0, 0, 0, 0.54)",
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: "1.375em",
                            }}
                        >
                            Booking Venue
                        </span>
                        <span
                            style={{
                                color: "rgba(0, 0, 0, 0.87)",
                                fontSize: 16,
                                fontWeight: 400,
                                lineHeight: "19px",
                                letterSpacing: "0.67px",
                            }}
                        >
                            {this.props.bookingVenue === ''
                                ? "------------"
                                : this.props.bookingVenue}
                        </span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <span
                            style={{
                                display: "block",
                                color: "rgba(0, 0, 0, 0.54)",
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: "1.375em",
                            }}
                        >
                            From Date
                        </span>
                        <span
                            style={{
                                color: "rgba(0, 0, 0, 0.87)",
                                fontSize: 16,
                                fontWeight: 400,
                                lineHeight: "19px",
                                letterSpacing: "0.67px",
                            }}
                        >
                            {!from ? "--/--/----" : from.toLocaleDateString()}
                        </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <span
                            style={{
                                display: "block",
                                color: "rgba(0, 0, 0, 0.54)",
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: "1.375em",
                            }}
                        >
                            To Date
                        </span>
                        <span
                            style={{
                                color: "rgba(0, 0, 0, 0.87)",
                                fontSize: 16,
                                fontWeight: 400,
                                lineHeight: "19px",
                                letterSpacing: "0.67px",
                            }}
                        >
                            {!to ? "--/--/----" : to.toLocaleDateString()}
                        </span>
                    </div>




                    {/* {from && !to && (
                        <span style={{ color: "#fe7a51", fontWeight: "600" }}>
                            ** Please click same day for booking single Date.
                        </span>
                    )} */}
                </div>


                <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="RESET" />}
              fullWidth={true}
              onClick={this.continue}
              startIcon={<ArrowForwardIosIcon />}
            />

            </div>
        );
    }
}


// const mapStateToProps = state => {

//     const { complaints, common, auth, form } = state;
//     console.log("stateoFsummaryPage--",state)
//     let resetDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData: "";
    
//     let ChangeFromDate = resetDate ?resetDate.bkFromDate:"";
//     let ChangeToDate = resetDate ?resetDate.bkToDate:"";
//     const { createPACCApplicationData } = complaints;
//     console.log('ChangeFromDate', ChangeFromDate)
//     console.log("ChangeToDate--",ChangeToDate)
//     return {
//         createPACCApplicationData,
//         ChangeFromDate,
//         ChangeToDate,
//         resetDate
//     }

// }

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
        showError: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "Selected Range Should Not Contain Reserved Date",
                        labelKey: "",
                    },
                    "warning"
                )
            ),
        showError2: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "First Check Availability By Filling Above Form",
                        labelKey: "",
                    },
                    "warning"
                )
            ),
        showError3: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Please select date greater then today",
                        labelKey: "",
                    },
                    "warning"
                )
            ),

        //showBookButton: () => dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch)
    };
};
const mapStateToProps = (state, ownProps) => {

    const { bookings, common, auth, form } = state;
    console.log("stateoFsummaryPage--",state)
    let resetDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData: "";
    
    let ChangeFromDate = resetDate ?resetDate.bkFromDate:"";
    let ChangeToDate = resetDate ?resetDate.bkToDate:"";
    const { createPACCApplicationData } = bookings;
    console.log('ChangeFromDate', ChangeFromDate)
    console.log("ChangeToDate--",ChangeToDate)
    
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData",
        []
    );
  if(availabilityCheckData&&availabilityCheckData.reservedDays){
    availabilityCheckData=availabilityCheckData;
    console.log('availabilityCheckData in bcalendar00',availabilityCheckData)
  }
  console.log('availabilityCheckData in bcalendar333',availabilityCheckData)
  if(availabilityCheckData.reservedDays){
    return { availabilityCheckData,
        createPACCApplicationData,
        ChangeFromDate,
        ChangeToDate,
        resetDate
     };
  }else{
      return{
        createPACCApplicationData,
        ChangeFromDate,
        ChangeToDate,
        resetDate
      }
}
 
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar);
