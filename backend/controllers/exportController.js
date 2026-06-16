const { Order, User, Payment } = require('../models');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

const exportExcel = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['created_at', 'DESC']],
    });

    const data = orders.map((o) => ({
      'Order ID': o.id,
      User: o.User ? o.User.name : '-',
      'Total (Rp)': parseFloat(o.total_amount),
      Status: o.status,
      Tanggal: new Date(o.created_at).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportPDF = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['created_at', 'DESC']],
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('TOKO JUALAN', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Laporan Data Order', { align: 'center' });
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' });
    doc.moveDown(1);

    // Table header
    const col = { id: 50, user: 160, total: 320, status: 420, date: 490 };
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('ID', col.id, doc.y);
    doc.text('User', col.user, doc.y - 12);
    doc.text('Total', col.total, doc.y - 12);
    doc.text('Status', col.status, doc.y - 12);
    doc.text('Tanggal', col.date, doc.y - 12);

    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown(0.3);

    // Table rows
    doc.font('Helvetica').fontSize(9);
    orders.forEach((o) => {
      const y = doc.y;
      doc.text(String(o.id), col.id, y, { width: 100 });
      doc.text(o.User ? o.User.name : '-', col.user, y, { width: 150 });
      doc.text('Rp ' + Number(o.total_amount).toLocaleString('id-ID'), col.total, y, { width: 90 });
      doc.text(o.status, col.status, y, { width: 60 });
      doc.text(new Date(o.created_at).toLocaleDateString('id-ID'), col.date, y, { width: 70 });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exportExcel, exportPDF };
