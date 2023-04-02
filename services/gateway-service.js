const { Gateway } = require('../models/gateway');
const { Device } = require('../models/device');
const { Counter } = require('../models/counter');
const { isIpValid } = require('../utils/utils');

class GatewayService {
    static DEVICE_COUNTER = 'device_counter';

    static async getAll() {
        return Gateway.find().populate('devices');
    }

    static async getById(gatewayId) {
        const gateway = await Gateway.findById(gatewayId).populate('devices');

        if (gateway === null) {
            const error = new Error(`no gateway found with id: ${gatewayId}`);
            error.status = 404;
            throw error;
        }
        return gateway;
    }

    static async createGateway(name, ipAddress) {
        if (!isIpValid(ipAddress)) {
            const error = new Error(`ip address ${ipAddress} is invalid`);
            error.status = 400;
            throw error;
        }

        const gateway = new Gateway({ name, ipAddress, devices: [] });
        return gateway.save();
    }

    static async addDevice(gatewayId, vendor, status) {
        const gateway = await Gateway.findById(gatewayId);

        if (gateway === null) {
            const error = new Error(`no gateway found with id: ${gatewayId}`);
            error.status = 404;
            throw error;
        }

        if (gateway.devices.length > 9) {
            const error = new Error('no more that 10 peripheral devices are allowed for a gateway');
            error.status = 400;
            throw error;
        }

        const counter = await Counter
            .findOneAndUpdate(
                { name: this.DEVICE_COUNTER },
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

        return savedDevice;
    }

    static async removeDevice(gatewayId, deviceId) {
        const gateway = await Gateway.findById(gatewayId);

        if (gateway === null) {
            const error = new Error(`no gateway found with id: ${gatewayId}`);
            error.status = 404;
            throw error;
        }

        const device = await Device.findById(deviceId);

        if (device === null) {
            const error = new Error(`no device found with id: ${deviceId}`);
            error.status = 404;
            throw error;
        }

        await device.deleteOne();

        gateway.devices = gateway.devices
            .filter((id) => id.toString() !== deviceId);
        await gateway.save();

        return device;
    }
}

module.exports = { GatewayService };
