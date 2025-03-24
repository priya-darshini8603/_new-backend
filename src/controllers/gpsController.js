const GPS = require("../models/gpsModel");
exports.getGpsData = async (req, res) => {
    try {
        const data = await GPS.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addGpsData = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const newGps = new GPS({ latitude, longitude });
        await newGps.save();
        res.status(201).json(newGps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};