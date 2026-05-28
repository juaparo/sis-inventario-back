import UserAdapter from '../adapters/MongooseUserAdapter.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son requeridos' });
    }

    const user = await UserAdapter.findOne({ email: email.toLowerCase() }, ['role']);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'El usuario se encuentra inactivo' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role._id },
      process.env.JWT_SECRET || 'supersecretkeyforinventoryapp123!',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions || []
      }
    });
  } catch (error) {
    console.error('Error en login controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
