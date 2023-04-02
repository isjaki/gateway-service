const { Schema, model } = require('mongoose');

const deviceSchema = new Schema({
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
    gatewayId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Gateway',
    },
});

const Device = model('Device', deviceSchema);

module.exports = { Device, deviceSchema };
