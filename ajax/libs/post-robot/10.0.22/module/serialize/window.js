"use strict";

exports.__esModule = true;
exports.serializeWindow = serializeWindow;
exports.deserializeWindow = deserializeWindow;
exports.ProxyWindow = void 0;

var _src = require("cross-domain-utils/src");

var _src2 = require("zalgo-promise/src");

var _src3 = require("belter/src");

var _src4 = require("universal-serialize/src");

var _conf = require("../conf");

var _global = require("../global");

var _lib = require("../lib");

var _bridge = require("../bridge");

function cleanupProxyWindows() {
  const idToProxyWindow = (0, _global.globalStore)('idToProxyWindow');

  for (const id of idToProxyWindow.keys()) {
    // $FlowFixMe
    if (idToProxyWindow.get(id).shouldClean()) {
      idToProxyWindow.del(id);
    }
  }
}

function getSerializedWindow(winPromise, {
  send,
  id = (0, _src3.uniqueID)()
}) {
  let windowName;
  return {
    id,
    getType: () => winPromise.then(win => {
      return (0, _src.getOpener)(win) ? _src.WINDOW_TYPE.POPUP : _src.WINDOW_TYPE.IFRAME;
    }),
    getInstanceID: (0, _src3.memoizePromise)(() => winPromise.then(win => (0, _lib.getWindowInstanceID)(win, {
      send
    }))),
    close: () => winPromise.then(_src.closeWindow),
    getName: () => winPromise.then(win => {
      if ((0, _src.isWindowClosed)(win)) {
        return;
      }

      return windowName;
    }),
    focus: () => winPromise.then(win => {
      win.focus();
    }),
    isClosed: () => winPromise.then(win => {
      return (0, _src.isWindowClosed)(win);
    }),
    setLocation: href => winPromise.then(win => {
      if ((0, _src.isSameDomain)(win)) {
        try {
          if (win.location && typeof win.location.replace === 'function') {
            // $FlowFixMe
            win.location.replace(href);
            return;
          }
        } catch (err) {// pass
        }
      }

      win.location = href;
    }),
    setName: name => winPromise.then(win => {
      if (__POST_ROBOT__.__IE_POPUP_SUPPORT__) {
        (0, _bridge.linkWindow)({
          win,
          name
        });
      }

      const sameDomainWin = (0, _src.assertSameDomain)(win);
      sameDomainWin.name = name;

      if (sameDomainWin.frameElement) {
        sameDomainWin.frameElement.setAttribute('name', name);
      }

      windowName = name;
    })
  };
}

class ProxyWindow {
  constructor({
    send,
    win,
    serializedWindow
  }) {
    this.id = void 0;
    this.isProxyWindow = true;
    this.serializedWindow = void 0;
    this.actualWindow = void 0;
    this.actualWindowPromise = void 0;
    this.send = void 0;
    this.name = void 0;
    this.actualWindowPromise = new _src2.ZalgoPromise();
    this.serializedWindow = serializedWindow || getSerializedWindow(this.actualWindowPromise, {
      send
    });
    (0, _global.globalStore)('idToProxyWindow').set(this.getID(), this);

    if (win) {
      this.setWindow(win, {
        send
      });
    }
  }

  getID() {
    return this.serializedWindow.id;
  }

  getType() {
    return this.serializedWindow.getType();
  }

  isPopup() {
    return this.getType() === _src.WINDOW_TYPE.POPUP;
  }

  setLocation(href) {
    return this.serializedWindow.setLocation(href).then(() => this);
  }

  getName() {
    return this.serializedWindow.getName();
  }

  setName(name) {
    return this.serializedWindow.setName(name).then(() => this);
  }

  close() {
    return this.serializedWindow.close().then(() => this);
  }

  focus() {
    return _src2.ZalgoPromise.all([this.isPopup() && this.getName().then(name => {
      if (name) {
        window.open('', name);
      }
    }), this.serializedWindow.focus()]).then(() => this);
  }

  isClosed() {
    return this.serializedWindow.isClosed();
  }

  getWindow() {
    return this.actualWindow;
  }

  setWindow(win, {
    send
  }) {
    this.actualWindow = win;
    this.actualWindowPromise.resolve(this.actualWindow);
    this.serializedWindow = getSerializedWindow(this.actualWindowPromise, {
      send,
      id: this.getID()
    });
    (0, _global.windowStore)('winToProxyWindow').set(win, this);
  }

  awaitWindow() {
    return this.actualWindowPromise;
  }

  matchWindow(win, {
    send
  }) {
    return _src2.ZalgoPromise.try(() => {
      if (this.actualWindow) {
        return win === this.actualWindow;
      }

      return _src2.ZalgoPromise.hash({
        proxyInstanceID: this.getInstanceID(),
        knownWindowInstanceID: (0, _lib.getWindowInstanceID)(win, {
          send
        })
      }).then(({
        proxyInstanceID,
        knownWindowInstanceID
      }) => {
        const match = proxyInstanceID === knownWindowInstanceID;

        if (match) {
          this.setWindow(win, {
            send
          });
        }

        return match;
      });
    });
  }

  unwrap() {
    return this.actualWindow || this;
  }

  getInstanceID() {
    return this.serializedWindow.getInstanceID();
  }

  shouldClean() {
    return Boolean(this.actualWindow && (0, _src.isWindowClosed)(this.actualWindow));
  }

  serialize() {
    return this.serializedWindow;
  }

  static unwrap(win) {
    return ProxyWindow.isProxyWindow(win) // $FlowFixMe
    ? win.unwrap() : win;
  }

  static serialize(win, {
    send
  }) {
    cleanupProxyWindows();
    return ProxyWindow.toProxyWindow(win, {
      send
    }).serialize();
  }

  static deserialize(serializedWindow, {
    send
  }) {
    cleanupProxyWindows();
    return (0, _global.globalStore)('idToProxyWindow').get(serializedWindow.id) || new ProxyWindow({
      serializedWindow,
      send
    });
  }

  static isProxyWindow(obj) {
    // $FlowFixMe
    return Boolean(obj && !(0, _src.isWindow)(obj) && obj.isProxyWindow);
  }

  static toProxyWindow(win, {
    send
  }) {
    cleanupProxyWindows();

    if (ProxyWindow.isProxyWindow(win)) {
      // $FlowFixMe
      return win;
    } // $FlowFixMe


    const actualWindow = win;
    return (0, _global.windowStore)('winToProxyWindow').get(actualWindow) || new ProxyWindow({
      win: actualWindow,
      send
    });
  }

}

exports.ProxyWindow = ProxyWindow;

function serializeWindow(destination, domain, win, {
  send
}) {
  return (0, _src4.serializeType)(_conf.SERIALIZATION_TYPE.CROSS_DOMAIN_WINDOW, ProxyWindow.serialize(win, {
    send
  }));
}

function deserializeWindow(source, origin, win, {
  send
}) {
  return ProxyWindow.deserialize(win, {
    send
  });
}