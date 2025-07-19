<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

echo json_encode([
    "GET_route" => $_GET['route'] ?? 'NO ROUTE PARAMETER',
    "REQUEST_URI" => $_SERVER["REQUEST_URI"] ?? 'not set',
    "QUERY_STRING" => $_SERVER["QUERY_STRING"] ?? 'not set',
    "all_GET" => $_GET,
    "all_SERVER_keys" => array_keys($_SERVER)
], JSON_PRETTY_PRINT);
?>