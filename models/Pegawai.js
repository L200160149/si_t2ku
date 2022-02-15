const mongoose = require('mongoose');

const pegawaiSchema = new mongoose.Schema({
    nama: {                   
        type: String,
        required: true
    },
})