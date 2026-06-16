const { ProductContent } = require('../models');

const getContent = async (req, res) => {
  try {
    let content = await ProductContent.findOne({ where: { product_id: req.params.product_id } });
    if (!content) {
      content = { product_id: req.params.product_id, table_of_contents: '[]', features: '[]', full_description: '', demo_links: '[]' };
    }
    const data = {
      ...content.dataValues || content,
      table_of_contents: JSON.parse(content.table_of_contents || '[]'),
      features: JSON.parse(content.features || '[]'),
      demo_links: JSON.parse(content.demo_links || '[]'),
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveContent = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { table_of_contents, features, full_description, demo_links } = req.body;
    const [content] = await ProductContent.findOrCreate({
      where: { product_id },
      defaults: { product_id, table_of_contents: '[]', features: '[]', full_description: '', demo_links: '[]' },
    });
    await content.update({
      table_of_contents: JSON.stringify(table_of_contents || []),
      features: JSON.stringify(features || []),
      full_description: full_description || '',
      demo_links: JSON.stringify(demo_links || []),
    });
    res.json({ success: true, message: 'Content disimpan', data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContent, saveContent };
