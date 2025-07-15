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

	public function index(){
		$books = $this->modelBooks->all();
		
		$this->title = 'Book Page';
		$this->content = Template::render(__DIR__ . '/../Views/v_all.php', [
			'books' => $books
		]);
	}

  public function getAuthors() {
    $authors = $this->modelAuthors->all();
		
		header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $authors
        ]);
  }

  public function getGenres() {
    $genres = $this->modelGenres->all();
		
		header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $genres
        ]);
  }

  public function searchAction($request) {
    $data = json_decode($request->getBody(), true);

    $title = $data['title'] ?? null;
    $authorIds = $data['authors'] ?? [];
    $genreIds = $data['genres'] ?? [];
    
    $books = $this->modelBooks->searchBooks($title, $authorIds, $genreIds);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $books
    ]);
  }

  public function parseBooks() {
    try {
      $parser = new Parser();
        $parser->clearDatabase();
        $parser->parseAndInsertData();
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'База успешно обновлена',
            'count' => $parser->getLastInsertCount()
        ]);
    } catch (ExcAccess $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при парсинге: ' . $e->getMessage()
        ]);
    }
}
}