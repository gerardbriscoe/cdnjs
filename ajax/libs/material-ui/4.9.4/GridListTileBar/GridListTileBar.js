"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var styles = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 48,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily
    },

    /* Styles applied to the root element if `titlePosition="bottom"`. */
    titlePositionBottom: {
      bottom: 0
    },

    /* Styles applied to the root element if `titlePosition="top"`. */
    titlePositionTop: {
      top: 0
    },

    /* Styles applied to the root element if a `subtitle` is provided. */
    rootSubtitle: {
      height: 68
    },

    /* Styles applied to the title and subtitle container element. */
    titleWrap: {
      flexGrow: 1,
      marginLeft: 16,
      marginRight: 16,
      color: theme.palette.common.white,
      overflow: 'hidden'
    },

    /* Styles applied to the container element if `actionPosition="left"`. */
    titleWrapActionPosLeft: {
      marginLeft: 0
    },

    /* Styles applied to the container element if `actionPosition="right"`. */
    titleWrapActionPosRight: {
      marginRight: 0
    },

    /* Styles applied to the title container element. */
    title: {
      fontSize: theme.typography.pxToRem(16),
      lineHeight: '24px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },

    /* Styles applied to the subtitle container element. */
    subtitle: {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },

    /* Styles applied to the actionIcon if supplied. */
    actionIcon: {},

    /* Styles applied to the actionIcon if `actionPosition="left"`. */
    actionIconActionPosLeft: {
      order: -1
    }
  };
};

exports.styles = styles;

var GridListTileBar = _react.default.forwardRef(function GridListTileBar(props, ref) {
  var actionIcon = props.actionIcon,
      _props$actionPosition = props.actionPosition,
      actionPosition = _props$actionPosition === void 0 ? 'right' : _props$actionPosition,
      classes = props.classes,
      className = props.className,
      subtitle = props.subtitle,
      title = props.title,
      _props$titlePosition = props.titlePosition,
      titlePosition = _props$titlePosition === void 0 ? 'bottom' : _props$titlePosition,
      other = (0, _objectWithoutProperties2.default)(props, ["actionIcon", "actionPosition", "classes", "className", "subtitle", "title", "titlePosition"]);
  var actionPos = actionIcon && actionPosition;
  return _react.default.createElement("div", (0, _extends2.default)({
    className: (0, _clsx.default)(classes.root, className, titlePosition === 'top' ? classes.titlePositionTop : classes.titlePositionBottom, subtitle && classes.rootSubtitle),
    ref: ref
  }, other), _react.default.createElement("div", {
    className: (0, _clsx.default)(classes.titleWrap, {
      'left': classes.titleWrapActionPosLeft,
      'right': classes.titleWrapActionPosRight
    }[actionPos])
  }, _react.default.createElement("div", {
    className: classes.title
  }, title), subtitle ? _react.default.createElement("div", {
    className: classes.subtitle
  }, subtitle) : null), actionIcon ? _react.default.createElement("div", {
    className: (0, _clsx.default)(classes.actionIcon, actionPos === 'left' && classes.actionIconActionPosLeft)
  }, actionIcon) : null);
});

process.env.NODE_ENV !== "production" ? GridListTileBar.propTypes = {
  /**
   * An IconButton element to be used as secondary action target
   * (primary action target is the tile itself).
   */
  actionIcon: _propTypes.default.node,

  /**
   * Position of secondary action IconButton.
   */
  actionPosition: _propTypes.default.oneOf(['left', 'right']),

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: _propTypes.default.object.isRequired,

  /**
   * @ignore
   */
  className: _propTypes.default.string,

  /**
   * String or element serving as subtitle (support text).
   */
  subtitle: _propTypes.default.node,

  /**
   * Title to be displayed on tile.
   */
  title: _propTypes.default.node,

  /**
   * Position of the title bar.
   */
  titlePosition: _propTypes.default.oneOf(['top', 'bottom'])
} : void 0;

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiGridListTileBar'
})(GridListTileBar);

exports.default = _default;