<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'u875897750_hostinger';
$username = 'u875897750_hostinger';
$password = 'Dharck2024@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar conexión
    $connectionStatus = [
        'status' => 'connected',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => $dbname
    ];
    
    // Obtener estadísticas de tablas
    $tables = ['orders', 'exchange_rates', 'order_status_history'];
    $tableStats = [];
    
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            $tableStats[$table] = $count;
        } catch (Exception $e) {
            $tableStats[$table] = 'Error: ' . $e->getMessage();
        }
    }
    
    // Obtener últimos pedidos
    $stmt = $pdo->query("
        SELECT id, order_number, customer_name, status, created_at, local_price, currency
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Estadísticas de pedidos por estado
    $stmt = $pdo->query("
        SELECT status, COUNT(*) as count 
        FROM orders 
        GROUP BY status
    ");
    $ordersByStatus = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ingresos totales
    $stmt = $pdo->query("
        SELECT 
            SUM(CASE WHEN status = 'completed' THEN local_price ELSE 0 END) as total_revenue,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
            COUNT(*) as total_orders
        FROM orders
    ");
    $revenue = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'connection' => $connectionStatus,
        'table_stats' => $tableStats,
        'recent_orders' => $recentOrders,
        'orders_by_status' => $ordersByStatus,
        'revenue_stats' => $revenue,
        'api_health' => [
            'status' => 'healthy',
            'version' => '1.4.0',
            'last_check' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos: ' . $e->getMessage(),
        'connection' => [
            'status' => 'failed',
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
}
?>