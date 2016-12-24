co(function*() {
  const chromep = new ChromePromise();
  const {storageKey} = defaultSetting;
  const fileReader = FileReaderPromise();

  const onSaveClick = (event) => {
    co(function *() {
      let theSource = $('#input').val();
      let theParent = $('#parent_selector').val();
      let theMode = $('[name="mode"]:checked').val();
      yield chromep.storage.sync.set({
        [storageKey]: {
          source: theSource,
          parent: theParent,
          mode: theMode
        }
      });
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

  let valueArray = yield chromep.storage.sync.get(storageKey);
  if (valueArray[storageKey]) {
    $('#input').val(valueArray[storageKey].source);
    $('#parent_selector').val(valueArray[storageKey].parent);
    $(`[name="mode"][value="${valueArray[storageKey].mode}"]`).attr('checked', 'true');
  }
});