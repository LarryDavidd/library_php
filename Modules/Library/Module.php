<?php

namespace Modules\Library;

use System\Contracts\IModule;
use System\Contracts\IRouter;
use Modules\Library\Controllers\Index as C;

class Module implements IModule {
    public function registerRoutes(IRouter $router) : void {
        $router->addRoute('/^api\/books\/search\/?$/', C::class, 'searchAction');
        $router->addRoute('/^api\/authors\/?$/', C::class, 'getAuthors');
        $router->addRoute('/^api\/genres\/?$/', C::class, 'getGenres');
        $router->addRoute('/^api\/parse\/?$/', C::class, 'parseBooks');
    }
}