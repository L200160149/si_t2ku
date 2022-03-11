const mongoose = require('mongoose');

const absensiSchema = new mongoose.Schema({
    tanggal: {                   
        type: Date,
        required: true
    },
    file_absensi: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Absensi', absensiSchema)