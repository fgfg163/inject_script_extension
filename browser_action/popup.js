co(function*() {
  const chromep = new ChromePromise();
  const {storageKey, storageSourceKey, storageSourceKeySuffixMax} = defaultSetting;
  const fileReader = FileReaderPromise();

  const onSaveClick = (event) => {
    co(function *() {
      let theSource = $('#input').val();
      let theParent = $('#parent_selector').val();
      let theMode = $('[name="mode"]:checked').val();

      let theSourceArray = splitByLength(theSource, 7800);
      if (theSourceArray.length > storageSourceKeySuffixMax) {
        $('#extra')[0].innerHTML = `<span style="color:red">script is too large!!!</span>`;
        return;
      }

      let saveObj = {
        [storageKey]: {
          parent: theParent,
          mode: theMode
        }
      };


      for (let key = 0; key < storageSourceKeySuffixMax; key++) {
        let theKey = storageSourceKey + "-" + key;
        saveObj[theKey] = "";
      }

      theSourceArray.slice(0, storageSourceKeySuffixMax);
      theSourceArray.forEach((element, index) => {
        saveObj[storageSourceKey + "-" + index] = element;
      });

      yield chromep.storage.sync.set(saveObj);

      $('#extra')[0].innerHTML = `<span style="color:red">save success !</span>`;
      yield sleep(2000);
      $('#extra')[0].innerText = "";
    });
  }

  $('#save').on('click', onSaveClick);

  const onSaveKeyup = (event) => {
    if (event.ctrlKey == true && event.keyCode == 19) {
      onSaveClick(event);
    }
  }

  $(document.body).on('keypress', onSaveKeyup);


  $('#input').on('drop', (event) => {
    event.preventDefault();
    var fileList = event.originalEvent.dataTransfer.files;
    if (fileList.length == 0) {
      return false;
    }

    co(function*() {
      let result = yield fileReader.readAsText(fileList[0]);
      if (!(/<script>[\s\S]*<\/script>/.test(result))) {
        result = "<script>\n" + result + "\n</script>";
      }
      $('#input').val(result);
      onSaveClick();
    });
  });
  co(function*() {
    var sourceKeyList = [];
    for (let key = 0; key < storageSourceKeySuffixMax; key++) {
      let theKey = storageSourceKey + "-" + key;
      sourceKeyList.push(theKey);
    }
    var valueArray = yield chromep.storage.sync.get([].concat([storageKey], sourceKeyList));
    var source = sourceKeyList.map(e => valueArray[e]).join("");

    if (valueArray[storageKey]) {
      $('#parent_selector').val(valueArray[storageKey].parent);
      $(`[name="mode"][value="${valueArray[storageKey].mode}"]`).attr('checked', 'true');
      $('#input').val(source);
    }
  });
}).catch(function (err) {
  console.log(err.toString());
  console.error(err);
  throw err;
});