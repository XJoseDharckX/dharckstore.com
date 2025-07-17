<?php
// Script de prueba para verificar que la API funcione correctamente

header("Content-Type: application/json");

// Configuración de la base de datos
$host = "localhost";
$username = "u875897750_dharckstore";
$password = "Jose35//";
$database = "u875897750_hostinger";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión a la base de datos exitosa\n";
    
    // Verificar tablas
    $tables = ['sellers', 'games', 'products', 'exchange_rates', 'orders'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Tabla '$table' existe\n";
            
            // Contar registros
            $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
            echo "   - Registros: $count\n";
        } else {
            echo "❌ Tabla '$table' NO existe\n";
        }
    }
    
    // Probar creación de pedido
    echo "\n🧪 Probando creación de pedido...\n";
    
    $testOrder = [
        'customer_name' => 'Test Customer',
        'customer_email' => 'test@example.com',
        'customer_phone' => '+1234567890',
        'player_id' => 'TEST123',
        'product_id' => 1,
        'game_id' => 1,
        'base_price' => 10.00,
        'currency' => 'USD',
        'payment_method' => 'transferencia'
    ];
    
    // Generar número de orden único
    $orderNumber = 'ORD-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    // Obtener vendedor aleatorio
    $stmt = $pdo->query("SELECT id FROM sellers WHERE is_active = 1 ORDER BY RAND() LIMIT 1");
    $sellerId = $stmt->fetchColumn();
    
    if (!$sellerId) {
        echo "❌ No hay vendedores activos\n";
        exit;
    }
    
    // Obtener tasa de cambio
    $stmt = $pdo->prepare("SELECT rate FROM exchange_rates WHERE from_currency = 'USD' AND to_currency = 'VES' AND is_active = 1");
    $stmt->execute();
    $exchangeRate = $stmt->fetchColumn() ?: 1;
    
    $finalPrice = $testOrder['base_price'] * $exchangeRate;
    
    // Insertar pedido
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            order_number, customer_name, customer_email, customer_phone, 
            player_id, product_id, game_id, seller_id, base_price, 
            exchange_rate, final_price, currency, payment_method, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");
    
    $result = $stmt->execute([
        $orderNumber,
        $testOrder['customer_name'],
        $testOrder['customer_email'],
        $testOrder['customer_phone'],
        $testOrder['player_id'],
        $testOrder['product_id'],
        $testOrder['game_id'],
        $sellerId,
        $testOrder['base_price'],
        $exchangeRate,
        $finalPrice,
        $testOrder['currency'],
        $testOrder['payment_method']
    ]);
    
    if ($result) {
        $orderId = $pdo->lastInsertId();
        echo "✅ Pedido de prueba creado exitosamente (ID: $orderId)\n";
        echo "   - Número de orden: $orderNumber\n";
        echo "   - Precio base: $" . $testOrder['base_price'] . " USD\n";
        echo "   - Tasa de cambio: $exchangeRate\n";
        echo "   - Precio final: $finalPrice VES\n";
        
        // Agregar historial de estado
        $stmt = $pdo->prepare("
            INSERT INTO order_status_history (order_id, status, notes, created_at) 
            VALUES (?, 'pending', 'Pedido creado automáticamente por prueba', NOW())
        ");
        $stmt->execute([$orderId]);
        
        echo "✅ Historial de estado agregado\n";
    } else {
        echo "❌ Error creando pedido de prueba\n";
    }
    
    // Verificar pedidos totales
    $totalOrders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    echo "\n📊 Total de pedidos en la base de datos: $totalOrders\n";
    
    echo "\n🎉 Prueba completada exitosamente!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>