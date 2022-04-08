const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        URL: {
            type: String,
            min: 3,
            max: 160,
        },
        type: {
            type: String,
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('Category', categorySchema);
