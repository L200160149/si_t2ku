const mongoose = require('mongoose');

const gajiSchema = new mongoose.Schema({
    tanggal: {                   
        type: Date,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    pegawaiId: [{
        type: String,
        required: true
    }],
})

module.exports = mongoose.model('Gaji', gajiSchema)