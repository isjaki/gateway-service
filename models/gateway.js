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
    devices: [{
        uid: {
            type: Number,
            required: true,
        },
        vendor: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline'],
            required: true,
        },
    }],
});

const Gateway = model('Gateway', gatewaySchema);

module.exports = { Gateway, gatewaySchema };
