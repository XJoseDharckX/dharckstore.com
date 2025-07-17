<?php
// Rutas para manejar tasas de cambio

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Obtener todas las tasas de cambio activas
        try {
            $stmt = $pdo->prepare("SELECT * FROM exchange_rates WHERE is_active = 1");
            $stmt->execute();
            $rates = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'rates' => $rates
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    case 'POST':
        // Convertir precio
        if (isset($input['amount']) && isset($input['from_currency']) && isset($input['to_currency'])) {
            try {
                $stmt = $pdo->prepare("
                    SELECT rate FROM exchange_rates 
                    WHERE from_currency = ? AND to_currency = ? AND is_active = 1
                ");
                $stmt->execute([$input['from_currency'], $input['to_currency']]);
                $rate = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($rate) {
                    $convertedAmount = $input['amount'] * $rate['rate'];
                    echo json_encode([
                        'success' => true,
                        'original_amount' => $input['amount'],
                        'converted_amount' => $convertedAmount,
                        'rate' => $rate['rate'],
                        'from_currency' => $input['from_currency'],
                        'to_currency' => $input['to_currency']
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Tasa de cambio no encontrada'
                    ]);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Faltan parámetros requeridos'
            ]);
        }
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido'
        ]);
        break;
}
?>