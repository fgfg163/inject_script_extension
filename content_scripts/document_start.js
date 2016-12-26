co(function *() {
  const chromep = new ChromePromise();
  const {storageKey, storageSourceKey, storageSourceKeySuffixMax} = defaultSetting;

  var sourceKeyList = [];
  for (let key = 0; key < storageSourceKeySuffixMax; key++) {
    let theKey = storageSourceKey + "-" + key;
    sourceKeyList.push(theKey);
  }

  var valueArray = yield chromep.storage.sync.get([].concat([storageKey], sourceKeyList));
  var source = sourceKeyList.map(e => valueArray[e]).join("");

  if (valueArray[storageKey]) {
    var parent = valueArray[storageKey].parent || 'body';
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
      // for (var key in scriptDomListArray) {
      //   var element = scriptDomListArray[key];
      //   var result = yield loadScript(element);
      // }
      var result = scriptDomListArray.filter(e => !!e.innerText);

    } else {
    }
  }
}).catch(function (err) {
  console.error(err);
  throw err;
});
