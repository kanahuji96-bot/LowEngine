const { PaymentSetting } = require('../models');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const settings = await PaymentSetting.findAll({ order: [['sort_order','ASC'],['id','ASC']] });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActive = async (req, res) => {
  try {
    const settings = await PaymentSetting.findAll({ where: { is_active: true }, order: [['sort_order','ASC']] });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { method, label, account_name, account_no, whatsapp, telegram, email, is_active, sort_order } = req.body;
    if (!method || !label) return res.status(400).json({ success: false, message: 'method dan label wajib diisi' });
    const qr_image = req.file ? req.file.filename : null;
    const setting = await PaymentSetting.create({ method, label, account_name, account_no, qr_image, whatsapp, telegram, email, is_active: is_active !== 'false', sort_order: sort_order || 0 });
    res.status(201).json({ success: true, message: 'Rekening ditambahkan', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const setting = await PaymentSetting.findByPk(req.params.id);
    if (!setting) return res.status(404).json({ success: false, message: 'Tidak ditemukan' });
    const { method, label, account_name, account_no, whatsapp, telegram, email, is_active, sort_order } = req.body;
    if (req.file && setting.qr_image) {
      const old = path.join('uploads/qris', setting.qr_image);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }
    await setting.update({
      method:       method       || setting.method,
      label:        label        || setting.label,
      account_name: account_name ?? setting.account_name,
      account_no:   account_no   ?? setting.account_no,
      qr_image:     req.file ? req.file.filename : setting.qr_image,
      whatsapp:     whatsapp     ?? setting.whatsapp,
      telegram:     telegram     ?? setting.telegram,
      email:        email        ?? setting.email,
      is_active:    is_active !== undefined ? is_active !== 'false' : setting.is_active,
      sort_order:   sort_order   ?? setting.sort_order,
    });
    res.json({ success: true, message: 'Rekening diperbarui', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const setting = await PaymentSetting.findByPk(req.params.id);
    if (!setting) return res.status(404).json({ success: false, message: 'Tidak ditemukan' });
    if (setting.qr_image) {
      const p = path.join('uploads/qris', setting.qr_image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await setting.destroy();
    res.json({ success: true, message: 'Rekening dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getActive, create, update, remove };
