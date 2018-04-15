<?php // Simple PHP app...

define('__DEBUG__', true);

function array_get(array $array, $key, $default = null) {
  return isset($array[$key]) ? $array[$key] : $default;
}

ob_start();

session_start();

register_shutdown_function(function() {
  if (error_get_last() !== null) {
    ob_clean();
    http_response_code(500); // Could do a 202 error (if ajax request) and redirect to the relevant error page!
    echo '<div class="error server-error"><h3>Oops, something went wrong!</h3>', PHP_EOL;
    if (__DEBUG__) { echo '<hr><pre>', print_r(error_get_last(), true), '</pre>'; }
    echo PHP_EOL, '</div>';
	}
});

$request = new stdClass();
$request->urlBase = '/happy2/';
$request->url = $_SERVER['REQUEST_URI'];
$request->method = $_SERVER['REQUEST_METHOD'];
$request->back = isset($_SERVER['HTTP_REFERER']);
$request->isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']);
$request->parts = explode('?', $request->url);
$request->pageref = trim(substr($request->parts[0], strlen($request->urlBase)), '/');
$request->query = isset($request->parts[1]) ? $request->parts[1] : '';

$app = new stdClass();
$app->id = 'Happy2JS';
$app->request = $request;
$app->homepage = 'example1';
$app->currentPage = $request->pageref ?: $request->homepage;
$app->state = array_get($_SESSION, $app->id, []);
$app->rootPath = 'C:/UniServerZ/vhosts/NM/happy2';
$app->appPath = $app->rootPath . '/app';
$app->servicesPath = $app->appPath . '/services';
$app->partialsPath = $app->appPath . '/partials';
$app->controllerPath = $app->appPath . '/pages/' . $app->currentPage; 

require $app->servicesPath . '/ui.php';
require $app->controllerPath . '/' . $app->currentPage . '.php';

// echo '<pre>', print_r($app, true), '</pre>';
// echo '<pre>', print_r($_SERVER, true), '</pre>';
// echo '<pre>', print_r($_SESSION, true), '</pre>';

$_SESSION[$app->id] = $app->state;

ob_end_flush();
