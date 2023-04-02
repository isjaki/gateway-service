const express = require('express');
const { GatewayService } = require('../services/gateway-service');

const router = express.Router({});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const gateway = await GatewayService.getById(id);
        res.json(gateway);
    } catch (e) {
        next(e);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const gateways = await GatewayService.getAll();
        res.json(gateways);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const { name, ipAddress } = req.body;

    try {
        const gateway = await GatewayService.createGateway(name, ipAddress);
        res.json(gateway);
    } catch (e) {
        next(e);
    }
});

router.post('/:id/device', async (req, res, next) => {
    const gatewayId = req.params.id;
    const { vendor, status } = req.body;

    try {
        const newDevice = await GatewayService.addDevice(gatewayId, vendor, status);
        res.json(newDevice);
    } catch (e) {
        next(e);
    }
});

router.delete('/:gatewayId/device/:deviceId', async (req, res, next) => {
    const { gatewayId, deviceId } = req.params;

    try {
        const deletedDevice = await GatewayService.removeDevice(gatewayId, deviceId);
        res.json(deletedDevice);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
