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

import AuthStrategyContext from '../strategies/AuthStrategyContext.js';
import RoleAdapter from '../adapters/MongooseRoleAdapter.js';

export const authorizeAction = (action) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'No tienes permisos suficientes.' });
      }

      // Obtener el nombre del rol a partir del ID en el token
      const roleDoc = await RoleAdapter.findById(req.user.role);
      if (!roleDoc) {
        return res.status(403).json({ message: 'Rol inválido.' });
      }

      const strategyContext = new AuthStrategyContext(roleDoc.name);
      if (!strategyContext.canAccess(action)) {
        return res.status(403).json({ message: 'Acceso denegado a esta funcionalidad.' });
      }

      next();
    } catch (error) {
      console.error('Error in authorizeAction:', error);
      return res.status(500).json({ message: 'Error interno de validación' });
    }
  };
};
