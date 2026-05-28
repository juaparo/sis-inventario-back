import { DashboardFacade } from '../facades/DashboardFacade.js';

export const getDashboardInfo = async (req, res) => {
  try {
    const data = await DashboardFacade.getDashboardData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error interno del servidor al procesar el dashboard' });
  }
};
