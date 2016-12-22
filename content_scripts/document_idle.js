co(function *() {
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  }

  function chromeStorageSyncGet(key) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get(key, function (valueArray) {
        resolve(valueArray);
      });
    });
  }

  function loadScript(element) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      element.async && (script.async = element.async);
      element.type && (script.type = element.type);
      element.charset && (script.charset = element.charset);
      element.defer && (script.defer = element.defer);
      if (!!element.src) {
        script.src = element.src;
      } else {
        script.innerHTML = element.innerHTML;
      }
      var elementAsync = element.getAttribute("async");
      elementAsync = elementAsync == true || elementAsync == null ? true : false;
      if (!!element.src && elementAsync) {
        script.onerror = script.onload = function () {
          resolve();
        }
      }

      document.head.appendChild(script);

      if (!element.src || !elementAsync) {
        resolve();
      }
    });
  }

  function loadScriptAsync(source) {
    document.write(source);
  }

  var theKey = "injectScriptToIframe";
  var valueArray = yield chromeStorageSyncGet(theKey);
  if (valueArray[theKey]) {
    var parent = valueArray[theKey].parent || 'body';
    var source = valueArray[theKey].source;
    var mode = valueArray[theKey].mode;

    var parentDom = $(parent)[0];
    if (!parentDom) {
      parentDom = document.body;
    }

    if (mode == "document_start") {
    } else {
      var container = document.createElement('div');
      container.innerHTML = source;
      var scriptDomList = container.querySelectorAll("script");
      scriptDomList.forEach(function (script) {
        container.removeChild(script);
      });
      parentDom.appendChild(container);
      var scriptDomListArray = Array.from(scriptDomList);
      for (var key in scriptDomListArray) {
        var element = scriptDomListArray[key];
        var result = yield loadScript(element);
      }
    }
  }
});