<?php

namespace System;

class Template{
	public static function render($pathToTemplate, $vars = []) : string {
		extract($vars);
		ob_start();
		include($pathToTemplate);
		return ob_get_clean();
	}
}