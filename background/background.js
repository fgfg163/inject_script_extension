const global = window;

const chromep = new ChromePromise();
const { storageKey, storageSourceKey } = defaultSetting;

let theModal = '';
let theRunScript = '';

global.initScript = function () {
  co(function *() {
    let valueArray;
    valueArray = yield chromep.storage.local.get([storageKey, storageSourceKey]);
    let source = valueArray[storageSourceKey];

    if (valueArray[storageKey]) {
      theModal = valueArray[storageKey].mode;

      if (theModal && theModal != 'close') {
        const container = document.createElement('div');
        container.innerHTML = source;
        const scriptDomList = container.querySelectorAll('script');
        scriptDomList.forEach(function (script) {
          container.removeChild(script);
        });
        document.head.appendChild(container);
        const scriptDomListArray = Array.from(scriptDomList);

        let scriptPromiseList = scriptDomListArray.map(script => {
          if (!!script.src) {
            const theSrc = script.src.replace(/^.*?:\/\//, 'http://');
            return fetch(theSrc).then(v => v.text()).catch(err => `;(function(){console.error('GET ${theSrc}');})();`);
          } else {
            return Promise.resolve(script.innerText);
          }
        });

        let scriptTextList = yield Promise.all(scriptPromiseList);
        theRunScript = scriptTextList.join('\n;\n');
        theRunScript = JSON.stringify(theRunScript);

        chrome.tabs.query({}, function (tabs) {
          tabs.forEach(tab => {
            if (tab.url.slice(0, 7) === 'http://' || tab.url.slice(0, 8) === 'https://') {
              chrome.tabs.executeScript(tab.id, {
                code: `;(${function (s) {
                  const theScript = document.createElement('script');
                  theScript.innerHTML = s;
                  document.querySelector('*').appendChild(theScript);
                }.toString()})(${theRunScript});`,
                allFrames: true,
                runAt: theModal,
              });
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
  if (theModal && theModal !== 'close') {
    if (changeInfo.status === 'loading') {
      if (tab.url.slice(0, 7) === 'http://' || tab.url.slice(0, 8) === 'https://') {
        chrome.tabs.executeScript(tabId, {
          code: `;(${function (s) {
            const theScript = document.createElement('script');
            theScript.innerHTML = s;
            document.querySelector('*').appendChild(theScript);
          }.toString()})(${theRunScript});`,
          allFrames: true,
          runAt: theModal,
        });
      }
    }
  }
});