(function () {
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  }
  var theKey = "injectScriptToIframe";

  chrome.storage.sync.get(theKey, function (valueArray) {
    if (valueArray[theKey]) {
      $('#input')[0].value = valueArray[theKey].source;
      $('#parent_selector')[0].value = valueArray[theKey].parent;
      var modeDom = $(`[name="mode"][value="${valueArray[theKey].mode}"]`);
      if (modeDom.length > 0) {
        modeDom[0].checked = 'checked';
      }
    }
  })


  function onSaveClick(event) {
    var theSource = $('#input')[0].value;
    var theParent = $('#parent_selector')[0].value;
    var theMode = $('[name="mode"]:checked')[0].value;
    chrome.storage.sync.set(
      {
        [theKey]: {
          source: theSource,
          parent: theParent,
          mode: theMode
        }
      },
      function () {
        $('#extra')[0].innerText = "save success !";
        setTimeout(function () {
          $('#extra')[0].innerText = "";
        }, 2000);
      });
  }

  $('#save')[0].addEventListener('click', onSaveClick, false);

  function onSaveKeyup(event) {
    if (event.ctrlKey == true && event.keyCode == 19) {
      onSaveClick(event);
    }
  }

  $('#input')[0].addEventListener('keypress', onSaveKeyup, false);
  $('#parent_selector')[0].addEventListener('keypress', onSaveKeyup, false);
  $('[name="mode"]').forEach(function (element) {
    element.addEventListener('keypress', onSaveKeyup, false);
  });
})();