co(function *() {
  const chromep = new ChromePromise();
  const {storageKey} = defaultSetting;

  var valueArray = yield chromep.storage.sync.get(storageKey);
  if (valueArray[storageKey]) {
    var parent = valueArray[storageKey].parent || 'body';
    var source = valueArray[storageKey].source;
    var mode = valueArray[storageKey].mode;

    if (mode == "document_start") {
      var container = document.createElement('div');
      container.innerHTML = source;
      var scriptDomList = container.querySelectorAll("script");
      scriptDomList.forEach(function (script) {
        container.removeChild(script);
      });
      document.head.appendChild(container);
      var scriptDomListArray = Array.from(scriptDomList);
      for (var key in scriptDomListArray) {
        var element = scriptDomListArray[key];
        var result = yield loadScript(element);
      }
    } else {
    }
  }
});