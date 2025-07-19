<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = "localhost";
$username = "u875897750_dharck";
$password = "Jose35//";
$database = "u875897750_basededatos";

try {
    // Probar conexión
    $conn = new mysqli($host, $username, $password, $database);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Probar consulta simple
    $result = $conn->query("SELECT 1 as test");
    if (!$result) {
        throw new Exception("Error en consulta de prueba: " . $conn->error);
    }
    
    // Verificar tablas existentes
    $tables_result = $conn->query("SHOW TABLES");
    $tables = [];
    if ($tables_result) {
        while ($row = $tables_result->fetch_array()) {
            $tables[] = $row[0];
        }
    }
    
    echo json_encode([
        "status" => "success",
        "message" => "Conexión a base de datos exitosa",
        "database" => $database,
        "tables" => $tables,
        "timestamp" => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "timestamp" => date('Y-m-d H:i:s')
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>