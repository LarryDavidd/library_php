<?php

include_once('init.php');

use System\Exceptions\Exc404;
use System\Router;
use System\ModulesDispatcher;

use Modules\Library\Module as Library;

const BASE_URL = '/library_php/';
const DB_HOST = 'localhost';
const DB_NAME = 'library';
const DB_USER = 'root';
const DB_PASS = '';

try{	
	$modules = new ModulesDispatcher();
	$modules->add(new Library());
	$router = new Router(BASE_URL);

	$modules->registerRoutes($router);

	$uri = $_SERVER['REQUEST_URI'];

	$activeRoute = $router->resolvePath($uri);

	$c = $activeRoute['controller'];
	$m = $activeRoute['method'];

	$c->$m();
	$html = $c->render();
	echo $html;
}
catch(Exc404 $e){
	echo '404'; 
}
catch(Throwable $e){
	echo 'error - ' . $e->getMessage();
}