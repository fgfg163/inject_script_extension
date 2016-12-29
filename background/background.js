(function () {
  const chromep = new ChromePromise();
  const {storageKey, storageSourceKey, storageSourceKeySuffixMax} = defaultSetting;
  let theRunScript = "";

  co(function *() {
    let sourceKeyList = [];
    for (let key = 0; key < storageSourceKeySuffixMax; key++) {
      let theKey = storageSourceKey + "-" + key;
      sourceKeyList.push(theKey);
    }

    let valueArray = yield chromep.storage.sync.get([].concat([storageKey], sourceKeyList));
    let source = sourceKeyList.map(e => valueArray[e]).join("");

    if (valueArray[storageKey]) {
      let parent = valueArray[storageKey].parent || 'body';
      let mode = valueArray[storageKey].mode;

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
            let theSrc = script.src.replace(/^.*:\/\//, "http://");
            return fetch(theSrc).then(v => v.text()).catch(err => `console.error('GET ${theSrc}');`);
          } else {
            return Promise.resolve(script.innerText);
          }
        });

        let scriptTextList = yield Promise.all(scriptPromiseList);
        theRunScript = scriptTextList.join("\n;\n");
      }
    }
  }).catch(function (err) {
    console.error(err);
    throw err;
  });

  const initScript = co.wrap(function *(scriptObjList) {
    if (!scriptObjList || !Array.isArray(scriptObjList)) {
      return;
    }

    let resultPromiseList = [];

    for (let key in scriptObjList) {
      let script = scriptObjList[key];

    }
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    let theUrl = changeInfo.url || tab.url;
    if (changeInfo.status == "loading" && /^https?:\/\//.test(theUrl)) {
      chrome.tabs.executeScript(tabId, {
        code: theRunScript,
        allFrames: true,
        runAt: "document_start",
      });
    }
  });

  // chrome.webRequest.onCompleted.addListener(function (detail, ...param) {
  //     return {};
  //   }, {
  //     urls: ["<all_urls>"],
  //   },
  //   ["responseHeaders"]
  // );
})();
