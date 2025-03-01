(function(){function errMsg(errCode, msg) {
  return (msg || "") + " (SystemJS Error#" + errCode + " " + "https://git.io/JvFET#" + errCode + ")";
}/*
 * Support for a "transform" loader interface
 */
(function (global) {
  var systemJSPrototype = global.System.constructor.prototype;

  var instantiate = systemJSPrototype.instantiate;
  systemJSPrototype.instantiate = function (url, parent) {
    if (url.slice(-5) === '.wasm')
      return instantiate.call(this, url, parent);

    var loader = this;
    return fetch(url, { credentials: 'same-origin' })
    .then(function (res) {
      if (!res.ok)
        throw Error(errMsg(9,  'Fetch error: ' + res.status + ' ' + res.statusText + (parent ? ' loading from ' + parent : '')));
      return res.text();
    })
    .then(function (source) {
      return loader.transform.call(this, url, source);
    })
    .then(function (source) {
      (0, eval)(source + '\n//# sourceURL=' + url);
      return loader.getRegister();
    });
  };

  // Hookable transform function!
  systemJSPrototype.transform = function (_id, source) {
    return source;
  };
})(typeof self !== 'undefined' ? self : global);}());