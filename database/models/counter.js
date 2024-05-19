const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    coll: {
        type: String, required: true,
    }, seq: {
        type: Number, required: true,
    },
}, {
    versionKey: false
});

const Counter = mongoose.model('Counter', schema);

module.exports = {
    Counter,
}