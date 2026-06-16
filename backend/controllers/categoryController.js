const { Category, Product } = require('../models');

const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, message: 'Kategori berhasil dibuat', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    const { name, description } = req.body;
    await category.update({ name: name || category.name, description: description ?? category.description });
    res.json({ success: true, message: 'Kategori berhasil diperbarui', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    await category.destroy();
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
