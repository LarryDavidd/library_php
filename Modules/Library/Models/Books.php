<?php

namespace Modules\Library\Models;

use System\Model;
use System\Database\QuerySelect;
use System\Database\SelectBuilder;

class Books extends Model{
	protected static $instance;
	protected string $table = 'books';
	protected string $pk = 'id_books';

	public function searchBooks($title = null, $authorIds = [], $genreIds = []) {
		$query = new QuerySelect(
			$this->db,
			(new SelectBuilder('books b'))
				->select([
					'b.id',
					'b.title',
					'b.description',
					'b.image_url',
					'GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ", ") AS authors',
					'GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ", ") AS genres'
				])
				->join('book_author ba', 'b.id = ba.book_id')
				->join('authors a', 'ba.author_id = a.id')
				->join('book_genre bg', 'b.id = bg.book_id')
				->join('genres g', 'bg.genre_id = g.id')
				->groupBy('b.id')
		);

		if (!empty($title)) {
			$query->where("MATCH(b.title, b.description) AGAINST(:title IN BOOLEAN MODE)", [
				':title' => $title
			]);
		}

		if (!empty($authorIds)) {
			$placeholders = implode(',', array_fill(0, count($authorIds), '?'));
			$query->where("a.id IN ($placeholders)", $authorIds);
		}

		if (!empty($genreIds)) {
			$placeholders = implode(',', array_fill(0, count($genreIds), '?'));
			$query->where("g.id IN ($placeholders)", $genreIds);
		}
		
		$query->order('b.title');

		return $query->get();
	}

	protected array $validationRules = [
		'id' => ['locked'],
		'title' => ['not_empty'],
		'content' => ['not_empty'],
		'dt' => ['locked'],
	];
}