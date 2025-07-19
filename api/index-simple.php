<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Obtener la ruta
$request_uri = $_SERVER["REQUEST_URI"];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace("/api", "", $path);
$path_parts = explode("/", trim($path, "/"));

$method = $_SERVER["REQUEST_METHOD"];

// Router simple
switch ($path_parts[0]) {
    case "health":
        echo json_encode([
            "status" => "OK",
            "message" => "API funcionando sin base de datos",
            "timestamp" => date("Y-m-d H:i:s"),
            "method" => $method,
            "path" => $path
        ]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            "error" => "Endpoint no encontrado",
            "path" => $path,
            "available_endpoints" => ["/health"]
        ]);
        break;
}
?>