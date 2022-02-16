const mongoose = require('mongoose');

const pegawaiSchema = new mongoose.Schema({
    nama: {                   
        type: String,
        required: true
    },
    unker: {
        type: String,
        required: true
    },
    nik: {
        type: Number,
        required: true
    }, 
    npwp: {
        type: String,
        required: true
    },
    no_rek_jateng: {
        type: Number,
        required: true
    },
    no_rek_bni: {
        type: Number,
        required: true
    },
    no_bpjs_kes: {
        type: Number,
        required: true
    },
    no_bpjs_ket: {
        type: Number,
        required: true
    },

})

module.exports = mongoose.model('Pegawai', pegawaiSchema)