const Location = require('../models/busModel');

const saveLocation = async (req, res) => {
    try {
        const { latitude, longitude, accuracy } = req.body;
        const location = new Location({ latitude, longitude, accuracy });
        await location.save();
        res.status(201).json({ message: 'Location saved successfully', location });
    } catch (err) {
        res.status(500).json({ message: 'Error saving location', error: err.message });
    }
};

module.exports = { saveLocation };

