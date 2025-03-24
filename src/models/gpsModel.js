const mongoose = require("mongoose");
const GpsSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model("GPS", GpsSchema);
