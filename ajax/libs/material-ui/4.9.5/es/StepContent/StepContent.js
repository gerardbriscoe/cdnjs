import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Collapse from '../Collapse';
import withStyles from '../styles/withStyles';
export const styles = theme => ({
  /* Styles applied to the root element. */
  root: {
    marginTop: 8,
    marginLeft: 12,
    // half icon
    paddingLeft: 8 + 12,
    // margin + half icon
    paddingRight: 8,
    borderLeft: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[600]}`
  },

  /* Styles applied to the root element if `last={true}` (controlled by `Step`). */
  last: {
    borderLeft: 'none'
  },

  /* Styles applied to the Transition component. */
  transition: {}
});
const StepContent = React.forwardRef(function StepContent(props, ref) {
  const {
    active,
    children,
    classes,
    className,
    expanded,
    last,
    orientation,
    TransitionComponent = Collapse,
    transitionDuration: transitionDurationProp = 'auto',
    TransitionProps
  } = props,
        other = _objectWithoutPropertiesLoose(props, ["active", "alternativeLabel", "children", "classes", "className", "completed", "expanded", "last", "optional", "orientation", "TransitionComponent", "transitionDuration", "TransitionProps"]);

  if (process.env.NODE_ENV !== 'production') {
    if (orientation !== 'vertical') {
      console.error('Material-UI: <StepContent /> is only designed for use with the vertical stepper.');
    }
  }

  let transitionDuration = transitionDurationProp;

  if (transitionDurationProp === 'auto' && !TransitionComponent.muiSupportAuto) {
    transitionDuration = undefined;
  }

  return React.createElement("div", _extends({
    className: clsx(classes.root, className, last && classes.last),
    ref: ref
  }, other), React.createElement(TransitionComponent, _extends({
    in: active || expanded,
    className: classes.transition,
    timeout: transitionDuration,
    unmountOnExit: true
  }, TransitionProps), children));
});
process.env.NODE_ENV !== "production" ? StepContent.propTypes = {
  /**
   * @ignore
   * Expands the content.
   */
  active: PropTypes.bool,

  /**
   * @ignore
   * Set internally by Step when it's supplied with the alternativeLabel prop.
   */
  alternativeLabel: PropTypes.bool,

  /**
   * Step content.
   */
  children: PropTypes.node,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object.isRequired,

  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * @ignore
   */
  completed: PropTypes.bool,

  /**
   * @ignore
   */
  expanded: PropTypes.bool,

  /**
   * @ignore
   */
  last: PropTypes.bool,

  /**
   * @ignore
   * Set internally by Step when it's supplied with the optional prop.
   */
  optional: PropTypes.bool,

  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /**
   * The component used for the transition.
   * [Follow this guide](/components/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   */
  TransitionComponent: PropTypes.elementType,

  /**
   * Adjust the duration of the content expand transition.
   * Passed as a prop to the transition component.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  transitionDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    enter: PropTypes.number,
    exit: PropTypes.number
  }), PropTypes.oneOf(['auto'])]),

  /**
   * Props applied to the [`Transition`](http://reactcommunity.org/react-transition-group/transition#Transition-props) element.
   */
  TransitionProps: PropTypes.object
} : void 0;
export default withStyles(styles, {
  name: 'MuiStepContent'
})(StepContent);