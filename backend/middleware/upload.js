const multer = require('multer');
const path = require('path');

// Storage untuk produk
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + unique + path.extname(file.originalname));
  },
});

// Storage untuk payment proof
const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'payment-' + unique + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file jpg, jpeg, png yang diizinkan'), false);
  }
};

const paymentFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file jpg, jpeg, png, pdf yang diizinkan'), false);
  }
};

const uploadProduct = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const uploadPayment = multer({
  storage: paymentStorage,
  fileFilter: paymentFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Storage untuk services
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'service-' + unique + path.extname(file.originalname));
  },
});

const uploadService = multer({
  storage: serviceStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Storage untuk gallery produk
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'gallery-' + unique + path.extname(file.originalname));
  },
});

const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Storage untuk QRIS
const qrisStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/qris/') },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'qris-' + unique + path.extname(file.originalname))
  },
})
const uploadQris = multer({ storage: qrisStorage, fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } })

module.exports = { uploadProduct, uploadPayment, uploadService, uploadGallery, uploadQris };
