const { Schema, model } = require('mongoose');

const gatewaySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
});

const Gateway = model('Gateway', gatewaySchema);

module.exports = { Gateway, gatewaySchema };
