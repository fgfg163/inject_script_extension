(function () {
  const option = {
    storageKey: "settings",
    storageSourceKey: "source",
    storageSourceKeySuffixMax: 10,
  };

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports.default = option;
  } else {
    window["defaultSetting"] = option;
  }
})();