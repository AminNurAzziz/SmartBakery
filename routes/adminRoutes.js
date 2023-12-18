const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const bahan = require('../controllers/bahanController');
const transaksi = require('../controllers/transaksiController');
const iklanKasir = require('../controllers/kasirController');
const { isLoggedIn, isAdmin } = require('../middleware');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        const isDeleted = req.body.deleted === 'true';
        const filePrefix = isDeleted ? 'delete-' : '';
        const originalname = file.originalname; // Ambil nama asli file
        const extension = path.extname(originalname); // Ambil ekstensi file
        const newFilename = filePrefix + Date.now() + '-' + 'Produk' + extension; // Set nama file baru dengan ekstensi
        cb(null, newFilename); // Set the filename of the uploaded image
    }
});

const upload = multer({ storage: storage });

router.route('/produk')
    .get(isLoggedIn, isAdmin, produk.index)

router.route('/produk/new')
    .get(isLoggedIn, isAdmin, produk.renderNewForm)
    .post(isLoggedIn, isAdmin, upload.single('gambar'), produk.create);

router.route('/produk/edit/:id')
    .get(isLoggedIn, isAdmin,produk.renderEditForm)
    .patch(isLoggedIn, isAdmin,produk.update);

router.route('/produk/delete/:id')
    .delete(isLoggedIn, isAdmin,produk.delete);

router.route('/bahan')
    .get(isLoggedIn, isAdmin,bahan.index);

router.route('/bahan/new')
    .get(isLoggedIn, isAdmin,bahan.renderNewForm)
    .post(isLoggedIn, isAdmin,bahan.create);

router.route('/bahan/edit/:id')
    .get(isLoggedIn, isAdmin,bahan.renderEditForm)
    .patch(isLoggedIn, isAdmin,bahan.update);

router.route('/bahan/delete/:id')
    .delete(isLoggedIn, isAdmin,bahan.delete);

router.route('/produk/:id')
    .get(isLoggedIn, isAdmin,produk.show);

router.route('/produk/:id/resep/new')
    .post(isLoggedIn, isAdmin,produk.createResep);

router.route('/:kategori')
    // .get(isLoggedIn, isAdmin,transaksi.getTransaksi);
    .get(transaksi.getTransaksi);

router.route('/moveTransaksiDalamProses/:idTransaksi/:idProduk/:jumlah')
    .post(isLoggedIn, isAdmin,transaksi.moveTransaksiDalamProses);

router.route('/moveTransaksiSelesai/:idTransaksi/:idProduk/:jumlah')
    .post(isLoggedIn, isAdmin,transaksi.moveTransaksiSelesai);

router.route('/deleteTransaksi/:idTransaksi/:idProduk/:jumlah')
    .delete(isLoggedIn, isAdmin,transaksi.deleteTransaksi);

router.route('/:kategori/RiwayatTransaksi')
    .get(isLoggedIn, isAdmin,transaksi.RiwayatTransaksi);

router.route('/:aksi')
    .post(isLoggedIn, isAdmin,transaksi.updateBobot);

router.route('/dashboard/kasir')
    .get(isLoggedIn, isAdmin,produk.dashboard);

router.route('/histori/produk')
    .get(isLoggedIn, isAdmin,produk.getHistory);

router.route('/histori/bahan')
.get(isLoggedIn, isAdmin,bahan.getHistoryBahan);

router.route('/deleteHistoryBahan/:id')
    .delete(isLoggedIn, isAdmin,bahan.deleteHistoryBahan);

router.route('/deleteHistoryProduk/:id')
    .delete(isLoggedIn, isAdmin,produk.deleteHistoryProduk);

router.route('/iklan/pasangIklan')
.get(isLoggedIn, isAdmin, (req, res) => {
        const endpointku = "produkSaya"; // Data yang ingin Anda kirim ke controller
        iklanKasir.iklan(req, res, endpointku); // Mengirim data ke controller
    })
    .post(upload.fields([
        { name: 'gambar1', maxCount: 1 },
        { name: 'gambar2', maxCount: 1 },
        { name: 'gambar3', maxCount: 1 }
    ]), (req, res) => {
        const endpointku = "produkSaya"; // Data yang ingin Anda kirim ke controller
        iklanKasir.createIklan(req, res, endpointku); // Mengirim data ke controller
    });

module.exports = router;
