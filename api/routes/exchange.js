// Rutas para manejar tasas de cambio
const express = require('express');
const router = express.Router();
const ExchangeRate = require('../models/ExchangeRate');

// Obtener tasa de cambio específica
router.get('/rate/:from/:to', async (req, res) => {
    try {
        const { from, to } = req.params;
        const rate = await ExchangeRate.getRate(from, to);

        res.json({
            success: true,
            from_currency: from,
            to_currency: to,
            rate: rate
        });

    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
});

// Convertir precio
router.post('/convert', async (req, res) => {
    try {
        const { amount, from_currency, to_currency } = req.body;

        if (!amount || !from_currency || !to_currency) {
            return res.status(400).json({
                error: 'Faltan parámetros requeridos'
            });
        }

        const conversion = await ExchangeRate.convertPrice(
            parseFloat(amount), 
            from_currency, 
            to_currency
        );

        res.json({
            success: true,
            conversion: conversion
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Obtener todas las tasas
router.get('/rates', async (req, res) => {
    try {
        const rates = await ExchangeRate.getAllRates();

        res.json({
            success: true,
            rates: rates
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar tasa de cambio
router.post('/rates', async (req, res) => {
    try {
        const { from_currency, to_currency, rate } = req.body;

        if (!from_currency || !to_currency || !rate) {
            return res.status(400).json({
                error: 'Faltan parámetros requeridos'
            });
        }

        const result = await ExchangeRate.updateRate(
            from_currency, 
            to_currency, 
            parseFloat(rate)
        );

        res.json({
            success: true,
            rate: result
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;