-- Base de datos para DHARCK STORE
-- Estructura de tablas para pedidos, tasas de cambio y gestión

-- Tabla de países y monedas
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    flag_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tasas de cambio
CREATE TABLE exchange_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_currencies (from_currency, to_currency)
);

-- Tabla de vendedores
CREATE TABLE sellers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    image_url VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_sales INT DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de juegos
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos/recargas
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Tabla de clientes
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    country_id INT,
    player_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Tabla de pedidos
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    seller_id INT,
    product_id INT NOT NULL,
    game_id INT NOT NULL,
    
    -- Información del cliente
    customer_name VARCHAR(100),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    player_id VARCHAR(100) NOT NULL,
    
    -- Información del pedido
    quantity INT DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    local_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    
    -- Estados y fechas
    status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Metadatos
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    -- Índices y relaciones
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_seller_id (seller_id)
);

-- Tabla de historial de estados de pedidos
CREATE TABLE order_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos iniciales

-- Países
INSERT INTO countries (code, name, currency) VALUES
('US', 'Estados Unidos', 'USD'),
('MX', 'México', 'MXN'),
('CO', 'Colombia', 'COP'),
('AR', 'Argentina', 'ARS'),
('PE', 'Perú', 'PEN'),
('CL', 'Chile', 'CLP'),
('VE', 'Venezuela', 'VES'),
('EC', 'Ecuador', 'USD'),
('BO', 'Bolivia', 'BOB'),
('PY', 'Paraguay', 'PYG');

-- Vendedores iniciales
INSERT INTO sellers (name, image_url, rating, total_sales, is_online) VALUES
('Enmanuel', '/image/vendedores/Enmanuel.png', 5.00, 1250, TRUE),
('Jhack', '/image/vendedores/Jhack.png', 5.00, 980, TRUE),
('Mateo', '/image/vendedores/Mateo.png', 4.90, 1100, TRUE),
('SpartanoWolf98', '/image/vendedores/SpartanoWolf98.png', 4.80, 850, FALSE),
('David', '/image/vendedores/david.png', 4.90, 920, TRUE),
('Ernesto', '/image/vendedores/ernesto.png', 4.70, 780, TRUE),
('Satoru', '/image/vendedores/satoru.png', 5.00, 1350, TRUE),
('XJoseDharckX', '/image/vendedores/xjosedharckx.png', 5.00, 1500, TRUE);

-- Juegos iniciales
INSERT INTO games (name, description, icon, color) VALUES
('Free Fire', 'Battle Royale móvil más popular', 'Flame', 'from-orange-500 to-red-600'),
('Mobile Legends', 'MOBA 5v5 para móviles', 'Sword', 'from-blue-500 to-purple-600'),
('PUBG Mobile', 'Battle Royale realista', 'Target', 'from-yellow-500 to-orange-600'),
('Call of Duty Mobile', 'FPS multijugador', 'Crosshair', 'from-green-500 to-blue-600'),
('Clash of Clans', 'Estrategia y construcción', 'Castle', 'from-purple-500 to-pink-600'),
('Genshin Impact', 'RPG de mundo abierto', 'Sparkles', 'from-cyan-500 to-blue-600');

-- Tasas de cambio iniciales (ejemplo)
INSERT INTO exchange_rates (from_currency, to_currency, rate) VALUES
('USD', 'MXN', 17.50),
('USD', 'COP', 4200.00),
('USD', 'ARS', 350.00),
('USD', 'PEN', 3.75),
('USD', 'CLP', 850.00),
('USD', 'VES', 35.00),
('USD', 'BOB', 6.90),
('USD', 'PYG', 7300.00);

-- Configuración del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES
('site_name', 'DHARCK STORE', 'Nombre del sitio web'),
('default_currency', 'USD', 'Moneda por defecto'),
('commission_rate', '10.00', 'Tasa de comisión por defecto (%)'),
('auto_assign_seller', 'true', 'Asignar vendedor automáticamente'),
('order_prefix', 'DS', 'Prefijo para números de pedido'),
('email_notifications', 'true', 'Enviar notificaciones por email');