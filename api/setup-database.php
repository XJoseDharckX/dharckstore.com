<?php
// Script para crear las tablas necesarias en la base de datos

header("Content-Type: application/json");

// Configuración de la base de datos
$host = "localhost";
$username = "u875897750_dharckstore";
$password = "Jose35//";
$database = "u875897750_hostinger";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crear tabla de vendedores
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS sellers (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            image_url VARCHAR(255),
            rating DECIMAL(3,2) DEFAULT 5.00,
            total_sales INT DEFAULT 0,
            is_online BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Crear tabla de juegos
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS games (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            icon VARCHAR(50),
            color VARCHAR(50),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Crear tabla de productos
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY AUTO_INCREMENT,
            game_id INT NOT NULL,
            name VARCHAR(200) NOT NULL,
            base_price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(10) DEFAULT 'USD',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Crear tabla de tasas de cambio
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS exchange_rates (
            id INT PRIMARY KEY AUTO_INCREMENT,
            from_currency VARCHAR(10) NOT NULL,
            to_currency VARCHAR(10) NOT NULL,
            rate DECIMAL(10,6) NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    ");
    
    // Crear tabla de pedidos
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS orders (
            id INT PRIMARY KEY AUTO_INCREMENT,
            order_number VARCHAR(50) UNIQUE NOT NULL,
            seller_id INT,
            product_id INT NOT NULL,
            game_id INT NOT NULL,
            customer_name VARCHAR(100),
            customer_email VARCHAR(255),
            customer_phone VARCHAR(20),
            player_id VARCHAR(100) NOT NULL,
            base_price DECIMAL(10,2) NOT NULL,
            exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
            local_price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(10) NOT NULL,
            status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
            payment_method VARCHAR(50),
            notes TEXT,
            admin_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    // Crear tabla de historial
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS order_status_history (
            id INT PRIMARY KEY AUTO_INCREMENT,
            order_id INT NOT NULL,
            old_status VARCHAR(50),
            new_status VARCHAR(50) NOT NULL,
            changed_by VARCHAR(100),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Insertar vendedores iniciales
    $pdo->exec("
        INSERT IGNORE INTO sellers (id, name, image_url, rating, total_sales, is_online) VALUES
        (1, 'Enmanuel', '/image/vendedores/Enmanuel.png', 5.00, 1250, TRUE),
        (2, 'Jhack', '/image/vendedores/Jhack.png', 5.00, 980, TRUE),
        (3, 'Mateo', '/image/vendedores/Mateo.png', 4.90, 1100, TRUE),
        (4, 'SpartanoWolf98', '/image/vendedores/SpartanoWolf98.png', 4.80, 850, FALSE),
        (5, 'David', '/image/vendedores/david.png', 4.90, 920, TRUE),
        (6, 'Ernesto', '/image/vendedores/ernesto.png', 4.70, 780, TRUE),
        (7, 'Satoru', '/image/vendedores/satoru.png', 5.00, 1350, TRUE),
        (8, 'XJoseDharckX', '/image/vendedores/xjosedharckx.png', 5.00, 1500, TRUE)
    ");
    
    // Insertar juegos iniciales
    $pdo->exec("
        INSERT IGNORE INTO games (id, name, description, icon, color) VALUES
        (1, 'Free Fire', 'Battle Royale móvil', 'Flame', 'from-orange-500 to-red-600'),
        (2, 'Mobile Legends', 'MOBA 5v5', 'Sword', 'from-blue-500 to-purple-600'),
        (3, 'PUBG Mobile', 'Battle Royale', 'Target', 'from-yellow-500 to-orange-600'),
        (4, 'Call of Duty Mobile', 'FPS multijugador', 'Crosshair', 'from-green-500 to-blue-600')
    ");
    
    // Insertar tasas de cambio
    $pdo->exec("
        INSERT INTO exchange_rates (from_currency, to_currency, rate, is_active) VALUES
        ('USD', 'MXN', 17.50, 1),
        ('USD', 'COP', 4200.00, 1),
        ('USD', 'ARS', 350.00, 1),
        ('USD', 'PEN', 3.75, 1),
        ('USD', 'CLP', 850.00, 1),
        ('USD', 'VES', 35.00, 1)
        ON DUPLICATE KEY UPDATE rate = VALUES(rate)
    ");
    
    echo json_encode([
        'success' => true,
        'message' => 'Base de datos configurada correctamente'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>