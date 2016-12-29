(function (global) {
  const chromep = new ChromePromise();
  const {storageKey, storageSourceKey} = defaultSetting;

  let theParent = "";
  let theModal = "";
  let theRunScript = "";

  global.initScript = function () {
    co(function *() {
      let valueArray;
      valueArray = yield chromep.storage.local.get([storageKey, storageSourceKey]);
      let source = valueArray[storageSourceKey];

      if (valueArray[storageKey]) {
        let parent = theParent = valueArray[storageKey].parent || 'body';
        let mode = theModal = valueArray[storageKey].mode;

        if (mode && mode != "close") {
          let container = document.createElement('div');
          container.innerHTML = source;
          let scriptDomList = container.querySelectorAll("script");
          scriptDomList.forEach(function (script) {
            container.removeChild(script);
          });
          document.head.appendChild(container);
          let scriptDomListArray = Array.from(scriptDomList);

          let scriptPromiseList = scriptDomListArray.map(script => {
            if (!!script.src) {
              let theSrc = script.src.replace(/^.*?:\/\//, "http://");
              return fetch(theSrc).then(v => v.text()).catch(err => `console.error('GET ${theSrc}');`);
            } else {
              return Promise.resolve(script.innerText);
            }
          });

          let scriptTextList = yield Promise.all(scriptPromiseList);
          theRunScript = scriptTextList.join("\n;\n");

          chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
              if (/^https?:\/\//.test(tab.url)) {
                chrome.tabs.sendMessage(tab.id, {type: "SEND_SOURCE", parent, mode, source: theRunScript});
              }
            });
          });
        }
      }
    }).catch(function (err) {
      console.error(err);
      throw err;
    });
  }

  global.initScript();

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    let theUrl = changeInfo.url || tab.url;
    if (changeInfo.status == "loading" && /^https?:\/\//.test(theUrl)) {
      chrome.tabs.sendMessage(tabId, {type: "SEND_SOURCE", parent: theParent, mode: theModal, source: theRunScript});
    }
  });

  // chrome.webRequest.onCompleted.addListener(function (detail, ...param) {
  //     return {};
  //   }, {
  //     urls: ["<all_urls>"],
  //   },
  //   ["responseHeaders"]
  // );
})(window);
