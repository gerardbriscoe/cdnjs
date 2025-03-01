import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { html, body } from '../CssBaseline/CssBaseline';
export const styles = theme => ({
  /* Styles applied to the root element. */
  root: _extends({}, html, {}, body(theme), {
    '& *, & *::before, & *::after': {
      boxSizing: 'inherit'
    },
    '& strong, & b': {
      fontWeight: theme.typography.fontWeightBold
    }
  })
});
const ScopedCssBaseline = React.forwardRef(function ScopedCssBaseline(props, ref) {
  const {
    classes,
    className
  } = props,
        other = _objectWithoutPropertiesLoose(props, ["classes", "className"]);

  return React.createElement("div", _extends({
    className: clsx(classes.root, className),
    ref: ref
  }, other));
});
process.env.NODE_ENV !== "production" ? ScopedCssBaseline.propTypes = {
  /**
   * The content of the component.
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
  className: PropTypes.string
} : void 0;
export default withStyles(styles, {
  name: 'MuiScopedCssBaseline'
})(ScopedCssBaseline);