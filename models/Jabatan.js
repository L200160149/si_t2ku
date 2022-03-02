const mongoose = require('mongoose');

const jabatanSchema = new mongoose.Schema({
    jabatan: {                   
        type: String,
        required: true
    },
    pendidikan: {
        type: String,
        required: true
    },
    gaji: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Jabatan', jabatanSchema)