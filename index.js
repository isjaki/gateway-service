const express = require('express');
const mongoose = require('mongoose');

const gatewayRouter = require('./routes/gateway');

const app = express();

app.use(express.json());

app.use('/gateway', gatewayRouter);

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).json({ status, message });
    next();
});

const PORT = 8000;

async function main() {
    await mongoose.connect('mongodb://localhost:27017/gateway_db');
    app.listen(PORT);
}

main();
