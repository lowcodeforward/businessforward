const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

function generateToken(user) {
  const payload = {
    sub: user.id,
    role: user.role
  };
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = {
  async register(req, res) {
    try {
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
      const token = generateToken(user);
      return res.status(201).json({
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      const token = generateToken(user);
      return res.json({ token, user: user.toJSON() });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao realizar login' });
    }
  },

  async profile(req, res) {
    return res.json({ user: req.user.toJSON() });
  }
};
