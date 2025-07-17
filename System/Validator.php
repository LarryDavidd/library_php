<?php

namespace System;

class Validator{
	public array $scheme;
	public array $errors = [];

	public function __construct($scheme){
		$this->scheme = $scheme;
	}

	public function run(array $fields) : bool{
		$this->errors = [];

		foreach($fields as $name => $value){
			$rules = $this->scheme[$name];

			foreach($rules as $rule){
				if($rule === 'not_empty' && $value == ''){
					if(!isset($this->errors[$name])){
						$this->errors[$name] = [];
					}

					$this->errors[$name][] = 'not_empty';
				}
			}
		}

		return count($this->errors) == 0;
	}

	public function getErrors() : array{
		return $this->errors;
	}
}