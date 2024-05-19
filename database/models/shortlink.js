const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    idx: {
        type: Number, required: true,
    }, discord_id: {
        type: String, required: true,
    }, key: {
        type: String, required: true
    }, url: {
        type: String, required: true
    }
}, {
    versionKey: false
});

const Shortlink = mongoose.model('Shortlink', schema);

module.exports = {
    Shortlink,
}