window.F1 = window.F1 || { afterPageLoadScripts: [] };
F1.afterPageLoadScripts.push(function initPage1() {
  console.log('This is AFTER Page 1 loaded succesfully!');
});
