const { Gateway } = require('../models/gateway');
const { Counter } = require('../models/counter');
const { isIpValid } = require('../utils/utils');

class GatewayService {
    static DEVICE_COUNTER = 'device_counter';

    static async getAll() {
        return Gateway.find();
    }

    static async getById(gatewayId) {
        const gateway = await Gateway.findById(gatewayId);

        if (gateway === null) {
            const error = new Error(`no gateway is found with id: ${gatewayId}`);
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
            const error = new Error(`no gateway is found with id: ${gatewayId}`);
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

        const device = {
            uid: counter.value,
            vendor,
            status,
            date: new Date(),
        };

        gateway.devices.push(device);
        await gateway.save();

        return gateway;
    }

    static async removeDevice(gatewayId, deviceUid) {
        const gateway = await Gateway.findById(gatewayId);

        if (gateway === null) {
            const error = new Error(`no gateway is found with id: ${gatewayId}`);
            error.status = 404;
            throw error;
        }

        const hasDevice = gateway.devices.map(({ uid }) => uid).includes(Number(deviceUid));

        if (!hasDevice) {
            const error = new Error(`no device is found with uid: ${deviceUid} for this gateway`);
            error.status = 404;
            throw error;
        }

        gateway.devices = gateway.devices
            .filter((device) => device.uid !== Number(deviceUid));
        await gateway.save();

        return gateway;
    }
}

module.exports = { GatewayService };
