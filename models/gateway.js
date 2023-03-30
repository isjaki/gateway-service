const { Schema, model } = require('mongoose');
const { deviceSchema } = require('./device');

const gatewaySchema = new Schema({
    name: String,
    ipAddress: String,
    devices: [deviceSchema],
});

const Gateway = model('Gateway', gatewaySchema);

module.exports = { Gateway, gatewaySchema };
