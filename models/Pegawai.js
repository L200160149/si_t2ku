const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

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
    tanggal_masuk: {
        type: Date,
        required: false
    },
    foto_ktp: {
        type: String,
        required: true
    },
    foto_npwp: {
        type: String,
        required: true
    },
    foto_rek_jateng: {
        type: String,
        required: true
    },
    foto_rek_bni: {
        type: String,
        required: true
    },
    foto_bpjs_kes: {
        type: String,
        required: true
    },
    foto_bpjs_ket: {
        type: String,
        required: true
    },
    file_SK: {
        type: String,
        required: true
    },
    jabatanId: {
        type: ObjectId,
        ref: 'Jabatan'
    },
})

module.exports = mongoose.model('Pegawai', pegawaiSchema)