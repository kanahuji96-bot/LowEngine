const { ProductGallery } = require('../models');
const fs = require('fs');
const path = require('path');

// Get gallery by product
const getGallery = async (req, res) => {
  try {
    const gallery = await ProductGallery.findAll({
      where: { product_id: req.params.product_id },
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
    });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload single image to gallery
const addImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'File gambar wajib diupload' });
    const { product_id } = req.params;
    const { sort_order } = req.body;
    const item = await ProductGallery.create({
      product_id,
      image: req.file.filename,
      sort_order: sort_order || 0,
    });
    res.status(201).json({ success: true, message: 'Gambar berhasil diupload', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete image from gallery
const deleteImage = async (req, res) => {
  try {
    const item = await ProductGallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gambar tidak ditemukan' });
    // Hapus file fisik
    const imgPath = path.join('uploads/gallery', item.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    await item.destroy();
    res.json({ success: true, message: 'Gambar dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete all gallery images for a product
const clearGallery = async (req, res) => {
  try {
    const items = await ProductGallery.findAll({ where: { product_id: req.params.product_id } });
    for (const item of items) {
      const imgPath = path.join('uploads/gallery', item.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await ProductGallery.destroy({ where: { product_id: req.params.product_id } });
    res.json({ success: true, message: 'Semua gambar gallery dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGallery, addImage, deleteImage, clearGallery };
