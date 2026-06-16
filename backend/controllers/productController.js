const { Product, Category, Review, User } = require('../models');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const { category_id, status, search, section } = req.query;
    const where = {};
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (section) where.section = section;
    if (search) {
      const { Op } = require('sequelize');
      where.name = { [Op.like]: `%${search}%` };
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Review, include: [{ model: User, attributes: ['id', 'name'] }] },
      ],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { category_id, name, price, stock, description, status } = req.body;
    if (!category_id || !name || !price) {
      return res.status(400).json({ success: false, message: 'category_id, name, price wajib diisi' });
    }

    let slug = slugify(name, { lower: true, strict: true });
    // pastikan slug unik
    const existing = await Product.findOne({ where: { slug } });
    if (existing) slug = slug + '-' + Date.now();

    const image = req.file ? req.file.filename : null;
    const product = await Product.create({
      category_id, name, slug,
      price, stock: stock || 0, image, description,
      status: status || 'active',
      section: req.body.section || 'none',
    });
    res.status(201).json({ success: true, message: 'Produk berhasil dibuat', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });

    const { category_id, name, price, stock, description, status } = req.body;

    // jika ada gambar baru, hapus lama
    if (req.file && product.image) {
      const oldPath = path.join('uploads/products', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    let slug = product.slug;
    if (name && name !== product.name) {
      slug = slugify(name, { lower: true, strict: true });
      const existing = await Product.findOne({ where: { slug } });
      if (existing && existing.id !== product.id) slug = slug + '-' + Date.now();
    }

    await product.update({
      category_id: category_id || product.category_id,
      name: name || product.name,
      slug,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      image: req.file ? req.file.filename : product.image,
      description: description ?? product.description,
      status: status || product.status,
      section: req.body.section || product.section,
    });

    res.json({ success: true, message: 'Produk berhasil diperbarui', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    await product.destroy();
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
