<?php

namespace Modules\Library\Models;

use System\Model;
use System\Database\QuerySelect;
use System\Database\SelectBuilder;

class Books extends Model
{
    protected static $instance;
    protected string $table = 'Books';
    protected string $pk = 'book_id';

    public function searchBooks(?string $title = null, array $authorIds = [], array $genreIds = [])
    {
        $query = new QuerySelect(
            $this->db,
            (new SelectBuilder('Books b'))
                ->select([
                    'b.id',
                    'b.title',
                    'b.description',
                    'b.image_path',
                    'GROUP_CONCAT(DISTINCT CONCAT(a.last_name, " ", a.first_name, IFNULL(CONCAT(" ", a.middle_name), "")) ORDER BY a.last_name, a.first_name SEPARATOR ", ") AS authors',
                    'GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ", ") AS genres'
                ])
                ->join('Book_Author ba', 'b.id = ba.book_id')
                ->join('Authors a', 'ba.author_id = a.id')
                ->join('Book_Genre bg', 'b.id = bg.book_id')
                ->join('Genres g', 'bg.genre_id = g.id')
                ->groupBy('b.id')
        );

        if (!empty($title)) {
            $query->where("(b.title LIKE :title OR b.description LIKE :title)", [
                ':title' => '%' . $title . '%'
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
        'book_id' => ['locked'],
        'title' => ['not_empty', 'max_length' => 255],
        'description' => [],
        'image_path' => ['max_length' => 255]
    ];
}