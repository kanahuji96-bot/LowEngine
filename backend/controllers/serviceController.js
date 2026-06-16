const { Service } = require('../models');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      const { Op } = require('sequelize');
      where.title = { [Op.like]: `%${search}%` };
    }
    const services = await Service.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service tidak ditemukan' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, content, tags, date, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Judul wajib diisi' });
    const image = req.file ? req.file.filename : null;
    const service = await Service.create({ title, description, content, image, tags, date, status: status || 'active' });
    res.status(201).json({ success: true, message: 'Service berhasil dibuat', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service tidak ditemukan' });
    const { title, description, content, tags, date, status } = req.body;
    if (req.file && service.image) {
      const oldPath = path.join('uploads/services', service.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await service.update({
      title: title || service.title,
      description: description ?? service.description,
      content: content ?? service.content,
      image: req.file ? req.file.filename : service.image,
      tags: tags ?? service.tags,
      date: date || service.date,
      status: status || service.status,
    });
    res.json({ success: true, message: 'Service diperbarui', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service tidak ditemukan' });
    if (service.image) {
      const imgPath = path.join('uploads/services', service.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await service.destroy();
    res.json({ success: true, message: 'Service dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
