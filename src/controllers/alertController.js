import AlertAdapter from '../adapters/MongooseAlertAdapter.js';

export const getAlerts = async (req, res) => {
  try {
    const alerts = await AlertAdapter.findAll({}, ['product']);
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAlert = await AlertAdapter.update(id, { read: true });
    res.status(200).json(updatedAlert);
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
