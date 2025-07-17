<?php
// Rutas para manejar pedidos en PHP

// Obtener método HTTP y datos
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Función para crear pedido
function createOrder($pdo, $data) {
    try {
        // Validaciones básicas
        if (!isset($data['customer_name']) || !isset($data['player_id']) || 
            !isset($data['product_id']) || !isset($data['game_id'])) {
            throw new Exception('Faltan campos requeridos');
        }

        // Generar número de pedido único
        $orderNumber = 'DS' . substr(time(), -6) . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
        
        // Asignar vendedor aleatorio (1-8)
        $sellerId = rand(1, 8);
        
        // Obtener tasa de cambio (por defecto 1 si no existe)
        $exchangeRate = 1.0;
        if (isset($data['currency']) && $data['currency'] !== 'USD') {
            $stmt = $pdo->prepare("SELECT rate FROM exchange_rates WHERE from_currency = 'USD' AND to_currency = ? AND is_active = 1");
            $stmt->execute([$data['currency']]);
            $rate = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($rate) {
                $exchangeRate = $rate['rate'];
            }
        }
        
        $localPrice = $data['base_price'] * $exchangeRate;
        
        // Insertar pedido
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone,
                player_id, product_id, game_id, seller_id, base_price,
                local_price, currency, exchange_rate, payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $orderNumber,
            $data['customer_name'],
            $data['customer_email'] ?? null,
            $data['customer_phone'] ?? null,
            $data['player_id'],
            $data['product_id'],
            $data['game_id'],
            $sellerId,
            $data['base_price'],
            $localPrice,
            $data['currency'] ?? 'USD',
            $exchangeRate,
            $data['payment_method'] ?? 'pending'
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // Registrar en historial
        $stmt = $pdo->prepare("
            INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
            VALUES (?, NULL, 'pending', 'Sistema')
        ");
        $stmt->execute([$orderId]);
        
        return [
            'success' => true,
            'order' => [
                'id' => $orderId,
                'order_number' => $orderNumber,
                'status' => 'pending'
            ]
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Función para obtener pedidos
function getOrders($pdo, $filters = []) {
    try {
        $query = "
            SELECT o.*, g.name as game_name, s.name as seller_name
            FROM orders o
            LEFT JOIN games g ON o.game_id = g.id
            LEFT JOIN sellers s ON o.seller_id = s.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if (isset($filters['status'])) {
            $query .= " AND o.status = ?";
            $params[] = $filters['status'];
        }
        
        if (isset($filters['seller_id'])) {
            $query .= " AND o.seller_id = ?";
            $params[] = $filters['seller_id'];
        }
        
        $query .= " ORDER BY o.created_at DESC LIMIT 50";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'orders' => $orders
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Manejar rutas
switch ($method) {
    case 'POST':
        $result = createOrder($pdo, $input);
        break;
        
    case 'GET':
        $result = getOrders($pdo, $_GET);
        break;
        
    default:
        $result = [
            'success' => false,
            'error' => 'Método no permitido'
        ];
        break;
}

echo json_encode($result);
?>