const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

module.exports = {
  async list(req, res) {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users.map(user => user.toJSON()));
  },

  async getById(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user.toJSON());
  },

  async create(req, res) {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email já registrado' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      passwordHash,
      role: role || 'user'
    });
    res.status(201).json(user.toJSON());
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'Email já registrado' });
      }
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    if (role) {
      user.role = role;
    }
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json(user.toJSON());
  },

  async remove(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    await user.destroy();
    res.status(204).send();
  }
};
