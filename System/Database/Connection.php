<?php

namespace System\Database;
use PDO;
use PDOStatement;

class Connection {
    public static $instance;
    protected PDO $db;
    protected bool $inTransaction = false;

    public static function getInstance(): static {
        if (static::$instance === null) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    protected function __construct() {
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS, [
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    }

    public function beginTransaction(): bool {
        if (!$this->inTransaction) {
            $this->inTransaction = $this->db->beginTransaction();
            return $this->inTransaction;
        }
        return false;
    }

    public function commit(): bool {
        if ($this->inTransaction) {
            $result = $this->db->commit();
            $this->inTransaction = false;
            return $result;
        }
        return false;
    }

    public function rollBack(): bool {
        if ($this->inTransaction) {
            $result = $this->db->rollBack();
            $this->inTransaction = false;
            return $result;
        }
        return false;
    }

    public function isInTransaction(): bool {
        return $this->inTransaction;
    }

    public function select(string $query, array $params = []): ?array {
        return $this->query($query, $params)->fetchAll();
    }

    public function query(string $query, array $params = []): PDOStatement {
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    public function lastInsertId(): int {
        return (int)$this->db->lastInsertId();
    }
}