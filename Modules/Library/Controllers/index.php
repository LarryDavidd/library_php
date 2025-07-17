<?php

namespace Modules\Library\Controllers;

use Modules\_base\Controller as BaseController;
use Modules\Library\Models\Books as ModelsBooks;
use Modules\Library\Models\Authors as ModelsAuthors;
use Modules\Library\Models\Genres as ModelsGenres;
use Modules\Library\Services\Parser;
use System\Exceptions\ExcAccess;
use System\Template;

class Index extends BaseController{
	protected ModelsBooks $modelBooks;
	protected ModelsAuthors $modelAuthors;
	protected ModelsGenres $modelGenres;

	public function __construct(){
		$this->modelBooks = ModelsBooks::getInstance();
		$this->modelAuthors = ModelsAuthors::getInstance();
		$this->modelGenres = ModelsGenres::getInstance();
	}

  public function getAuthors() {
    $authors = $this->modelAuthors->all();
		
		header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $authors
        ]);
        exit;

  }

  public function getGenres() {
    $genres = $this->modelGenres->all();
		
		header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $genres
    ]);
    exit;

  }

  public function searchAction() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $title = $data['title'] ?? null;
    $authorIds = $data['authors'] ?? [];
    $genreIds = $data['genres'] ?? [];
    
    $books = $this->modelBooks->searchBooks($title, $authorIds, $genreIds);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $books
    ]);
    exit;
  }

  public function parseBooks() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $pages_num = $data['pages_num'] ?? 2;
    try {
      $parser = new Parser();
      $parser->clearDatabase();
      $parser->parseAndInsertData($pages_num);
      
      header('Content-Type: application/json');
      echo json_encode([
          'success' => true,
          'message' => 'База успешно обновлена',
          'count' => $parser->getLastInsertCount()
      ]);
      exit;
    } catch (ExcAccess $e) {
      http_response_code(500);
      echo json_encode([
          'success' => false,
          'message' => 'Ошибка при парсинге: ' . $e->getMessage()
      ]);
    }
}
}