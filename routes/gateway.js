const express = require('express');
const { Gateway } = require('../models/gateway');
const { Device } = require('../models/device');
const { Counter } = require('../models/counter');

const router = express.Router({});

const COUNTER_NAME = 'device_counter';

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const gateway = await Gateway.findById(id).populate('devices');

    if (gateway === null) {
        res.status(404).json(`no gateway found with id: ${id}`);
    } else {
        res.json(gateway);
    }
});

router.get('/', async (req, res) => {
    const gateways = await Gateway.find().populate('devices');
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

    const counter = await Counter
        .findOneAndUpdate(
            { name: COUNTER_NAME },
            { $inc: { value: 1 } },
            { upsert: true, new: true },
        );

    const device = new Device({
        uid: counter.value,
        vendor,
        status,
        date: new Date(),
        gatewayId: gateway._id,
    });

    const savedDevice = await device.save();

    gateway.devices.push(savedDevice._id);
    await gateway.save();

    return res.json(savedDevice);
});

router.delete('/:gatewayId/device/:deviceId', async (req, res) => {
    const { gatewayId, deviceId } = req.params;

    const gateway = await Gateway.findById(gatewayId);

    if (gateway === null) {
        return res
            .status(404)
            .json(`no gateway found with id: ${gatewayId}`);
    }

    const device = await Device.findById(deviceId);

    if (device === null) {
        return res
            .status(404)
            .json(`no device found with id: ${deviceId}`);
    }

    await device.deleteOne();

    gateway.devices = gateway.devices
        .filter((id) => id.toString() !== deviceId);
    await gateway.save();

    return res.json(device);
});

module.exports = router;
