const { v4: uuidv4 } = require('uuid');
const { Product } = require('../models');

module.exports = {
  async list(req, res) {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  },

  async getById(req, res) {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  },

  async create(req, res) {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({
      id: uuidv4(),
      name,
      description,
      price,
      stock: stock ?? 0
    });
    res.status(201).json(product);
  },

  async update(req, res) {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    const { name, description, price, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    await product.save();
    res.json(product);
  },

  async remove(req, res) {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    await product.destroy();
    res.status(204).send();
  }
};
