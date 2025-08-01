<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Configuración de la base de datos
$host = "localhost";
$username = "u875897750_dharck";
$password = "Jose35//";
$database = "u875897750_basededatos";

// Crear conexión a la base de datos
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "error" => "Error de conexión a la base de datos",
        "details" => $conn->connect_error
    ]);
    exit();
}

// Obtener la ruta
$route = '';

// Método 1: Desde parámetro GET (reescritura .htaccess)
if (isset($_GET['route']) && !empty($_GET['route'])) {
    $route = $_GET['route'];
}
// Método 2: Extraer de REQUEST_URI si no hay parámetro
else if (isset($_SERVER["REQUEST_URI"])) {
    $request_uri = $_SERVER["REQUEST_URI"];
    // Remover query string si existe
    if (strpos($request_uri, '?') !== false) {
        $request_uri = substr($request_uri, 0, strpos($request_uri, '?'));
    }
    // Si termina en index.php, es una redirección de .htaccess
    if (strpos($request_uri, '/api/') === 0) {
        $route = substr($request_uri, 5); // Remover '/api/'
        if ($route === 'index.php') {
            $route = 'health'; // Ruta por defecto
        }
    }
}

// Si no hay ruta, usar health como default
if (empty($route)) {
    $route = 'health';
}

$path_parts = explode('/', trim($route, '/'));

// Router principal
switch ($path_parts[0]) {
    case "health":
        echo json_encode([
            "status" => "OK",
            "message" => "API funcionando correctamente",
            "timestamp" => date('Y-m-d H:i:s'),
            "version" => "1.0.0",
            "database" => "connected"
        ]);
        break;

    case "orders":
        // Manejar órdenes
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                try {
                    // Obtener órdenes
                    $sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 100";
                    $result = $conn->query($sql);
                    
                    if ($result) {
                        $orders = [];
                        while ($row = $result->fetch_assoc()) {
                            $orders[] = $row;
                        }
                        echo json_encode([
                            "status" => "success",
                            "data" => $orders,
                            "count" => count($orders)
                        ]);
                    } else {
                        throw new Exception("Error en la consulta: " . $conn->error);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode([
                        "error" => "Error al obtener órdenes",
                        "message" => $e->getMessage()
                    ]);
                }
                break;
                
            case 'POST':
                try {
                    // Crear nueva orden
                    $input = json_decode(file_get_contents('php://input'), true);
                    
                    if (!$input || !isset($input['customer_email']) || !isset($input['amount'])) {
                        http_response_code(400);
                        echo json_encode([
                            "error" => "Datos inválidos",
                            "message" => "Se requieren customer_email y amount"
                        ]);
                        break;
                    }
                    
                    $stmt = $conn->prepare("INSERT INTO orders (customer_email, amount, status, created_at) VALUES (?, ?, ?, NOW())");
                    $status = "pending";
                    $stmt->bind_param("sds", $input['customer_email'], $input['amount'], $status);
                    
                    if ($stmt->execute()) {
                        echo json_encode([
                            "status" => "success",
                            "message" => "Orden creada exitosamente",
                            "order_id" => $conn->insert_id
                        ]);
                    } else {
                        throw new Exception("Error al crear orden: " . $stmt->error);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode([
                        "error" => "Error al crear orden",
                        "message" => $e->getMessage()
                    ]);
                }
                break;
                
            default:
                http_response_code(405);
                echo json_encode([
                    "error" => "Método no permitido",
                    "message" => "Solo se permiten métodos GET y POST para /orders"
                ]);
                break;
        }
        break;

    case "exchange":
    case "exchange-rates":
        // Verificar si existe el archivo de rutas de exchange
        if (file_exists('routes/exchange.php')) {
            require_once 'routes/exchange.php';
        } else {
            echo json_encode([
                "status" => "success",
                "message" => "Endpoint de exchange disponible",
                "rates" => [
                    "USD_to_EUR" => 0.85,
                    "USD_to_GBP" => 0.73,
                    "EUR_to_USD" => 1.18
                ],
                "timestamp" => date('Y-m-d H:i:s')
            ]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "error" => "Endpoint no encontrado",
            "message" => "El endpoint solicitado no existe",
            "available_endpoints" => [
                "/health",
                "/orders", 
                "/exchange"
            ]
        ]);
        break;
}

$conn->close();
?>