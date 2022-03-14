const Pegawai = require("../models/Pegawai")
const Gaji = require("../models/Gaji")
const Jabatan = require("../models/Jabatan");
const Users = require("../models/Users");
const Sk = require("../models/Sk");
const Slipgaji = require("../models/Slipgaji");

let pdf = require("html-pdf");
let ejs = require("ejs");
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

const { check  } = require('express-validator');
const Pemasukan = require("../models/Pemasukan");
const Pengeluaran = require("../models/Pengeluaran");

const {rupiah} = require("../middlewares/formatRupiah");
const Absensi = require("../models/Absensi");
const Suratmasuk = require("../models/Suratmasuk");
const Suratkeluar = require("../models/Suratkeluar");

module.exports = {
    // login
    viewLogin: async (req, res) => {
        try {
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };
            
            if (req.session.user == null || req.session.user == undefined) {
                res.render("login/view_login", {
                    title: 'Halaman Login | T2KU BMCK Jateng',
                    alert
                    });
            } else {
                res.redirect("/admin/dashboard");
            }
        } catch (error) {
            res.redirect("/admin/signin");
        }
    },
    authSignin: async (req, res) => {
        try {
          const { username, password } = req.body;
          const user = await Users.findOne({ username: username });
          if (!user) {
            req.flash('alertMessage', 'User tidak ada');
            req.flash('alertStatus', 'danger');
            res.redirect("/auth");
          }
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            req.flash('alertMessage', 'Password salah');
            req.flash('alertStatus', 'danger');
            res.redirect("/auth");
          }
          
          req.session.user = {
            id: user.id,
            username: user.username,
            level: user.level
          }
    
          res.redirect('/admin/dashboard');
        } catch (error) {
    
        }
      },
      authLogout: async (req, res) => {
        req.session.destroy();
        res.redirect('/auth')
      },
    // end login
    // dashboard
    viewDashboard: async (req, res) => {
        const totalPegawai = await Pegawai.find().count();
        const totalPemasukan = await Pemasukan.aggregate([{
            $group: {
               _id: '',
               "pemasukan": { $sum: '$jumlah_iuran' }
            }
            }, {
               $project: {
                  _id: 0,
                  "totalPemasukan": '$pemasukan'
               }
         }]);

        const totalPengeluaran = await Pengeluaran.aggregate([{
            $group: {
               _id: '',
               "pengeluaran": { $sum: '$jumlah_pengeluaran' }
            }
            }, {
               $project: {
                  _id: 0,
                  "totalPengeluaran": '$pengeluaran'
               }
         }]);
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'Dashboard | T2KU BMCK Jateng',
                totalPegawai,
                jumlahTotal : rupiah(totalPemasukan[0].totalPemasukan - totalPengeluaran[0].totalPengeluaran),
            })
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
            
                pegawai.nama = nama;
                pegawai.unker = unker;
                pegawai.nik = nik;
                pegawai.npwp = npwp;
                pegawai.no_rek_jateng = no_rek_jateng;
                pegawai.no_rek_bni = no_rek_bni;
                pegawai.no_bpjs_kes = no_bpjs_kes;
                pegawai.no_bpjs_ket = no_bpjs_ket;
                if (req.files.foto_ktp) {
                    pegawai.foto_ktp = `uploads/${req.files.foto_ktp[0].filename}`
                }
                if (req.files.foto_npwp) {
                    pegawai.foto_npwp = `uploads/${req.files.foto_npwp[0].filename}`
                }
                if (req.files.foto_rek_jateng) {
                    pegawai.foto_rek_jateng = `uploads/${req.files.foto_rek_jateng[0].filename}`
                }
                if (req.files.foto_rek_bni) {
                    pegawai.foto_rek_bni = `uploads/${req.files.foto_rek_bni[0].filename}`
                }
                if (req.files.foto_bpjs_kes) {
                    pegawai.foto_bpjs_kes = `uploads/${req.files.foto_bpjs_kes[0].filename}`
                }
                if (req.files.foto_bpjs_ket) {
                    pegawai.foto_bpjs_ket = `uploads/${req.files.foto_bpjs_ket[0].filename}`
                }
                await pegawai.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pegawai');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pegawai");

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
            if (pegawai.foto_ktp) {
                await fs.unlink(path.join(`public/${pegawai.foto_ktp}`));
            }
            if (pegawai.foto_npwp) {
                await fs.unlink(path.join(`public/${pegawai.foto_npwp}`));
            }
            if (pegawai.foto_rek_jateng) {
                await fs.unlink(path.join(`public/${pegawai.foto_rek_jateng}`));
            }
            if (pegawai.foto_rek_bni) {
                await fs.unlink(path.join(`public/${pegawai.foto_rek_bni}`));
            }
            if (pegawai.foto_bpjs_kes) {
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_kes}`));
            }
            if (pegawai.foto_bpjs_ket) {
                await fs.unlink(path.join(`public/${pegawai.foto_bpjs_ket}`));
            }
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
    
    // gaji
    viewGaji: async (req, res) => {
        const gaji = await Gaji.find();
        const pegawai = await Pegawai.find()
            .populate({ path: 'jabatanId'});
        const slipGaji = await Slipgaji.find();
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
                pegawai,
                slipGaji
            })
        } catch (error) {
            console.log(error)
        }
    },
    addSlipGaji: async (req, res) => {
        try {
            const { tanggal } = req.body;
            await Slipgaji.create({ 
                tanggal,
                slip_gaji: `uploads/${req.files.slip_gaji[0].filename}`,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Slip Gaji');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/gaji");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/gaji");
        }
    },
    editSlipGaji: async (req, res) => {
        try {
            const { id, tanggal} = req.body;
            const slipGaji = await Slipgaji.findOne({_id: id});
                if(tanggal) {
                    slipGaji.tanggal = tanggal;
                }
                if (req.files.slip_gaji) {
                    slipGaji.slip_gaji = `uploads/${req.files.slip_gaji[0].filename}`
                }
                await slipGaji.save();
                req.flash('alertMessage', 'Berhasil mengubah data Slip Gaji');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/gaji");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/gaji");
        }
    },
    deleteSlipGaji: async (req, res) => {
        try {
            const { id } = req.params;
            const sk = await Slipgaji.findOne({_id: id});
            if(sk.slip_gaji) {
                await fs.unlink(path.join(`public/${sk.slip_gaji}`));
            }
            await sk.remove();
            req.flash('alertMessage', 'Berhasil menghapus Slip Gaji');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/gaji");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/gaji");
        }
    },
    cetakGaji: async (req, res) => {
        try {
            const { id } = req.body;
            const pegawai = await Pegawai.findOne({_id: id})
            .populate({ path: 'jabatanId'})
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
    // akhir gaji

    // pemasukan
    viewPemasukan: async (req, res) => {
        try {
            const pemasukan = await Pemasukan.find();
            const pengeluaran = await Pengeluaran.find();
            
            const totalPemasukan = await Pemasukan.aggregate([{
                $group: {
                   _id: '',
                   "pemasukan": { $sum: '$jumlah_iuran' }
                }
                }, {
                   $project: {
                      _id: 0,
                      "totalPemasukan": '$pemasukan'
                   }
             }]);

            const totalPengeluaran = await Pengeluaran.aggregate([{
                $group: {
                   _id: '',
                   "pengeluaran": { $sum: '$jumlah_pengeluaran' }
                }
                }, {
                   $project: {
                      _id: 0,
                      "totalPengeluaran": '$pengeluaran'
                   }
             }]);

            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/pemasukan/view_pemasukan", {
                title: 'Data Pemasukan | T2KU BMCK Jateng',
                alert,
                pemasukan,
                pengeluaran,
                totalPemasukan : rupiah(totalPemasukan[0].totalPemasukan),
                totalPengeluaran : rupiah(totalPengeluaran[0].totalPengeluaran),
                jumlahTotal : rupiah(totalPemasukan[0].totalPemasukan - totalPengeluaran[0].totalPengeluaran),
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPemasukan: async (req, res) => {
        try {
            const { jumlah_iuran, tanggal, keterangan} = req.body;
            await Pemasukan.create({ 
                jumlah_iuran,
                tanggal, 
                keterangan,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Pemasukan');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    editPemasukan: async (req, res) => {
        try {
            const { id, jumlah_iuran, tanggal, keterangan} = req.body;
            const pemasukan = await Pemasukan.findOne({_id: id});
                pemasukan.jumlah_iuran = jumlah_iuran;
                pemasukan.tanggal = tanggal;
                pemasukan.keterangan = keterangan;
                await pemasukan.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pemasukan');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    deletePemasukan: async (req, res) => {
        try {
            const { id } = req.params;
            const pemasukan = await Pemasukan.findOne({_id: id});
            await pemasukan.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Pemasukan');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    // akhir pemasukan

    // pengeluaran
    addPengeluaran: async (req, res) => {
        try {
            const { jumlah_pengeluaran, tanggal, keterangan} = req.body;
            await Pengeluaran.create({ 
                jumlah_pengeluaran,
                tanggal, 
                keterangan,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Pengeluaran');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    editPengeluaran: async (req, res) => {
        try {
            const { id, jumlah_pengeluaran, tanggal, keterangan} = req.body;
            const pengeluaran = await Pengeluaran.findOne({_id: id});
                pengeluaran.jumlah_pengeluaran = jumlah_pengeluaran;
                pengeluaran.tanggal = tanggal;
                pengeluaran.keterangan = keterangan;
                await pengeluaran.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pengeluaran');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    deletePengeluaran: async (req, res) => {
        try {
            const { id } = req.params;
            const pengeluaran = await Pengeluaran.findOne({_id: id});
            await pengeluaran.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Pengeluaran');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pemasukan");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pemasukan");
        }
    },
    // akhir pengeluaran

    // sk
    viewSk: async (req, res) => {
        try {
            const sk = await Sk.find()
                    .populate({ path: 'pegawaiId'})
            const pegawai = await Pegawai.find();
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/sk/view_sk", {
                title: 'Data SK | T2KU BMCK Jateng',
                alert,
                sk,
                pegawai
            })
        } catch (error) {
            console.log(error)
        }
    },
    addSk: async (req, res) => {
        try {
            const { pegawaiId, tanggal} = req.body;
            await Sk.create({ 
                pegawaiId,
                tanggal,
                file_Sk: `uploads/${req.files.file_Sk[0].filename}`,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data SK');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/sk");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/sk");
        }
    },
    editSk: async (req, res) => {
        try {
            const { id, pegawaiId, tanggal} = req.body;
            const sk = await Sk.findOne({_id: id});
                sk.pegawaiId = pegawaiId;
                if(tanggal) {
                    sk.tanggal = tanggal;
                }
                if (req.files.file_Sk) {
                    sk.file_Sk = `uploads/${req.files.file_Sk[0].filename}`
                }
                await sk.save();
                req.flash('alertMessage', 'Berhasil mengubah data SK');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/sk");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/sk");
        }
    },
    deleteSk: async (req, res) => {
        try {
            const { id } = req.params;
            const sk = await Sk.findOne({_id: id});
            if(sk.file_Sk) {
                await fs.unlink(path.join(`public/${sk.file_Sk}`));
            }
            await sk.remove();
            req.flash('alertMessage', 'Berhasil menghapus data SK');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/sk");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/sk");
        }
    },
    // akhir sk

    // absensi
    viewAbsensi: async (req, res) => {
        const absensi = await Absensi.find();
        // alert
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {
            message: alertMessage, 
            status: alertStatus,
        };
        try {
            res.render("admin/absensi/view_absensi", {
                title: 'Data Absensi | T2KU BMCK Jateng',
                alert,
                absensi,
            })
        } catch (error) {
            console.log(error)
        }
    },
    addAbsensi: async (req, res) => {
        try {
            const { tanggal } = req.body;
            await Absensi.create({ 
                tanggal,
                file_absensi: `uploads/${req.files.file_absensi[0].filename}`,
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Absensi');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/absensi");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/absensi");
        }
    },
    editAbsensi: async (req, res) => {
        try {
            const { id, tanggal} = req.body;
            const absensi = await Absensi.findOne({_id: id});
                if (tanggal) {
                    absensi.tanggal = tanggal;
                }
                if (req.files.file_absensi) {
                    absensi.file_absensi = `uploads/${req.files.file_absensi[0].filename}`
                }
                await absensi.save();
                req.flash('alertMessage', 'Berhasil mengubah data Absensi');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/absensi");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/absensi");
        }
    },
    deleteAbsensi: async (req, res) => {
        try {
            const { id } = req.params;
            const absensi = await Absensi.findOne({_id: id});
            if(absensi.file_absensi) {
                await fs.unlink(path.join(`public/${absensi.file_absensi}`));
            }
            await absensi.remove();
            req.flash('alertMessage', 'Berhasil menghapus Absensi');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/absensi");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/absensi");
        }
    },
    // akhir absensi

    // suratmasuk
    viewSuratMasuk: async (req, res) => {
        const suratmasuk = await Suratmasuk.find();
        const suratkeluar = await Suratkeluar.find();
        // alert
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        try {
            res.render('admin/suratmasuk/view_suratmasuk', {
                title: 'Data Absensi | T2KU BMCK Jateng',
                suratmasuk,
                suratkeluar,
                alert
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    addSuratMasuk: async (req, res) => {
        try {
            const {tanggal, judul} = req.body;
            await Suratmasuk.create({
                tanggal,
                judul,
                surat_masuk : `uploads/${req.files.surat_masuk[0].filename}`
            })
            req.flash('alertMessage', 'Berhasil menambah data Surat Masuk');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    editSuratMasuk: async (req, res) => {
        try {
            const { id, tanggal, judul } = req.body;
            const suratmasuk = await Suratmasuk.findOne({_id: id});
                suratmasuk.tanggal = tanggal;
                suratmasuk.judul = judul;
                suratmasuk.surat_masuk = `uploads/${req.files.surat_masuk[0].filename}`;
                suratmasuk.save();
            req.flash('alertMessage', 'Berhasil mengubah data Surat Masuk');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    deleteSuratMasuk: async (req, res) => {
        try {
            const { id } = req.params;
            const suratmasuk = await Suratmasuk.findOne({_id: id});
            if (suratmasuk.surat_masuk) {
                await fs.unlink(path.join(`public/${suratmasuk.surat_masuk}`))
            }
            await suratmasuk.remove();
            req.flash('alertMessage', 'Data Surat Masuk berhasil dihapus');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    // akhir suratmasuk

    // surat keluar
    addSuratKeluar: async (req, res) => {
        try {
            const { judul, tanggal } = req.body;
            await Suratkeluar.create({
                judul,
                tanggal,
                surat_keluar: `uploads/${req.files.surat_keluar[0].filename}`
            })
            req.flash('alertMessage', 'Berhasil menambah data Surat Keluar')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    editSuratKeluar: async (req, res) => {
        try {
            const { id, judul, tanggal } = req.body;
            const suratkeluar = await Suratkeluar.findOne({_id: id})
                suratkeluar.judul = judul;
                if(tanggal) {
                    suratkeluar.tanggal = tanggal;
                }
                if(req.files.surat_keluar) {
                    suratkeluar.surat_keluar = `uploads/${req.files.surat_keluar[0].filename}`;
                }
                suratkeluar.save();
            req.flash('alertMessage', 'Berhasil mengubah data Surat Keluar')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    deleteSuratKeluar: async (req, res) => {
        try {
            const { id } = req.params;
            const suratkeluar = await Suratkeluar.findOne({_id: id});
            if(suratkeluar.surat_keluar) {
                await fs.unlink(path.join(`public/${suratkeluar.surat_keluar}`))
            }
            await suratkeluar.remove();
            req.flash('alertMessage', 'Data Surat Masuk berhasil dihapus');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/surat')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/surat");
        }
    },
    // akhir surat keluar

    viewPengguna: async (req, res) => {
        try {
            const users = await Users.find();
            
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/pengguna/view_pengguna", {
                title: 'Data Pengguna | T2KU BMCK Jateng',
                alert,
                users,
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPengguna: async (req, res) => {
        try {
            const { username, password} = req.body;
            await Users.create({ 
                username,
                password, 
                level: 'admin'
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Pengguna');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pengguna");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pengguna");
        }
    },
    editPengguna: async (req, res) => {
        try {
            const { id, username, password, level} = req.body;
            const users = await Users.findOne({_id: id});
                users.username = username;
                users.password = password;
                users.level = 'admin';
                await users.save();
                req.flash('alertMessage', 'Berhasil mengubah data Pengguna');
                req.flash('alertStatus', 'success');
                res.redirect("/admin/pengguna");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pengguna");
        }
    },
    deletePengguna: async (req, res) => {
        try {
            const { id } = req.params;
            const users = await Users.findOne({_id: id});
            await users.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Pengguna');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pengguna");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pengguna");
        }
    },
}