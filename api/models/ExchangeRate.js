// Modelo para manejar tasas de cambio
const { executeQuery } = require('../config/database');

class ExchangeRate {
    // Obtener tasa de cambio
    static async getRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return 1.0;
        }

        const query = `
            SELECT rate FROM exchange_rates 
            WHERE from_currency = ? AND to_currency = ? AND is_active = TRUE
            ORDER BY updated_at DESC LIMIT 1
        `;

        const results = await executeQuery(query, [fromCurrency, toCurrency]);
        
        if (results.length > 0) {
            return parseFloat(results[0].rate);
        }

        // Si no existe la tasa directa, buscar la inversa
        const inverseQuery = `
            SELECT rate FROM exchange_rates 
            WHERE from_currency = ? AND to_currency = ? AND is_active = TRUE
            ORDER BY updated_at DESC LIMIT 1
        `;

        const inverseResults = await executeQuery(inverseQuery, [toCurrency, fromCurrency]);
        
        if (inverseResults.length > 0) {
            return 1 / parseFloat(inverseResults[0].rate);
        }

        throw new Error(`Tasa de cambio no encontrada para ${fromCurrency} -> ${toCurrency}`);
    }

    // Actualizar tasa de cambio
    static async updateRate(fromCurrency, toCurrency, rate) {
        const query = `
            INSERT INTO exchange_rates (from_currency, to_currency, rate)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            rate = VALUES(rate), 
            updated_at = CURRENT_TIMESTAMP
        `;

        await executeQuery(query, [fromCurrency, toCurrency, rate]);
        return { fromCurrency, toCurrency, rate };
    }

    // Obtener todas las tasas
    static async getAllRates() {
        const query = `
            SELECT * FROM exchange_rates 
            WHERE is_active = TRUE 
            ORDER BY from_currency, to_currency
        `;

        return await executeQuery(query);
    }

    // Convertir precio
    static async convertPrice(amount, fromCurrency, toCurrency) {
        const rate = await this.getRate(fromCurrency, toCurrency);
        return {
            original_amount: amount,
            converted_amount: (amount * rate).toFixed(2),
            rate: rate,
            from_currency: fromCurrency,
            to_currency: toCurrency
        };
    }
}

module.exports = ExchangeRate;