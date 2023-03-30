const express = require('express');
const { Device } = require('../models/device');
const { Gateway } = require('../models/gateway');

const router = express.Router({});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const gateway = await Gateway.findById(id);

    if (gateway === null) {
        res.status(404).json(`no gateway found with id: ${id}`);
    } else {
        res.json(gateway);
    }
});

router.get('/', async (req, res) => {
    const gateways = await Gateway.find();
    res.json(gateways);
});

router.post('/', async (req, res) => {
    const { name, ipAddress } = req.body;

    const gateway = new Gateway({ name, ipAddress, devices: [] });

    const document = await gateway.save();
    res.json(document);
});

router.post('/:id/device', async (req, res) => {
    const gatewayId = req.params.id;
    const { vendor, status } = req.body;

    const gateway = await Gateway.findById(gatewayId);

    if (gateway === null) {
        return res
            .status(404)
            .json(`no gateway found with id: ${gatewayId}`);
    }
    if (gateway.devices.length > 9) {
        return res
            .status(400)
            .json('no more that 10 peripheral devices are allowed for a gateway');
    }

    const device = new Device({
        uid: 1,
        vendor,
        status,
        date: new Date(),
    });

    gateway.devices.push(device);

    const updatedGateway = await gateway.save();

    return res.json(updatedGateway);
});

router.delete('/:gatewayId/device/:deviceId', async (req, res) => {
    const { gatewayId, deviceId } = req.params;

    const gateway = await Gateway.findById(gatewayId);

    if (gateway === null) {
        res
            .status(404)
            .json(`no gateway found with id: ${gatewayId}`);
    } else {
        gateway.devices = gateway.devices.filter((device) => device._id.toString() !== deviceId);

        const updatedGateway = await gateway.save();

        res.json(updatedGateway);
    }
});

module.exports = router;
