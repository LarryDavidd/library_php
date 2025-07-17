<?php

namespace Modules\Library\Models;

use System\Model;

class Genres extends Model{
	protected static $instance;
	protected string $table = 'genres';
	protected string $pk = 'id_genres';

	protected array $validationRules = [
		'id' => ['locked'],
		'title' => ['not_empty'],
		'content' => ['not_empty'],
		'dt' => ['locked'],
	];
}