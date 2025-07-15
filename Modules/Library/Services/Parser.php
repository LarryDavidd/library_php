<?php
namespace Modules\Library\Services;

use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Client;
use System\Database\Connection;
use Exception;

class Parser {
    private Client $httpClient;
    protected Connection $db;
    private int $lastInsertCount = 0;
    private string $baseUrl = 'https://litlife.club';
    
    public function __construct() {
        $this->db = Connection::getInstance();
        $this->httpClient = new Client([
            'base_uri' => $this->baseUrl,
            'timeout' => 10,
            'verify' => false
        ]);
    }
    
    public function clearDatabase(): void {
        $tables = ['book_author', 'book_genre', 'books', 'authors', 'genres'];
        
        try {
            $this->db->query('SET FOREIGN_KEY_CHECKS = 0');
            
            foreach ($tables as $table) {
                $this->db->query("TRUNCATE TABLE `$table`");
            }
            
            $this->db->query('SET FOREIGN_KEY_CHECKS = 1');
        } catch (Exception $e) {
            throw new Exception("Database clearing failed: " . $e->getMessage());
        }
    }
    
    public function parseAndInsertData(int $pages = 2): void {
        for ($page = 1; $page <= $pages; $page++) {
            $this->parsePage($page);
        }
        $this->lastInsertCount = $this->getBooksCount();
    }
    
    private function parsePage(int $page): void {
        $url = "/popular_books/year?page={$page}";
        $html = $this->fetchHtml($url);
        $crawler = new Crawler($html);
        
        $crawler->filter('div.card-body')->each(function (Crawler $book) {
            try {
                $imageUrl = $this->getImageUrl($book);
                $bookData = $this->parseBookData($book);
                
                if ($bookData && $imageUrl) {
                    $this->saveBookWithRelations($bookData, $imageUrl);
                }
            } catch (Exception $e) {
                error_log("Error parsing book: " . $e->getMessage());
            }
        });
    }
    
    private function fetchHtml(string $url): string {
        $response = $this->httpClient->get($url);
        return (string)$response->getBody();
    }
    
    private function getImageUrl(Crawler $book): ?string {
        $img = $book->filter('img')->first();
        if ($img->count() === 0) return null;
        
        $src = $img->attr('src') ?? $img->attr('data-src') ?? $img->attr('data-srcset');
        if (!$src) return null;
        
        return strpos($src, '//') === 0 ? 'https:' . $src : $src;
    }
    
    private function parseBookData(Crawler $book): array {
        return array_filter([
            'title' => $this->parseBookTitle($book),
            'genres' => $this->parseGenres($book),
            'authors' => $this->parseAuthors($book),
            'description' => $this->parseDescription($book)
        ], fn($value) => $value !== null);
    }
    
    private function parseBookTitle(Crawler $book): ?string {
        $title = $book->filter('h3.break-words.h5 a');
        return $title->count() ? trim($title->text()) : null;
    }
    
    private function parseGenres(Crawler $book): array {
        $html = $book->filter('div.col-12:not([class*=" "])')->html();
        return preg_match_all('/<a[^>]*>(.*?)<\/a>/', $html, $matches) 
            ? array_map('trim', $matches[1]) 
            : [];
    }
    
    private function parseAuthors(Crawler $book): array {
        $authors = [];
        $book->filter('a.author.name')->each(function (Crawler $author) use (&$authors) {
            $authors[] = [
                'name' => trim($author->text()),
                'link' => $author->attr('href')
            ];
        });
        return $authors;
    }
    
    private function parseDescription(Crawler $book): ?string {
        $desc = $book->filter('div.mt-3');
        return $desc->count() ? trim(str_replace('далее', '', $desc->text())) : null;
    }
    
    private function getOrCreateAuthor(array $authorInfo): int {
        $nameParts = preg_split('/\s+/', trim($authorInfo['name']));
        $nameParts = array_filter($nameParts);
        
        $firstName = $lastName = $middleName = null;
        
        switch (count($nameParts)) {
            case 1: $firstName = $nameParts[0]; break;
            case 2: 
                $lastName = $nameParts[0]; 
                $firstName = $nameParts[1]; 
                break;
            case 3: 
                $lastName = $nameParts[0]; 
                $firstName = $nameParts[1]; 
                $middleName = $nameParts[2]; 
                break;
        }
        
        $author = $this->db->select(
            "SELECT `id` FROM `authors` 
            WHERE `first_name` = ? AND `last_name` = ? 
            LIMIT 1",
            [$firstName, $lastName]
        );
        
        if (!empty($author)) {
            return $author[0]['id'];
        }
        
        $this->db->query(
            "INSERT INTO `authors` 
            (`first_name`, `last_name`, `middle_name`) 
            VALUES (?, ?, ?)",
            [$firstName, $lastName, $middleName]
        );
        
        return $this->db->lastInsertId();
    }
    
    private function getOrCreateGenre(string $genreName): int {
        $genre = $this->db->select(
            "SELECT `id` FROM `genres` WHERE `name` = ? LIMIT 1",
            [$genreName]
        );
        
        if (!empty($genre)) {
            return $genre[0]['id'];
        }
        
        $this->db->query(
            "INSERT INTO `genres` (`name`) VALUES (?)",
            [$genreName]
        );
        
        return $this->db->lastInsertId();
    }
    
    private function saveBookWithRelations(array $bookData, string $imageUrl): void {
        try {
            $this->db->beginTransaction();
            
            $this->db->query(
                "INSERT INTO `books` 
                (`title`, `description`, `image_path`) 
                VALUES (?, ?, ?)",
                [
                    $bookData['title'],
                    $bookData['description'] ?? null,
                    $imageUrl
                ]
            );
            $bookId = $this->db->lastInsertId();
            
            foreach ($bookData['authors'] as $author) {
                $authorId = $this->getOrCreateAuthor($author);
                $this->linkBookToAuthor($bookId, $authorId);
            }
            
            foreach ($bookData['genres'] as $genre) {
                $genreId = $this->getOrCreateGenre($genre);
                $this->linkBookToGenre($bookId, $genreId);
            }
            
            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    private function linkBookToAuthor(int $bookId, int $authorId): void {
        $this->db->query(
            "INSERT IGNORE INTO `book_author` (`book_id`, `author_id`) VALUES (?, ?)",
            [$bookId, $authorId]
        );
    }
    
    private function linkBookToGenre(int $bookId, int $genreId): void {
        $this->db->query(
            "INSERT IGNORE INTO `book_genre` (`book_id`, `genre_id`) VALUES (?, ?)",
            [$bookId, $genreId]
        );
    }
    
    private function getBooksCount(): int {
        $result = $this->db->select("SELECT COUNT(*) as count FROM `books`");
        return (int)($result[0]['count'] ?? 0);
    }
    
    public function getLastInsertCount(): int {
        return $this->lastInsertCount;
    }
}