<?php

namespace System\Database;

class QuerySelect {
    protected Connection $db;
    protected SelectBuilder $builder;
    protected array $binds = [];

    public function __construct(Connection $db, SelectBuilder $builder) {
        $this->db = $db;
        $this->builder = $builder;
    }

    public function where(string $where, array $binds = []): self {
        $this->builder->addWhere($where);
        $this->binds = $binds + $this->binds;
        return $this;
    }

    public function limit(int $shift, ?int $cnt = null): self {
        $this->builder->limit($shift . (($cnt !== null) ? ",$cnt" : ''));
        return $this;
    }

    public function order(string $field, string $direction = 'ASC'): self {
        $this->builder->orderBy($field, $direction);
        return $this;
    }

    public function join(string $table, string $condition, string $type = 'INNER'): self {
        $this->builder->join($table, $condition, $type);
        return $this;
    }

    public function group(string $field): self {
        $this->builder->groupBy($field);
        return $this;
    }

    public function having(string $condition, array $binds = []): self {
        $this->builder->having($condition);
        $this->binds = $binds + $this->binds;
        return $this;
    }

    public function get(): array {
        return $this->db->select($this->builder, $this->binds);
    }

    public function first(): ?array {
        $this->limit(1);
        $result = $this->get();
        return $result[0] ?? null;
    }

    public function count(): int {
        $clone = clone $this;
        $clone->builder->resetSelect()->select('COUNT(*) as count');
        $result = $clone->first();
        return (int)($result['count'] ?? 0);
    }

    public function __invoke(): array {
        return $this->get();
    }
}