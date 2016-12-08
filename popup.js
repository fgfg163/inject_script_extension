(function () {
  var theKey = "injectScriptToIframe";
  var theInputDom = document.querySelector('#input');
  var parentSelectorDom = document.querySelector('#parent_selector');
  var theButtonDom = document.querySelector('#save');

  chrome.storage.sync.get(theKey, function (valueArray) {
    if (valueArray[theKey]) {
      theInputDom.value = valueArray[theKey].source;
      parentSelectorDom.value = valueArray[theKey].parent;
    }
  })

  function onSaveClick(event) {
    var theSource = theInputDom.value;
    var theParent = parentSelectorDom.value;
    chrome.storage.sync.set({[theKey]: {source: theSource, parent: theParent}}, function (valueArray) {
    })
  }

  theButtonDom.addEventListener('click', onSaveClick, false);
})();