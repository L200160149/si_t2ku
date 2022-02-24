const Pegawai = require("../models/Pegawai")
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    // dashboard
    viewDashboard: async (req, res) => {
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'Dashboard | T2KU BMCK Jateng'
            })
            console.log(Pegawai)
        } catch (error) {
            console.log(error)
        }
    },
    // akhir dashboard

    // pegawai
    viewPegawai: async (req, res) => {
        try {
            const pegawai = await Pegawai.find();
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/pegawai/view_pegawai", {
                title: 'Data Pegawai | T2KU BMCK Jateng',
                alert,
                pegawai
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPegawai: async (req, res) => {
        try {
            const { nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket } = req.body;
            await Pegawai.create({ 
                nama,
                unker, 
                nik, 
                npwp, 
                no_rek_jateng, 
                no_rek_bni, 
                no_bpjs_kes, 
                no_bpjs_ket,
                file_SK: `uploads/${req.files.file_SK[0].filename}`,
                foto_ktp: `uploads/${req.files.foto_ktp[0].filename}`,
                foto_npwp: `uploads/${req.files.foto_npwp[0].filename}`,
                foto_rek_jateng: `uploads/${req.files.foto_rek_jateng[0].filename}`,
                foto_rek_bni: `uploads/${req.files.foto_rek_bni[0].filename}`,
                foto_bpjs_kes: `uploads/${req.files.foto_bpjs_kes[0].filename}`,
                foto_bpjs_ket: `uploads/${req.files.foto_bpjs_ket[0].filename}`,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Pegawai');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pegawai");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    editPegawai: async (req, res) => {
        try {
            const { id, nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket} = req.body;
            const pegawai = await Pegawai.findOne({_id: id});
            if (req.files == undefined) {
                pegawai.nama = nama;
                pegawai.unker = unker;
                pegawai.nik = nik;
                pegawai.npwp = npwp;
                pegawai.no_rek_jateng = no_rek_jateng;
                pegawai.no_rek_bni = no_rek_bni;
                pegawai.no_bpjs_kes = no_bpjs_kes;
                pegawai.no_bpjs_ket = no_bpjs_ket;
                await pegawai.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pegawai');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pegawai");
            } else {
                await fs.unlink(path.join(`public/${pegawai.file_SK}`));
                await fs.unlink(path.join(`public/${pegawai.foto_ktp}`));
                await fs.unlink(path.join(`public/${pegawai.foto_npwp}`));
                await fs.unlink(path.join(`public/${pegawai.foto_rek_jateng}`));
                await fs.unlink(path.join(`public/${pegawai.foto_rek_bni}`));
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_kes}`));
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_ket}`));
                pegawai.nama = nama;
                pegawai.unker = unker;
                pegawai.nik = nik;
                pegawai.npwp = npwp;
                pegawai.no_rek_jateng = no_rek_jateng;
                pegawai.no_rek_bni = no_rek_bni;
                pegawai.no_bpjs_kes = no_bpjs_kes;
                pegawai.no_bpjs_ket = no_bpjs_ket;
                pegawai.file_SK = `uploads/${req.files.file_SK[0].filename}`,
                pegawai.foto_ktp = `uploads/${req.files.foto_ktp[0].filename}`,
                pegawai.foto_npwp = `uploads/${req.files.foto_npwp[0].filename}`,
                pegawai.foto_rek_jateng = `uploads/${req.files.foto_rek_jateng[0].filename}`,
                pegawai.foto_rek_bni = `uploads/${req.files.foto_rek_bni[0].filename}`,
                pegawai.foto_bpjs_kes = `uploads/${req.files.foto_bpjs_kes[0].filename}`,
                pegawai.foto_bpjs_ket = `uploads/${req.files.foto_bpjs_ket[0].filename}`
                await pegawai.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pegawai');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pegawai");
            }
            console.log(req.files.file_SK[0])
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    deletePegawai: async (req, res) => {
        try {
            const { id } = req.params;
            const pegawai = await Pegawai.findOne({_id: id});
                await fs.unlink(path.join(`public/${pegawai.file_SK}`));
                await fs.unlink(path.join(`public/${pegawai.foto_ktp}`));
                await fs.unlink(path.join(`public/${pegawai.foto_npwp}`));
                await fs.unlink(path.join(`public/${pegawai.foto_rek_jateng}`));
                await fs.unlink(path.join(`public/${pegawai.foto_rek_bni}`));
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_kes}`));
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_ket}`));
            await pegawai.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Pegawai');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pegawai");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    // akhir pegawai

    viewGaji: async (req, res) => {
        try {
            res.render("admin/gaji/view_gaji", {
                title: 'Data Gaji | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    viewPemasukan: async (req, res) => {
        try {
            res.render("admin/pemasukan/view_pemasukan", {
                title: 'Data Pemasukan | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    viewPengeluaran: async (req, res) => {
        try {
            res.render("admin/pengeluaran/view_pengeluaran", {
                title: 'Data Pengeluaran | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
}