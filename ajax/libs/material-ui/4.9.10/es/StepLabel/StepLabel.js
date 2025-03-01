import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import Typography from '../Typography';
import StepIcon from '../StepIcon';
export const styles = theme => ({
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    alignItems: 'center',
    '&$alternativeLabel': {
      flexDirection: 'column'
    },
    '&$disabled': {
      cursor: 'default'
    }
  },

  /* Styles applied to the root element if `orientation="horizontal". */
  horizontal: {},

  /* Styles applied to the root element if `orientation="vertical". */
  vertical: {},

  /* Styles applied to the `Typography` component which wraps `children`. */
  label: {
    color: theme.palette.text.secondary,
    '&$active': {
      color: theme.palette.text.primary,
      fontWeight: 500
    },
    '&$completed': {
      color: theme.palette.text.primary,
      fontWeight: 500
    },
    '&$alternativeLabel': {
      textAlign: 'center',
      marginTop: 16
    },
    '&$error': {
      color: theme.palette.error.main
    }
  },

  /* Pseudo-class applied to the `Typography` component if `active={true}`. */
  active: {},

  /* Pseudo-class applied to the `Typography` component if `completed={true}`. */
  completed: {},

  /* Pseudo-class applied to the root element and `Typography` component if `error={true}`. */
  error: {},

  /* Pseudo-class applied to the root element and `Typography` component if `disabled={true}`. */
  disabled: {},

  /* Styles applied to the `icon` container element. */
  iconContainer: {
    flexShrink: 0,
    // Fix IE 11 issue
    display: 'flex',
    paddingRight: 8,
    '&$alternativeLabel': {
      paddingRight: 0
    }
  },

  /* Pseudo-class applied to the root and icon container and `Typography` if `alternativeLabel={true}`. */
  alternativeLabel: {},

  /* Styles applied to the container element which wraps `Typography` and `optional`. */
  labelContainer: {
    width: '100%'
  }
});
const StepLabel = React.forwardRef(function StepLabel(props, ref) {
  const {
    // eslint-disable-next-line react/prop-types
    active = false,
    // eslint-disable-next-line react/prop-types
    alternativeLabel = false,
    children,
    classes,
    className,
    // eslint-disable-next-line react/prop-types
    completed = false,
    disabled = false,
    error = false,
    icon,
    optional,
    // eslint-disable-next-line react/prop-types
    orientation = 'horizontal',
    StepIconComponent: StepIconComponentProp,
    StepIconProps
  } = props,
        other = _objectWithoutPropertiesLoose(props, ["active", "alternativeLabel", "children", "classes", "className", "completed", "disabled", "error", "expanded", "icon", "last", "optional", "orientation", "StepIconComponent", "StepIconProps"]);

  let StepIconComponent = StepIconComponentProp;

  if (icon && !StepIconComponent) {
    StepIconComponent = StepIcon;
  }

  return /*#__PURE__*/React.createElement("span", _extends({
    className: clsx(classes.root, classes[orientation], className, disabled && classes.disabled, alternativeLabel && classes.alternativeLabel, error && classes.error),
    ref: ref
  }, other), icon || StepIconComponent ? /*#__PURE__*/React.createElement("span", {
    className: clsx(classes.iconContainer, alternativeLabel && classes.alternativeLabel)
  }, /*#__PURE__*/React.createElement(StepIconComponent, _extends({
    completed: completed,
    active: active,
    error: error,
    icon: icon
  }, StepIconProps))) : null, /*#__PURE__*/React.createElement("span", {
    className: classes.labelContainer
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body2",
    component: "span",
    className: clsx(classes.label, alternativeLabel && classes.alternativeLabel, completed && classes.completed, active && classes.active, error && classes.error),
    display: "block"
  }, children), optional));
});
process.env.NODE_ENV !== "production" ? StepLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------

  /**
   * In most cases will simply be a string containing a title for the label.
   */
  children: PropTypes.node,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * Mark the step as disabled, will also disable the button if
   * `StepLabelButton` is a child of `StepLabel`. Is passed to child components.
   */
  disabled: PropTypes.bool,

  /**
   * Mark the step as failed.
   */
  error: PropTypes.bool,

  /**
   * Override the default label of the step icon.
   */
  icon: PropTypes.node,

  /**
   * The optional node to display.
   */
  optional: PropTypes.node,

  /**
   * The component to render in place of the [`StepIcon`](/api/step-icon/).
   */
  StepIconComponent: PropTypes.elementType,

  /**
   * Props applied to the [`StepIcon`](/api/step-icon/) element.
   */
  StepIconProps: PropTypes.object
} : void 0;
StepLabel.muiName = 'StepLabel';
export default withStyles(styles, {
  name: 'MuiStepLabel'
})(StepLabel);