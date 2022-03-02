const Pegawai = require("../models/Pegawai")
const Gaji = require("../models/Gaji")
const Jabatan = require("../models/Jabatan");

let pdf = require("html-pdf");
let ejs = require("ejs");
const fs = require('fs-extra');
const path = require('path');

const { check  } = require('express-validator');

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
            const pegawai = await Pegawai.find()
            .populate({ path: 'jabatanId'})
            const jabatan = await Jabatan.find();
            console.log(pegawai)
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
                pegawai,
                jabatan
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPegawai: async (req, res) => {
        try {
            const { jabatanId, nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket, tanggal_masuk } = req.body;
            await Pegawai.create({ 
                jabatanId,
                nama,
                unker, 
                nik, 
                npwp, 
                no_rek_jateng, 
                no_rek_bni, 
                no_bpjs_kes, 
                no_bpjs_ket,
                tanggal_masuk,
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
            const { id, jabatanId, nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket} = req.body;
            const pegawai = await Pegawai.findOne({_id: id});
            if (req.files == undefined) {
                pegawai.jabatanId = jabatanId;
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
                // await fs.unlink(path.join(`public/${pegawai.file_SK}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_ktp}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_npwp}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_rek_jateng}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_rek_bni}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_bpjs_kes}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_bpjs_ket}`));
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
                // await fs.unlink(path.join(`public/${pegawai.file_SK}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_ktp}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_npwp}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_rek_jateng}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_rek_bni}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_bpjs_kes}`));
                // await fs.unlink(path.join(`public/${pegawai.foto_bpjs_ket}`));
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
    // jabatan
    viewJabatan: async (req, res) => {
        try {
            const jabatan = await Jabatan.find();
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/jabatan/view_jabatan", {
                title: 'Data Jabatan | T2KU BMCK Jateng',
                alert,
                jabatan
            })
        } catch (error) {
            console.log(error)
        }
    },
    addJabatan: async (req, res) => {
        try {
            const { jabatan, pendidikan, gaji  } = req.body;
            await Jabatan.create({ 
                jabatan, 
                pendidikan, 
                gaji, 
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Jabatan');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/jabatan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/jabatan");
        }
    },
    editJabatan: async (req, res) => {
        try {
            const { id, jabatan, pendidikan, gaji } = req.body;
            const findJabatan = await Jabatan.findOne({_id: id});
                findJabatan.jabatan = jabatan;
                findJabatan.pendidikan = pendidikan;
                findJabatan.gaji = gaji;
                await findJabatan.save();
                req.flash('alertMessage', 'Berhasil mengubah data Jabatan');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/jabatan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/jabatan");
        }
    },
    deleteJabatan: async (req, res) => {
        try {
            const { id } = req.params;
            const jabatan = await Jabatan.findOne({_id: id});
            await jabatan.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Jabatan');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/jabatan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/jabatan");
        }
    },
    // akhir jabatan
    viewGaji: async (req, res) => {
        const gaji = await Gaji.find();
        const pegawai = await Pegawai.find()
            .populate({ path: 'jabatanId'})
        // alert
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { 
            message: alertMessage, 
            status: alertStatus,
        };
        try {
            res.render("admin/gaji/view_gaji", {
                title: 'Data Gaji | T2KU BMCK Jateng',
                alert,
                gaji,
                pegawai
            })
        } catch (error) {
            console.log(error)
        }
    },
    // addGaji: async (req, res) => {
    //     try {
    //         const { pegawaiId, tanggal, status } = req.body;
    //         await Gaji.create({ 
    //             tanggal,
    //             status,
    //             pegawaiId,
    //             file: `uploads/${req.files.file[0].filename}`,
    //         });
    //         req.flash('alertMessage', 'Berhasil menambahkan data Gaji');
    //         req.flash('alertStatus', 'success');
    //         res.redirect("/admin/gaji");
    //     } catch (error) {
    //         req.flash('alertMessage', `${error.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect("/admin/gaji");
    //     }
    // },
    cetakGaji: async (req, res) => {
        try {
            const { id } = req.body;
            const pegawai = await Pegawai.findOne({_id: id})
            .populate({ path: 'jabatanId'})
            console.log(pegawai)
            ejs.renderFile(path.join('./views/', "report.ejs"), {pegawai}, (err, data) => {
                if (err) {
                      res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    };
                    pdf.create(data, options).toFile("report.pdf", function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send("File created successfully");
                        }
                    });
                }
            });
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