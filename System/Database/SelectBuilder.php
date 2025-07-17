<?php

namespace System\Database;
use Exception;

class SelectBuilder {
    public string $table;
    protected array $fields = ['*'];
    protected array $addons = [
        'join' => [],
        'where' => null,
        'group_by' => null,
        'having' => null,
        'order_by' => null,
        'limit' => null
    ];

    public function __construct(string $table) {
        $this->table = $table;
    }

    public function fields(array $fields): self {
        $this->fields = $fields;
        return $this;
    }

    public function select(array $fields): self {
        return $this->fields($fields);
    }

    public function addWhere(string $where): self {
        if ($this->addons['where'] === null) {
            $this->addons['where'] = $where;
        } else {
            $this->addons['where'] .= ' AND ' . $where;
        }
        return $this;
    }

    public function join(string $table, string $condition, string $type = 'INNER'): self {
        $this->addons['join'][] = "$type JOIN $table ON $condition";
        return $this;
    }

    public function groupBy(string $column): self {
        $this->addons['group_by'] = $column;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'ASC'): self {
        $this->addons['order_by'] = "$column $direction";
        return $this;
    }

    public function limit(int $limit, ?int $offset = null): self {
        $this->addons['limit'] = $limit;
        if ($offset !== null) {
            $this->addons['limit'] .= " OFFSET $offset";
        }
        return $this;
    }

    public function having(string $condition): self {
        $this->addons['having'] = $condition;
        return $this;
    }

    public function __toString(): string {
        $activeCommands = [];
        
        if (!empty($this->addons['join'])) {
            $activeCommands[] = implode(' ', $this->addons['join']);
        }

        foreach ($this->addons as $command => $setting) {
            if ($setting !== null && $command !== 'join') {
                $sqlKey = str_replace('_', ' ', strtoupper($command));
                $activeCommands[] = "$sqlKey $setting";
            }
        }

        $fields = implode(', ', $this->fields);
        $addon = implode(' ', $activeCommands);
        return trim("SELECT $fields FROM {$this->table} $addon");
    }

    public function __call($name, $args): self {
        if (!array_key_exists($name, $this->addons)) {
            throw new Exception('SQL error: unknown method ' . $name);
        }

        $this->addons[$name] = $args[0];
        return $this;
    }
}