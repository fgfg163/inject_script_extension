# inject_script_extension

Inject script tag to any html!

Write parent query selector and script tags will append into this dom.
Don't forget to click save btn!

![](https://github.com/fgfg163/inject_script_extension/blob/master/README/example.jpg?raw=true)
log v0.0.7
```
Rebuild with co.js and generator/yield.
Change project structure.
Add document_start and document_idle:
  In document_start mode, you can load script to head and run before body loading, so you can run script before page's most of the time.
  In document_idle mode, you can run script after page onloaded.

```
log v0.0.5
```
add async suport to <script>. Now you can set async=false to script and it would not wait for loaded.

```

log v0.0.4
```
when a script fail, it will load next script.
add ctrl+s to save script.

```