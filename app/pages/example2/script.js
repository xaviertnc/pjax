window.F1 = window.F1 || { afterPageLoadScripts: [] };
F1.afterPageLoadScripts.push(function initPage2() {
  console.log('This is AFTER Page 2 loaded succesfully!');
});
