import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET || 'supersecretkeyforinventoryapp123!';
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Inyectar datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acceso denegado. Token inválido o expirado.' });
  }
};
