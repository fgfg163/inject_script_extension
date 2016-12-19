(function () {
  function addHTML(parent, source) {
    parent = parent || 'body';
    var parentDom = document.querySelector(parent);
    if (!parentDom) {
      parentDom = document.body;
    }

    var container = document.createElement('div');
    container.innerHTML = source;
    var scriptDomList = container.querySelectorAll("script");
    scriptDomList.forEach(function (script) {
      container.removeChild(script);
    });

    parentDom.appendChild(container);

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

        if (!!element.src && !element.async) {
          script.onerror = script.onload = function () {
            resolve();
          }
        }

        container.appendChild(script);

        if (!element.src || element.async) {
          resolve();
        }
      });
    }

    var theIterator = Promise.resolve();
    scriptDomList.forEach(function (element) {
      theIterator = theIterator.then(function () {
        return loadScript(element);
      });
    });
  }

  var theKey = "injectScriptToIframe";
  var theInputDom = document.querySelector('#input');
  var theButtonDom = document.querySelector('#save');

  chrome.storage.sync.get(theKey, function (valueArray) {
    if (valueArray[theKey]) {
      addHTML(valueArray[theKey].parent, valueArray[theKey].source);
    }
  })
})();