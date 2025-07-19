<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

echo json_encode([
    "REQUEST_URI" => $_SERVER["REQUEST_URI"] ?? "not set",
    "SCRIPT_NAME" => $_SERVER["SCRIPT_NAME"] ?? "not set", 
    "PATH_INFO" => $_SERVER["PATH_INFO"] ?? "not set",
    "QUERY_STRING" => $_SERVER["QUERY_STRING"] ?? "not set",
    "REQUEST_METHOD" => $_SERVER["REQUEST_METHOD"] ?? "not set",
    "HTTP_HOST" => $_SERVER["HTTP_HOST"] ?? "not set",
    "REDIRECT_URL" => $_SERVER["REDIRECT_URL"] ?? "not set",
    "ORIGINAL_URI" => $_SERVER["ORIGINAL_URI"] ?? "not set",
    "all_server_vars" => array_keys($_SERVER)
], JSON_PRETTY_PRINT);
?>