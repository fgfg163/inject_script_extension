(function () {
  function addHTML(parent, source) {
    parent = parent || 'body';
    var parentDom = document.querySelector(parent);
    if (!parentDom) {
      parentDom = document.body;
    }


    var scriptStrList = source.match(/<script(.*?)>(.*?)<\/script>/g);
    var result = source.replace(/<script(.*?)>(.*?)<\/script>/g, "");

    var container = document.createElement('div');
    container.innerHTML = scriptStrList.join("");
    var scriptDomList = container.querySelectorAll("script");

    container.innerHTML = result;
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

        if (!!element.src) {
          script.onload = script.onreadystatechange = function () {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
              resolve();
            }
          }
        }

        container.appendChild(script);

        if (!element.src) {
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