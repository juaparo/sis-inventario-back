import SearchFacade from '../facades/SearchFacade.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'El término de búsqueda (q) es requerido' });
    }

    const results = await SearchFacade.complexSearch(q);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error en búsqueda global:', error);
    res.status(500).json({ message: 'Error al procesar la búsqueda compleja' });
  }
};
