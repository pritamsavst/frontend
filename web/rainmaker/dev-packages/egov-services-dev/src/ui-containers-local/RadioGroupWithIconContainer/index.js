import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { connect } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import CatAIcon from "../../ui-atoms-local/Icons/Cat-A";
import CatBIcon from "../../ui-atoms-local/Icons/Cat-B";
import CatCIcon from "../../ui-atoms-local/Icons/Cat-C";

const styles = (theme) => ({
    root: {
        display: "flex",
    },
    formControl: {
        marginTop: 0,
        paddingBottom: 0,
    },
    group: {
        display: "inline-block",
        margin: 0,
    },
    radioRoot: {
        marginBottom: 12,
    },
    formLabel: {
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: 0.56,
    },
});

const disableRadioButton = {
    pointerEvents: "none",
    opacity: 0.5,
};

class RadioGroupWithIconContainer extends React.Component {
    handleChange = (event) => {
        const {
            screenKey,
            componentJsonpath,
            jsonPath,
            // approveCheck,
            onFieldChange,
            onChange,
        } = this.props;
        onChange
            ? onChange(event)
            : onFieldChange(
                  screenKey,
                  componentJsonpath,
                  "props.value",
                  event.target.value
              );
    };

    render() {
        //  const { classes, buttons, fieldValue } = this.props;
        const {
            label,
            classes,
            buttons,
            defaultValue,
            value,
            fieldValue,
            required,
        } = this.props;

        return (
            <div className={classes.root}>
                {/* <FormControl component="fieldset" className={classes.formControl}> */}
                <FormControl
                    component="fieldset"
                    className={classes.formControl}
                    required={required}
                >
                    <FormLabel className={classes.formLabel}>
                        {label && label.key && (
                            <LabelContainer
                                className={classes.formLabel}
                                labelName={label.name}
                                labelKey={label.key}
                            />
                        )}
                    </FormLabel>
                    <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        className={classes.group}
                        // value={this.state.value || fieldValue}
                        value={value || fieldValue || defaultValue}
                        onChange={this.handleChange}
                    >
                        {buttons &&
                            buttons.map((button, index) => {
                                return (
                                    <FormControlLabel
                                        disabled={
                                            button.disabled ? true : false
                                        }
                                        key={index}
                                        classes={{
                                            label: "radio-button-label",
                                        }}
                                        value={button.value}
                                        control={
                                            // <Radio
                                            //   classes={{
                                            //     root: "radio-root"
                                            //   }}
                                            //   color="primary"
                                            // />
                                            <Radio
                                                className={classes.radioRoot}
                                                color="primary"
                                            />
                                        }
                                        // label={button.label}
                                        label={button.value === "Cat-A" ? <CatAIcon /> : button.value === "Cat-B" ? <CatBIcon /> : <CatCIcon />
                                            // <LabelContainer
                                            //   labelName={button.labelName}
                                            //   labelKey={button.labelKey}
                                            // />
                                        }
                                    />
                                );
                            })}
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }
}

const mapStateToProps = (state, ownprops) => {
    let fieldValue = "";
    const { screenConfiguration } = state;
    const { jsonPath } = ownprops;
    const { preparedFinalObject } = screenConfiguration;
    if (jsonPath) fieldValue = get(preparedFinalObject, jsonPath);
    return { preparedFinalObject, jsonPath, fieldValue };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     approveCheck: (jsonPath, value) => {
//       dispatch(prepareFinalObject(jsonPath, value));
//     }
//   };
// };

RadioGroupWithIconContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
    connect(mapStateToProps, "")(RadioGroupWithIconContainer)
);
