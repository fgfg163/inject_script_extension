(function () {
  var theKey = "injectScriptToIframe";
  var theInputDom = document.querySelector('#input');
  var parentSelectorDom = document.querySelector('#parent_selector');
  var theButtonDom = document.querySelector('#save');
  var extraDivDom = document.querySelector('#extra');

  chrome.storage.sync.get(theKey, function (valueArray) {
    if (valueArray[theKey]) {
      theInputDom.value = valueArray[theKey].source;
      parentSelectorDom.value = valueArray[theKey].parent;
    }
  })

  function onSaveClick(event) {
    var theSource = theInputDom.value;
    var theParent = parentSelectorDom.value;
    chrome.storage.sync.set({[theKey]: {source: theSource, parent: theParent}}, function () {
      extraDivDom.innerText = "save success !";
      setTimeout(function () {
        extraDivDom.innerText = "";
      }, 2000);
    })
  }

  theButtonDom.addEventListener('click', onSaveClick, false);

  function onSaveKeyup(event) {
    if (event.ctrlKey == true && event.keyCode == 19) {
      var theSource = theInputDom.value;
      var theParent = parentSelectorDom.value;
      chrome.storage.sync.set({[theKey]: {source: theSource, parent: theParent}}, function () {
        extraDivDom.innerText = "save success !";
        setTimeout(function () {
          extraDivDom.innerText = "";
        }, 2000);
      })
    }
  }

  theInputDom.addEventListener('keypress', onSaveKeyup, false);
  parentSelectorDom.addEventListener('keypress', onSaveKeyup, false);
})();