<?php
// Archivo: api/routes/exchange.php

function getExchangeRates($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM exchange_rates WHERE is_active = 1 ORDER BY from_currency, to_currency");
        $stmt->execute();
        $rates = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'rates' => $rates,
            'count' => count($rates)
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => 'Error obteniendo tasas de cambio: ' . $e->getMessage()
        ];
    }
}

function convertAmount($pdo, $amount, $from, $to) {
    try {
        if ($from === $to) {
            return [
                'success' => true,
                'original_amount' => $amount,
                'converted_amount' => $amount,
                'from_currency' => $from,
                'to_currency' => $to,
                'rate' => 1.0
            ];
        }
        
        $stmt = $pdo->prepare("SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = ? AND is_active = 1");
        $stmt->execute([$from, $to]);
        $rate = $stmt->fetchColumn();
        
        if (!$rate) {
            return [
                'success' => false,
                'error' => "No se encontró tasa de cambio de $from a $to"
            ];
        }
        
        $converted = $amount * $rate;
        
        return [
            'success' => true,
            'original_amount' => $amount,
            'converted_amount' => round($converted, 2),
            'from_currency' => $from,
            'to_currency' => $to,
            'rate' => $rate
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => 'Error convirtiendo moneda: ' . $e->getMessage()
        ];
    }
}

// Manejar las rutas
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($path_parts[1]) && isset($path_parts[2])) {
            // GET /exchange/USD/VES?amount=100
            $from = strtoupper($path_parts[1]);
            $to = strtoupper($path_parts[2]);
            $amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 1;
            
            $result = convertAmount($pdo, $amount, $from, $to);
        } else {
            // GET /exchange - obtener todas las tasas
            $result = getExchangeRates($pdo);
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (isset($input['amount'], $input['from'], $input['to'])) {
            $result = convertAmount($pdo, $input['amount'], $input['from'], $input['to']);
        } else {
            $result = [
                'success' => false,
                'error' => 'Faltan parámetros: amount, from, to'
            ];
        }
        break;
        
    default:
        http_response_code(405);
        $result = [
            'success' => false,
            'error' => 'Método no permitido'
        ];
        break;
}

echo json_encode($result);
?>