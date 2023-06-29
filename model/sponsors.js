const mongoose = require("mongoose");

const sponsorsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        buttonText: {
            type: String,
        },
        buttonLink: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sponsors", sponsorsSchema);
