const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
    {
        smtp: [
            {
                host: {
                    type: String,
                    required: true,
                },
                service: {
                    type: String,
                    required: true,
                },
                port: {
                    type: Number,
                    required: true,
                },
                password: {
                    type: String,
                    required: true,
                },
                mail: {
                    type: String,
                    required: true,
                },
            },
        ],
        stripe: [
            {
                api: {
                    type: String,
                    required: true,
                },
                secret: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
);

module.exports = mongoose.model("Config", configSchema);
