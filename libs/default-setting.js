(function () {
  const option = {
    storageKey: "injectScriptToIframe",
  };

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports.default = option;
  } else {
    window["defaultSetting"] = option;
  }
})();