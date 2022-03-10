const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const slipGajiSchema = new mongoose.Schema({
    tanggal: {                   
        type: Date,
        required: true
    },
    slip_gaji: {                   
        type: String,
        required: true
    },
})

module.exports = mongoose.model('slipGaji', slipGajiSchema)