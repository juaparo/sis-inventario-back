import UserAdapter from '../adapters/MongooseUserAdapter.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'El correo es requerido' });

  try {
    const user = await UserAdapter.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Por seguridad, retornamos 200 aunque el correo no exista
      return res.status(200).json({ message: 'Si el correo existe, se ha generado un enlace de recuperación' });
    }

    // Generar token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Simulando el envío de correo
    const resetUrl = `http://localhost:4200/reset-password/${resetToken}`;
    
    return res.status(200).json({
      message: 'Simulación de correo: Token generado exitosamente',
      simulatedEmailUrl: resetUrl // Esto lo mostrará el front como alerta interactiva
    });

  } catch (error) {
    console.error('Error en forgot password:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'La nueva contraseña es requerida' });

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ message: 'La contraseña no cumple con los requisitos de seguridad obligatorios' });
  }

  try {
    const user = await UserAdapter.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'El token de recuperación es inválido o ha expirado' });
    }

    user.password = password; // Se encriptará gracias al hook pre-save de mongoose
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error en reset password:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
