<?php

namespace Modules\Library\Models;

use System\Model;

class Authors extends Model{
	protected static $instance;
	protected string $table = 'authors';
	protected string $pk = 'id_authors';

	protected array $validationRules = [
		'id' => ['locked'],
		'title' => ['not_empty'],
		'content' => ['not_empty'],
		'dt' => ['locked'],
	];
}