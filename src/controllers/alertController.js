import Alert from '../models/Alert.js';

// S - Cada función tiene UNA sola responsabilidad
// O - createAlert es exportada para ser usada por otros controladores (movimientos, productos)
//     sin modificar este archivo

// Obtener todas las alertas
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return res.status(500).json({ message: 'Error al obtener las alertas' });
  }
};

// Obtener solo alertas no leídas
export const getUnreadAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ leida: false }).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error('Error al obtener alertas no leídas:', error);
    return res.status(500).json({ message: 'Error al obtener las alertas no leídas' });
  }
};

// Marcar una alerta como leída
export const marcarLeida = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }
    alert.leida = true;
    await alert.save();
    return res.status(200).json(alert);
  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
    return res.status(500).json({ message: 'Error al marcar la alerta como leída' });
  }
};

// Marcar todas las alertas no leídas como leídas
export const marcarTodasLeidas = async (req, res) => {
  try {
    await Alert.updateMany({ leida: false }, { leida: true });
    return res.status(200).json({ message: 'Todas las alertas marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas las alertas como leídas:', error);
    return res.status(500).json({ message: 'Error al marcar todas las alertas' });
  }
};

// D - Función utilitaria desacoplada: otros controladores (movimientos, productos)
//     la importan y la llaman sin depender del request/response HTTP
export const createAlert = async ({ mensaje, tipoOrigen, referenciaId }) => {
  const alert = new Alert({ mensaje, tipoOrigen, referenciaId });
  await alert.save();
  return alert;
};
