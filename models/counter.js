const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
        min: 0,
    },
});

const Counter = model('Counter', counterSchema);

module.exports = { Counter };
