const { Schema, model } = require('mongoose');

const deviceSchema = new Schema({
    uid: Number,
    vendor: String,
    date: Date,
    status: String,
});

const Device = model('Device', deviceSchema);

module.exports = { Device, deviceSchema };
